# 📚 Skill Librarian

<div align="center">

**Organize, Categorize, and Search Agent Skills with Ease**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/BigY0shi/skill-librarian/graphs/commit-activity)

</div>

---

## 🌟 Overview

**Skill Librarian** is a powerful tool designed to categorize and index agent skills through JSON uploads. It analyzes your skill data and creates a searchable, organized library that makes finding and managing agent capabilities a breeze.

Whether you're managing AI agent skills, developer competencies, or any categorized skill sets, Skill Librarian provides an intuitive way to keep everything organized and easily accessible.

## ✨ Features

- 📁 **JSON Upload Support** - Import skills through simple JSON file uploads
- 🔍 **Smart Search** - Quickly find skills with powerful search functionality
- 🏷️ **Auto-Categorization** - Automatically organize skills into meaningful categories
- 📊 **Data Analysis** - Gain insights from your skill data
- 🚀 **Fast Indexing** - Lightning-fast indexing for instant access to your skill library
- 🎨 **Clean Interface** - User-friendly interface for managing your skill catalog

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/BigY0shi/skill-librarian.git

# Navigate to the project directory
cd skill-librarian

# Install dependencies
npm install  # or pip install -r requirements.txt, depending on your implementation
```

### Usage

1. **Upload Your Skills**
   ```bash
   # Upload a JSON file containing your skills
   skill-librarian upload skills.json
   ```

2. **Search Skills**
   ```bash
   # Search for specific skills
   skill-librarian search "data analysis"
   ```

3. **View Categories**
   ```bash
   # List all skill categories
   skill-librarian categories
   ```

## 📋 JSON Format

Your skill JSON files should follow this structure:

```json
{
  "skills": [
    {
      "name": "Data Analysis",
      "category": "Analytics",
      "description": "Ability to analyze and interpret complex data sets",
      "proficiency": "Advanced",
      "tags": ["data", "statistics", "python"],
      "related_skills": ["Machine Learning", "Data Visualization"]
    },
    {
      "name": "Natural Language Processing",
      "category": "AI/ML",
      "description": "Processing and understanding human language",
      "proficiency": "Intermediate",
      "tags": ["nlp", "ai", "linguistics"],
      "related_skills": ["Text Mining", "Sentiment Analysis"]
    }
  ]
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | The name of the skill |
| `category` | string | The category this skill belongs to |
| `description` | string | A brief description of the skill |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `proficiency` | string | Skill level (Beginner, Intermediate, Advanced, Expert) |
| `tags` | array | Keywords associated with the skill |
| `related_skills` | array | Other skills that are related or complementary |

## 📖 Examples

### Example 1: Tech Skills

```json
{
  "skills": [
    {
      "name": "Python Programming",
      "category": "Programming Languages",
      "description": "Proficiency in Python for general-purpose programming",
      "proficiency": "Expert",
      "tags": ["python", "backend", "scripting"]
    }
  ]
}
```

### Example 2: Soft Skills

```json
{
  "skills": [
    {
      "name": "Team Collaboration",
      "category": "Soft Skills",
      "description": "Working effectively in team environments",
      "proficiency": "Advanced",
      "tags": ["teamwork", "communication", "agile"]
    }
  ]
}
```

## 🛠️ Advanced Features

### Batch Processing
Upload multiple JSON files at once:
```bash
skill-librarian upload skills/*.json
```

### Export Data
Export your organized skills to various formats:
```bash
skill-librarian export --format csv output.csv
skill-librarian export --format html skills-report.html
```

### API Integration
Integrate Skill Librarian into your applications:
```javascript
const SkillLibrarian = require('skill-librarian');

const librarian = new SkillLibrarian();
await librarian.loadSkills('skills.json');
const results = librarian.search('machine learning');
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who help make Skill Librarian better
- Inspired by the need for better skill organization in the age of AI agents

## 📧 Contact

Project Link: [https://github.com/BigY0shi/skill-librarian](https://github.com/BigY0shi/skill-librarian)

---

<div align="center">

Made with ❤️ by the Skill Librarian Team

⭐ Star us on GitHub — it helps!

</div>
