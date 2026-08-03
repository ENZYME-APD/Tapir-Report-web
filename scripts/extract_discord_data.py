import discord
import os
import asyncio
import json
from datetime import timezone

TOKEN = os.environ.get("DISCORD_TOKEN")

if not TOKEN:
    print("Error: DISCORD_TOKEN environment variable not set.")
    exit(1)

OUTPUT_DIR = "src/data"
OUTPUT_FILE_MD = os.path.join(OUTPUT_DIR, "discord_data.md")
OUTPUT_FILE_JSON = os.path.join(OUTPUT_DIR, "discord_data.json")
os.makedirs(OUTPUT_DIR, exist_ok=True)

KEYWORDS = [
    "tapir", "api", "archicad", "automation", "bug", "issue",
    "workflow", "feature", "code", "python", "c++", "script",
    "request", "plan", "future", "idea", "json", "develop",
    "endpoint", "repository", "github"
]

class ScraperClient(discord.Client):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.all_messages = []

    async def on_ready(self):
        print(f'Logged in as {self.user} (ID: {self.user.id})')
        print('Starting data extraction...')
        
        for guild in self.guilds:
            print(f'Scanning Server: {guild.name}')
            for channel in guild.text_channels:
                # Check permissions
                perms = channel.permissions_for(guild.me)
                if not perms.read_messages or not perms.read_message_history:
                    continue
                
                print(f'  Fetching history for channel: #{channel.name}')
                try:
                    # Fetch last 1000 messages
                    async for message in channel.history(limit=1000, oldest_first=False):
                        if self.is_valid_message(message):
                            self.all_messages.append({
                                'channel': channel.name,
                                'server': guild.name,
                                'author': message.author.name,
                                'created_at': message.created_at,
                                'content': message.content,
                                'url': message.jump_url
                            })
                except discord.errors.Forbidden:
                    print(f'    Forbidden to read history in {channel.name}')
                except Exception as e:
                    print(f'    Error reading {channel.name}: {e}')
        
        print('Extraction complete. Formatting and saving data...')
        self.save_data()
        
        print('Shutting down bot...')
        await self.close()

    def is_valid_message(self, message):
        if message.author.bot:
            return False
        
        content = message.content.strip().lower()
        
        if not content:
            return False
        
        if len(content) < 20:
            return False
            
        # Keyword filter for relevance
        has_keyword = any(kw in content for kw in KEYWORDS)
        if not has_keyword:
            return False
            
        return True

    def save_data(self):
        # Sort chronologically (oldest first)
        self.all_messages.sort(key=lambda x: x['created_at'])
        
        with open(OUTPUT_FILE_MD, 'w', encoding='utf-8') as f:
            f.write("# Discord Data Extraction\n\n")
            
            if not self.all_messages:
                f.write("No relevant discussions found.\n")
                return
            
            for item in self.all_messages:
                date_str = item['created_at'].strftime("%Y-%m-%d %H:%M:%S")
                f.write(f"### [#{item['channel']}] from {item['author']}\n")
                f.write(f"**Date:** {date_str} | **Server:** {item['server']} | [Link to Message]({item['url']})\n\n")
                f.write(f"{item['content']}\n\n")
                f.write("---\n\n")

        # Write to JSON
        json_data = []
        for item in self.all_messages:
            item_copy = item.copy()
            item_copy['created_at'] = item['created_at'].isoformat()
            json_data.append(item_copy)

        with open(OUTPUT_FILE_JSON, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2)
        
        print(f"Successfully wrote {len(self.all_messages)} messages to {OUTPUT_FILE_MD} and {OUTPUT_FILE_JSON}")

intents = discord.Intents.default()
intents.message_content = True

client = ScraperClient(intents=intents)
client.run(TOKEN)
