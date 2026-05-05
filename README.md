# 📺 YouTube Clone — Backend

A production-ready REST API for a YouTube-like video streaming platform built with Node.js, Express, and MongoDB.

> 👨‍💻 **Role:** Backend Developer — API design, authentication system, database schema, file upload pipeline, and server architecture.

---

## ✨ Features

- JWT Authentication with **Access & Refresh Token** rotation
- User registration with **avatar & cover image upload** (Cloudinary)
- **HTTP-only cookie** based token storage
- Video upload, retrieval, and management
- Channel **subscription system**
- **Role-Based Access Control** (user / admin)
- Centralized error handling with custom `ApiError` & `ApiResponse` classes
- Async error wrapper (`asyncHandler`) — no try/catch boilerplate in controllers

---

## 🛠 Tech Stack

| Package | Purpose |
|---|---|
| Node.js + Express.js | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| jsonwebtoken | Access & refresh token auth |
| bcryptjs | Password hashing |
| cookie-parser | HTTP-only cookie handling |
| Multer | Local file upload handling |
| Cloudinary | Cloud media storage |
| dotenv | Environment config |
| Prettier | Code formatting |

---

## 🏗 Project Structure

```
src/
├── controllers/
│   ├── user.controller.js      # Register, login, profile, token refresh
│   ├── video.controller.js     # Upload, fetch, delete videos
│   └── admin.controller.js     # Admin-only user & video management
│
├── models/
│   ├── user.models.js          # User schema with auth methods
│   ├── video.model.js          # Video schema
│   └── subscription.model.js   # Channel subscription schema
│
├── routes/
│   ├── user.route.js
│   ├── video.route.js
│   └── admin.route.js
│
├── middlewares/
│   ├── auth.middleware.js       # JWT verification
│   ├── multer.middleware.js     # File upload handling
│   └── checkAdmin.js           # Admin role guard
│
├── utility/
│   ├── ApiError.js             # Custom error class
│   ├── ApiResponse.js          # Consistent response wrapper
│   ├── AsyncHandler.js         # Async error handler
│   └── cloudinary.js           # Cloudinary upload helper
│
└── index.js                    # App entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

```bash
# Clone the repo
git clone https://github.com/SujalHammad/youtube-clone-backend.git
cd youtube-clone-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your values

# Start dev server
npm run dev
```

Server runs at: `http://localhost:8080`

---

## 🔧 Environment Variables

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📡 API Reference

### Auth & Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users/register` | ✗ | Register with avatar upload |
| `POST` | `/api/users/login` | ✗ | Login, receive tokens in cookies |
| `GET` | `/api/users/profile` | ✓ | Get logged-in user profile |

### Videos

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/videos` | ✓ | Upload video to Cloudinary |
| `GET` | `/api/videos` | ✓ | Get all videos |
| `GET` | `/api/videos/:id` | ✓ | Get single video |
| `DELETE` | `/api/videos/:id` | ✓ | Delete video |

### Subscriptions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users/subscribe/:channelId` | ✓ | Subscribe to a channel |
| `DELETE` | `/api/users/subscribe/:channelId` | ✓ | Unsubscribe |
| `GET` | `/api/users/subscriptions` | ✓ | Get user subscriptions |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Admin | List all users |
| `DELETE` | `/api/admin/videos/:id` | Admin | Remove any video |

---

## ☁️ File Upload Flow

```
User Request → Multer (temp local storage)
             → Cloudinary upload
             → URL saved in MongoDB
             → Response returned to client
```

---

## 🗄 Database Schema

```js
// User
{ username, email, fullName, password (hashed), avatar, coverImage,
  refreshToken, watchHistory [], role (user/admin), timestamps }

// Video
{ title, description, videoFile, thumbnail, owner (ref: User),
  duration, views, isPublished, timestamps }

// Subscription
{ subscriber (ref: User), channel (ref: User), timestamps }
```

---

## 🔐 Auth Flow

```
Register / Login
  → bcrypt hash password
  → generate accessToken (1d) + refreshToken (7d)
  → store refreshToken in DB
  → send both via HTTP-only cookies

Protected Request
  → auth.middleware verifies accessToken
  → if expired → use refreshToken to rotate tokens
  → proceed to controller
```

---

## 🗺 Roadmap

- [x] JWT auth with access & refresh token rotation
- [x] Avatar & cover image upload via Cloudinary
- [x] Video CRUD
- [x] Subscription system
- [x] Role-based access control (admin)
- [x] Centralized error handling
- [ ] Comment system
- [ ] Like / Dislike system
- [ ] Search & recommendations
- [ ] Real-time notifications
- [ ] Analytics dashboard

---

## 👤 Author

**Sujal Hammad**

[![GitHub](https://img.shields.io/badge/GitHub-@SujalHammad-181717?logo=github)](https://github.com/SujalHammad)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sujalhammad-0A66C2?logo=linkedin)](https://linkedin.com/in/sujalhammad)
