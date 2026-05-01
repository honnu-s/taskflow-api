# TaskFlow – Scalable REST API with Auth & RBAC

A production-ready REST API built with Node.js, Express, MongoDB, and JWT authentication — featuring role-based access control, full CRUD, and a React-ready frontend dashboard.

---

## 🚀 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Runtime    | Node.js 18+                   |
| Framework  | Express.js                    |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + bcryptjs                |
| Validation | express-validator             |
| Docs       | Swagger (OpenAPI 3.0)         |
| Frontend   | Vanilla JS (zero dependencies)|

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & RBAC middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes (versioned)
│   │   └── server.js       # Entry point
│   ├── docs/
│   │   └── swagger.yaml    # API documentation
│   ├── .env.example
│   └── package.json
└── frontend/
    └── index.html          # Single-file dashboard UI
```

---

## ⚙️ Setup & Run

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values:
# MONGODB_URI=mongodb://localhost:27017/taskapi
# JWT_SECRET=your_secret_here
```

### 3. Start MongoDB locally
```bash
mongod
```

### 4. Run the server
```bash
npm run dev    # development (with nodemon)
npm start      # production
```

Server runs at: `http://localhost:5000`  
Swagger docs: `http://localhost:5000/api-docs`

### 5. Open Frontend
Open `frontend/index.html` in your browser directly.

---

## 🔐 API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint    | Description            | Auth |
|--------|-------------|------------------------|------|
| POST   | /register   | Register new user      | ❌   |
| POST   | /login      | Login, receive JWT     | ❌   |
| GET    | /me         | Get current user       | ✅   |

### Tasks — `/api/v1/tasks`

| Method | Endpoint  | Description                    | Auth |
|--------|-----------|--------------------------------|------|
| GET    | /         | Get all user tasks (paginated) | ✅   |
| POST   | /         | Create new task                | ✅   |
| GET    | /:id      | Get single task                | ✅   |
| PUT    | /:id      | Update task                    | ✅   |
| DELETE | /:id      | Delete task                    | ✅   |

### Admin — `/api/v1/admin` *(admin role only)*

| Method | Endpoint      | Description          | Auth  |
|--------|---------------|----------------------|-------|
| GET    | /users        | List all users       | Admin |
| GET    | /stats        | System statistics    | Admin |
| DELETE | /users/:id    | Delete user + tasks  | Admin |

---

## 🗄️ Database Schema

### User
```js
{
  name: String (required, max 50),
  email: String (unique, required),
  password: String (hashed, never returned),
  role: Enum['user', 'admin'],
  createdAt, updatedAt
}
```

### Task
```js
{
  title: String (required, max 100),
  description: String (max 500),
  status: Enum['pending', 'in-progress', 'completed'],
  priority: Enum['low', 'medium', 'high'],
  user: ObjectId (ref: User),
  createdAt, updatedAt
}
```

---

## 🛡️ Security Features

- **Password hashing** — bcryptjs with salt rounds 12
- **JWT authentication** — signed with secret, 7-day expiry
- **Input validation** — express-validator on all routes
- **Rate limiting** — 100 requests / 15 min per IP
- **Role-based access** — middleware enforced on admin routes
- **Request size limit** — JSON body capped at 10kb

---

## 📈 Scalability Notes

### Current Architecture
Single Node.js monolith with MongoDB. Handles ~1000 concurrent users on a 2-core server.

### Scaling Path

**Horizontal Scaling:**
- Add a load balancer (Nginx/AWS ALB)
- Run multiple Node.js instances (PM2 cluster mode)
- JWT is stateless — scales across instances without shared session store

**Database Scaling:**
- MongoDB Atlas auto-sharding for write scaling
- Read replicas for read-heavy workloads
- Add indexes on `user`, `status`, `priority` fields

**Caching (Redis):**
```js
const cached = await redis.get('admin:stats');
if (cached) return res.json(JSON.parse(cached));
await redis.setEx('admin:stats', 60, JSON.stringify(stats));
```

**Microservices Split (future):**
- Auth Service (handles JWT issuance)
- Task Service (CRUD)
- Notification Service (email/push)
- API Gateway (rate limit, routing)

**Docker Deployment:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

---

## 📝 API Documentation

Interactive Swagger UI: `http://localhost:5000/api-docs`

---

## 🧪 Quick Test (curl)

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Create task (use token from login)
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","priority":"high"}'
```

---

Built by Honnu | Primetrade.ai Backend Intern Assignment
