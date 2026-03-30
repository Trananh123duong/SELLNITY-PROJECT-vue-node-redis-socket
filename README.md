# SELLNITY PROJECT - Vue + Node + PostgreSQL + Docker

A fullstack web application built with modern technologies for learning and real-world development.

---

## 🚀 Tech Stack

### Frontend

* Vue 3
* Vite
* Vue Router
* Pinia
* Axios

### Backend

* Node.js
* Express.js
* dotenv
* pg

### Database

* PostgreSQL
* pgAdmin

### DevOps

* Docker
* Docker Compose

---

## 📂 Project Structure

```text
SELLNITY-PROJECT-vue-node-redis-socket/
├── backend/
├── frontend/
├── docker/
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Project

### 1. Run Docker Database

```bash
cd docker
docker compose up -d
```

Available services:

* PostgreSQL: `localhost:5432`
* pgAdmin: `http://localhost:8080`

---

### 2. Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend URL:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

---

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Create `.env` inside backend folder:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_db
DB_USER=postgres
DB_PASSWORD=postgres123
```

---

## 🐘 PostgreSQL Connection

Default database config:

```text
Host: localhost
Port: 5432
Username: postgres
Password: postgres123
Database: postgres
```

---

## 💾 Persistent Storage

Database data is stored using Docker volume.

Data remains after:

```bash
docker compose down
```

Data is removed only when:

```bash
docker compose down -v
```

---

## ✨ Features

* User CRUD
* Product CRUD
* REST API
* PostgreSQL integration
* Persistent Docker volume
* Fullstack architecture

---

## 🎯 Development Flow

```text
Vue Frontend -> Express API -> PostgreSQL
```

---

## 👨‍💻 Author

Duong
