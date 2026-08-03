import os
import requests
import json
from github import Github
from datetime import datetime, timezone

from github import Github, Auth

# Configuration
REPO_NAME = "enzyme-apd/tapir-archicad-automation"
TOKEN = os.environ.get("GITHUB_TOKEN")

if not TOKEN:
    print("Error: GITHUB_TOKEN environment variable not set.")
    exit(1)

OUTPUT_DIR = "src/data"
OUTPUT_FILE_MD = os.path.join(OUTPUT_DIR, "github_data.md")
OUTPUT_FILE_JSON = os.path.join(OUTPUT_DIR, "github_data.json")

os.makedirs(OUTPUT_DIR, exist_ok=True)

auth = Auth.Token(TOKEN)
g = Github(auth=auth)
repo = g.get_repo(REPO_NAME)

def is_valid_comment(body, author):
    if not body:
        return False
    bot_names = ['github-actions[bot]', 'dependabot[bot]', 'vercel[bot]', 'renovate[bot]']
    if author in bot_names:
        return False
    if len(body.strip()) < 20:
        return False
    return True

all_items = []

print(f"Fetching Issues and PRs from {REPO_NAME}...")
# Fetch issues and PRs (PyGithub handles pagination transparently for REST)
issues = repo.get_issues(state='all')
for issue in issues:
    item_type = 'Pull Request' if issue.pull_request else 'Issue'
    
    if item_type == 'Pull Request':
        pr = issue.as_pull_request()
        if not pr.merged:
            continue
            
    if not is_valid_comment(issue.body, issue.user.login):
        continue
        
    all_items.append({
        'type': item_type,
        'title': issue.title,
        'url': issue.html_url,
        'created_at': issue.created_at,
        'body': issue.body,
        'author': issue.user.login
    })

print(f"Fetching Discussions from {REPO_NAME}...")
graphql_url = 'https://api.github.com/graphql'
headers = {
    'Authorization': f'bearer {TOKEN}',
    'Content-Type': 'application/json'
}

has_next_page = True
cursor = None

while has_next_page:
    cursor_arg = f', after: "{cursor}"' if cursor else ''
    query = f"""
    query {{
      repository(owner: "enzyme-apd", name: "tapir-archicad-automation") {{
        discussions(first: 100{cursor_arg}) {{
          pageInfo {{
            hasNextPage
            endCursor
          }}
          nodes {{
            title
            url
            createdAt
            body
            author {{
              login
            }}
          }}
        }}
      }}
    }}
    """
    response = requests.post(graphql_url, json={'query': query}, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if 'errors' in data:
            print(f"GraphQL Errors: {data['errors']}")
            break
        
        discussions_data = data['data']['repository']['discussions']
        for discussion in discussions_data['nodes']:
            author = discussion['author']['login'] if discussion['author'] else 'unknown'
            body = discussion['body']
            if is_valid_comment(body, author):
                created_at = datetime.strptime(discussion['createdAt'], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
                all_items.append({
                    'type': 'Discussion',
                    'title': discussion['title'],
                    'url': discussion['url'],
                    'created_at': created_at,
                    'body': body,
                    'author': author
                })
        
        has_next_page = discussions_data['pageInfo']['hasNextPage']
        cursor = discussions_data['pageInfo']['endCursor']
    else:
        print(f"Failed to fetch discussions: {response.text}")
        break

print("Sorting and formatting data...")
# Sort all items chronologically first
all_items.sort(key=lambda x: x['created_at'])

# Write to markdown categorized
with open(OUTPUT_FILE_MD, 'w', encoding='utf-8') as f:
    f.write(f"# GitHub Data Extraction: {REPO_NAME}\n\n")
    
    categories = ['Issue', 'Pull Request', 'Discussion']
    
    for category in categories:
        f.write(f"## {category}s\n\n")
        items_in_category = [item for item in all_items if item['type'] == category]
        
        if not items_in_category:
            f.write(f"No {category.lower()}s found matching criteria.\n\n")
            continue
            
        for item in items_in_category:
            date_str = item['created_at'].strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"### {item['title']}\n")
            f.write(f"**Date:** {date_str} | **Author:** {item['author']} | [Link]({item['url']})\n\n")
            f.write(f"{item['body']}\n\n")
            f.write("---\n\n")

# Write to JSON
json_data = []
for item in all_items:
    item_copy = item.copy()
    item_copy['created_at'] = item['created_at'].isoformat()
    json_data.append(item_copy)

with open(OUTPUT_FILE_JSON, 'w', encoding='utf-8') as f:
    json.dump(json_data, f, indent=2)

print(f"Successfully wrote data to {OUTPUT_FILE_MD} and {OUTPUT_FILE_JSON}")
