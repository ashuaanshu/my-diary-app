# 📓 My Diary App

A beautiful and modern personal diary/journal application built with React.

Track your emotions, write your daily thoughts, organize memories with tags, and securely store everything inside your own Google Spreadsheet using SheetDB.

---

# ✨ Features

## 📝 Diary Entry Management

* Create diary entries
* Edit existing entries
* Delete entries
* View full journal notes in beautiful modals

---

## 😊 Mood Tracking

Track your emotions with mood categories:

* ✨ Joyful
* 😊 Happy
* 😐 Neutral
* 😔 Sad
* 😰 Anxious
* 😤 Angry

Each mood includes:

* custom emoji
* unique colors
* mood statistics tracking

---

# ☁️ Store Data Using SheetDB + Google Sheets

Save all your diary entries directly into your own Google Spreadsheet using SheetDB.

✅ No traditional database required
✅ Easy cloud storage setup
✅ Access your data anytime
✅ Your spreadsheet becomes your personal diary database

### 📊 Store Data in Your Spreadsheet

Connect your Google Sheet with SheetDB and instantly use it as a backend for your diary app.

---

## 🔍 Search & Filter

Users can:

* Search diary entries
* Filter by mood
* Sort by newest or oldest entries

---

## 🏷️ Tags Support

Organize entries with custom tags.

Example:

```text id="x1g5zv"
gratitude, work, travel, family
```

Tags are displayed beautifully as pills/chips.

---

## 🌙 Dark Mode Support

Automatic dark mode using:

```css id="gsyq6d"
@media (prefers-color-scheme: dark)
```

---

## 📱 Responsive Design

Works perfectly on:

* Desktop
* Tablet
* Mobile devices

---

# 🛠️ Tech Stack

* React
* JavaScript
* SheetDB API
* Google Sheets
* CSS-in-JS
* LocalStorage

---

# 📂 Project Structure

```bash id="7ew7ut"
src/
│
├── App.js
├── components/
├── assets/
└── styles/
```

---

# 🚀 Installation

## 1. Clone Repository

```bash id="3kdu5o"
git clone https://github.com/ashuaanshu/my-diary-app
cd my-diary-app
```

---

## 2. Install Dependencies

```bash id="8xk2nl"
npm install
```

or

```bash id="mf23xv"
yarn install
```

---

## 3. Start Development Server

```bash id="cbz3mn"
npm start
```

Runs on:

```text id="6y0v5j"
http://localhost:5173
```

---

# ☁️ Setup Google Sheets + SheetDB

## Step 1: Create Google Spreadsheet

Create these columns:

```text id="5dmhsg"
id
title
date
mood
content
tags
```

---

## Step 2: Connect with SheetDB

1. Visit:
   https://sheetdb.io

2. Connect your Google Spreadsheet

3. Generate API URL

Example:

```text id="2y6o9x"
https://sheetdb.io/api/v1/your-api-id
```

---

## Step 3: Connect Inside App

Paste the API URL into:

```text id="xtswdn"
🔗 SheetDB URL
```

Click:

```text id="1hsh1z"
Connect
```

Your diary is now connected to Google Sheets.

---

# 📸 Features Overview

## ✍️ Create New Entry

Users can:

* write daily thoughts
* select mood
* add tags
* choose custom dates

---

## 📖 View Entries

Beautiful reading modal with:

* mood styling
* formatted date
* tags display

---

## ✏️ Edit Entries

Update:

* title
* content
* mood
* date
* tags

---

## 🗑️ Delete Entries

Confirmation modal prevents accidental deletion.

---

# 📊 Mood Statistics Dashboard

Track emotional patterns using mood counters.

Displays:

* total happy entries
* sad entries
* joyful moments
* emotional trends

---

# 🎨 UI Features

* Modern clean design
* Glassmorphism header
* Smooth animations
* Animated modals
* Gradient buttons
* Toast notifications
* Responsive cards
* Beautiful typography

---

# 🧠 State Management

The app uses React hooks:

```javascript id="p3x6j8"
useState()
useEffect()
useCallback()
```

for:

* data fetching
* modal management
* filtering
* loading states
* UI interactions

---

# 💾 Local Storage Support

The SheetDB URL is saved locally using:

```javascript id="0b67c0"
localStorage
```

so users don't need to reconnect every time.

---

# 📦 Example Entry Object

```json id="2u14n9"
{
  "id": "1728292929",
  "title": "A peaceful day",
  "date": "2026-05-14",
  "mood": "Happy",
  "content": "Today was productive and relaxing.",
  "tags": "gratitude, work"
}
```

---

# ⚠️ Current Limitations

* No authentication system
* Public SheetDB URL exposure
* No encryption
* No offline support
* No image uploads
* No markdown editor

---

# 🔮 Future Improvements

Planned features:

* User authentication
* AI mood analysis
* Charts & analytics
* Rich text editor
* PDF export
* Calendar timeline
* Image uploads
* End-to-end encryption
* Backend API integration

---

# 📱 Responsive & Modern UI

Designed for:

* journaling
* productivity
* emotional tracking
* personal reflection

with smooth and modern user experience.

---

# 🧑‍💻 Author

Built with ❤️ using React + SheetDB + Google Sheets.

---

# 📄 License

MIT License
