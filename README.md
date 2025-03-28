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
## Project Structure
.
├── Dockerfile
├── LICENSE
├── README.md
├── docker-compose.yml
├── nest-cli.json
├── package-lock.json
├── package.json
├── private.pem
├── public.pem
├── src
│   ├── app.module.ts
│   ├── common
│   │   ├── database
│   │   │   ├── cache.service.ts
│   │   │   └── database.module.ts
│   │   ├── decorators
│   │   │   ├── bypass-sameuser-check.decorator.ts
│   │   │   ├── inject-redis.decorator.ts
│   │   │   ├── pagination-header.decorator.ts
│   │   │   ├── pagination.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   ├── same-user.decorator.ts
│   │   │   └── swagger.decorator.ts
│   │   ├── filters
│   │   │   ├── custom-error.filter.ts
│   │   │   ├── headers.filter.ts
│   │   │   ├── http-exception-mapping.filter.ts
│   │   │   └── http-exception.filter.ts
│   │   ├── guards
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors
│   │   │   ├── logging.interceptor.ts
│   │   │   └── serialization-interceptor.filter.ts
│   │   ├── interfaces
│   │   │   ├── access-token-payload.interface.ts
│   │   │   ├── customer.interface.ts
│   │   │   ├── hid-auth-response.interface.ts
│   │   │   ├── hid-search-request.interface.ts
│   │   │   ├── login-history.interface.ts
│   │   │   ├── refresh-token-payload.interface.ts
│   │   │   ├── statistics.interface.ts
│   │   │   ├── tokens.interface.ts
│   │   │   └── user.interface.ts
│   │   ├── middleware
│   │   │   ├── authenticate.middleware.ts
│   │   │   ├── body-parser.middleware.ts
│   │   │   ├── correlator-id.middleware.ts
│   │   │   ├── custom-header.middleware.ts
│   │   │   ├── decode.middleware.ts
│   │   │   ├── decrypt.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── tracing.middleware.ts
│   │   ├── pipes
│   │   │   ├── base-dto.pipe.ts
│   │   │   └── headers.pipe.ts
│   │   ├── types
│   │   │   ├── custom-error.filter.ts
│   │   │   ├── error-types.data.ts
│   │   │   ├── request-Info.type.ts
│   │   │   └── statistics.type.ts
│   │   └── utils
│   │       ├── request-context.util.ts
│   │       └── string.util.ts
│   ├── helper-modules
│   │   ├── app-config
│   │   │   ├── app-config.module.ts
│   │   │   ├── app-config.service.ts
│   │   │   └── logger.service.ts
│   │   └── jwt-utils
│   │       ├── jwt-utils.module.ts
│   │       ├── jwt-utils.service.ts
│   │       └── jwt.interfaces.ts
│   ├── main.ts
│   └── modules
│       └── movies
│           ├── dto
│           │   ├── create-movie.dto.ts
│           │   └── update-movie.dto.ts
│           ├── movies.controller.spec.ts
│           ├── movies.controller.ts
│           ├── movies.module.ts
│           ├── movies.service.spec.ts
│           ├── movies.service.ts
│           └── schema
│               ├── movie.interface.ts
│               └── movie.schema.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
---
## 🤝 Contributing
Contributions are welcome! Feel free to open issues and submit PRs.

---

## 📝 License
MIT License © 2025 Matthew Michelle. All rights reserved.



