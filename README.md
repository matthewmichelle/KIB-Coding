# Movies API

This project is a **NestJS-based Movies API** that integrates **MongoDB** for data storage and **Redis** for caching. The API allows users to perform CRUD operations on movies while leveraging Redis to optimize performance.

---

## 🚀 Features
- **Movies CRUD API** (Create, Read, Update, Delete)
- **MongoDB Database** for persistent storage
- **Redis Caching** to improve response time
- **Swagger API Documentation**
- **DTO Validation** using `class-validator`
- **Modular Architecture** for scalability

---

## 🛠️ Tech Stack
- **NestJS** (Backend framework)
- **MongoDB** (Database)
- **Redis** (Caching layer)
- **Mongoose** (ODM for MongoDB)
- **Swagger** (API Documentation)

---

## 🏗️ Installation

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/matthewmichelle/KIB-Coding.git
cd KIB-Coding
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Setup Environment Variables**
Create a `.env` file and add the following:
```env
MONGO_URI=mongodb://localhost:27017/KIB
REDIS_URL=redis://localhost:6379
PORT=8080
```

### 4️⃣ **Run MongoDB and Redis** (Docker)
```sh
docker run --name mongodb -p 27017:27017 -d mongo
docker run --name redis -p 6379:6379 -d redis
```

---

## 🏃 Running the Application

### 🔹 **Development Mode**
```sh
npm run start:dev
```

### 🔹 **Production Mode**
```sh
npm run build
npm run start:prod
```

### 🔹 **Running with Docker**
```sh
docker-compose up -d
```

---

## 📖 API Documentation (Swagger)
After starting the server, visit:
```
http://localhost:8080/api
```

---

## 🛠️ API Endpoints

### 🔹 **Movies Endpoints**
| Method | Endpoint       | Description               |
|--------|--------------|---------------------------|
| GET    | `/movies`    | Get all movies            |
| GET    | `/movies/:id` | Get movie by ID           |
| POST   | `/movies`    | Create a new movie        |
| PUT    | `/movies/:id` | Update an existing movie  |
| DELETE | `/movies/:id` | Delete a movie            |

---
## 🤝 Contributing
Contributions are welcome! Feel free to open issues and submit PRs.

---

## 📝 License
MIT License © 2025 Matthew Michelle. All rights reserved.

