import os
import copy
import json
import re

SKILLS_DIR = r"c:\Users\Yoshi\.gemini\antigravity\skills"
OUTPUT_DIR = r"C:\Users\Yoshi\.gemini\antigravity\brain\80fcdc24-8a24-4e57-aac7-dee4f7dba5be"

CATEGORIES = {
    "Infrastructure": ["proxmox", "homelab", "docker", "server", "network", "cloud", "deploy"],
    "AI & Agents": ["agent", "ai", "claude", "gemini", "assistant", "persona", "llm", "humanlayer"],
    "Development & Specialized Skills": ["fullstack", "frontend", "backend", "code", "dev", "react", "ui", "ux", "web", "3d"],
    "Creative & Content": ["design", "marketing", "illustrator", "creative", "art"],
    "Utilities": ["script", "utility", "tool", "helper", "mcp", "cli"],
    "Core Functionality": ["rule", "workflow", "system", "manager", "asset librarian"]
}

def parse_frontmatter(content):
    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if match:
        yaml_content = match.group(1)
        data = {}
        for line in yaml_content.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                data[key.strip()] = value.strip().strip('"')
        return data
    return {}

def classify_skill(name, description):
    text = (name + " " + description).lower()
    for category, keywords in CATEGORIES.items():
        for keyword in keywords:
            if keyword in text:
                return category
    return "Utilities" # Default

skills = []

for item in os.listdir(SKILLS_DIR):
    item_path = os.path.join(SKILLS_DIR, item)
    if os.path.isdir(item_path):
        skill_md_path = os.path.join(item_path, "SKILL.md")
        # specific handling for the 'Rules' folder which might contain rules.md instead or just be special
        if item.lower() == "rules":
             skills.append({
                "name": "Rules",
                "path": "skills/Rules",
                "category": "Core Functionality",
                "description": "System rules and operational guidelines.",
                "tags": ["rules", "core"]
            })
             continue

        if os.path.exists(skill_md_path):
            with open(skill_md_path, 'r', encoding='utf-8') as f:
                content = f.read()
                metadata = parse_frontmatter(content)
                # content_name = metadata.get('name', item) # OLD logic
                
                # Logic: Use folder name as the primary Name
                name = item 
                
                description = metadata.get('description', 'No description provided.')
                
                # Check if internal name differs and append if so
                internal_name = metadata.get('name')
                if internal_name and internal_name != name:
                    description = f"**{internal_name}**: {description}"
                
                category = classify_skill(internal_name or name, description)
                
                skills.append({
                    "name": name,
                    "path": f"skills/{item}",
                    "category": category,
                    "description": description,
                    "tags": [] 
                })
        else:
             # Fallback: Check for README.md
             readme_path = os.path.join(item_path, "README.md")
             description = "No SKILL.md found."
             if os.path.exists(readme_path):
                  with open(readme_path, 'r', encoding='utf-8') as f:
                       # Read first few lines for description
                       content = f.read(500) 
                       description = f"derived from README: {content[:100].replace(chr(10), ' ')}..."
             
             # Attempt to classify based on folder name
             category = classify_skill(item, description)
             
             skills.append({
                "name": item,
                "path": f"skills/{item}",
                "category": category, 
                "description": description,
                "tags": []
             })

# Sort skills by Category then Name
skills.sort(key=lambda x: (x['category'], x['name']))

# Generate JSON
json_path = os.path.join(OUTPUT_DIR, "skill_inventory.json")
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(skills, f, indent=2)

# Generate Markdown
md_path = os.path.join(OUTPUT_DIR, "skill_inventory.md")
with open(md_path, 'w', encoding='utf-8') as f:
    f.write("# Skill Inventory\n\n")
    f.write("| Name | Category | Description | Path |\n")
    f.write("|---|---|---|---|\n")
    for skill in skills:
        # Escape pipes in description to avoid breaking table
        desc = skill['description'].replace('|', r'\|')
        f.write(f"| {skill['name']} | {skill['category']} | {desc} | [`{skill['path']}`]({skill['path']}) |\n")

print(f"Generated {json_path} and {md_path}")
print(f"Total skills found: {len(skills)}")
