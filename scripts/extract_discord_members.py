"""
Daily snapshot of the Discord server's member count.

Writes/updates src/data/discord_members.json with one entry per UTC date
(re-running on the same day overwrites that day's entry instead of duplicating it).

Sources, in order of preference:
  1. Exact count via the bot (GET /guilds/{id}/members), bots excluded.
     Needs DISCORD_TOKEN and the "Server Members Intent" switched on for the bot
     in the Discord Developer Portal. If it isn't, Discord answers 403 and we fall back.
  2. Approximate count from the public invite (GET /invites/{code}?with_counts=true).
     No auth needed; includes bots.
"""

import json
import os
import sys
import time
from datetime import datetime, timezone

import requests

API = "https://discord.com/api/v10"
INVITE_CODE = os.environ.get("DISCORD_INVITE_CODE", "FZAM7Fbg7C")  # the invite linked on the site
TOKEN = os.environ.get("DISCORD_TOKEN")
OUTPUT_FILE = os.path.join("src", "data", "discord_members.json")


def get(url, headers=None, params=None):
    """GET with a simple retry on Discord rate limits."""
    for _ in range(5):
        r = requests.get(url, headers=headers, params=params, timeout=30)
        if r.status_code == 429:
            time.sleep(float(r.json().get("retry_after", 1)) + 0.5)
            continue
        return r
    return r


def invite_counts():
    r = get(f"{API}/invites/{INVITE_CODE}", params={"with_counts": "true"})
    r.raise_for_status()
    d = r.json()
    return {
        "guild_id": d["guild"]["id"],
        "guild_name": d["guild"]["name"],
        "approx_members": d.get("approximate_member_count"),
        "approx_online": d.get("approximate_presence_count"),
    }


def exact_counts(guild_id):
    """Return (humans, bots) or None if the bot can't list members."""
    if not TOKEN:
        print("No DISCORD_TOKEN; skipping exact member count.")
        return None
    headers = {"Authorization": f"Bot {TOKEN}"}
    humans = bots = 0
    after = "0"
    while True:
        r = get(f"{API}/guilds/{guild_id}/members", headers=headers,
                params={"limit": 1000, "after": after})
        if r.status_code in (401, 403):
            print(f"Bot can't list members (HTTP {r.status_code}). "
                  "Enable 'Server Members Intent' in the Developer Portal for exact, bot-free counts.")
            return None
        r.raise_for_status()
        page = r.json()
        for m in page:
            if m["user"].get("bot"):
                bots += 1
            else:
                humans += 1
        if len(page) < 1000:
            return humans, bots
        after = page[-1]["user"]["id"]


def main():
    info = invite_counts()
    exact = exact_counts(info["guild_id"])

    today = datetime.now(timezone.utc).date().isoformat()
    entry = {
        "date": today,
        "total_members": info["approx_members"],
        "online": info["approx_online"],
    }
    if exact:
        humans, bots = exact
        entry.update({"members": humans, "bots": bots, "source": "bot"})
    else:
        # Approximate, bots included
        entry.update({"members": info["approx_members"], "bots": None, "source": "invite"})

    data = {"guild_id": info["guild_id"], "guild_name": info["guild_name"], "history": []}
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, encoding="utf-8") as f:
            data["history"] = json.load(f).get("history", [])

    prev = data["history"][-1]["members"] if data["history"] else None
    data["history"] = [h for h in data["history"] if h["date"] != today] + [entry]
    data["history"].sort(key=lambda h: h["date"])
    data["updated_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"{info['guild_name']}: {entry['members']} members ({entry['source']}), "
          f"previous snapshot: {prev}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # never leave a half-written file; let the workflow flag the step
        print(f"Member snapshot failed: {e}", file=sys.stderr)
        sys.exit(1)
