# 🧠 Athena Backend

Athena is a backend service that allows you to search for developer profiles (e.g., "Java Developer") on GitHub. It scrapes relevant data from GitHub, stores it in MongoDB, and returns the result via a REST API.

---

## 📌 Features

- 🔍 Search GitHub for developers using custom queries
- 🕷️ Scrape developer-related data from GitHub
- 💾 Store the data in MongoDB
- 🧭 RESTful API to access the scraped data
- 🚀 Easily run in development or production

---

## 📁 Project Structure

athena-backend/
├── controllers/
├── models/
├── routes/
├── utils/
├── .env
├── server.js
├── package.json
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sajal-123/athena.git
cd athena-backend
```
### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### ▶️ Running the Project

```bash
npm run dev
```

### 5. Production Mode

```bash
npm run build
npm start
```
