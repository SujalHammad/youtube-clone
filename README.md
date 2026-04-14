# 📺 YouTube Clone Backend

A scalable and production-ready backend for a YouTube-like video streaming platform. This project is built using Node.js, Express, and MongoDB, focusing on authentication, video management, subscriptions, and secure API design.

> ⚡ Role: Backend Developer — Designed APIs, handled authentication, database schema, and server architecture.

---

## 🚀 Features

* JWT-based Authentication (Access & Refresh Tokens)
* User Registration & Login
* Video Upload & Management
* Cloudinary Integration for Media Storage
* Channel Subscription System
* Like / Dislike Functionality (extendable)
* Cookie-based Authentication
* Protected Routes & Middleware
* Centralized Error Handling

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Token (JWT)
* bcryptjs
* cookie-parser

### File Upload & Storage

* Multer
* Cloudinary

### Tools & Utilities

* dotenv
* nodemon
* Prettier

---

## 📁 Project Structure

```
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utility/
├── config/
└── index.js
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/your-username/youtube-clone-backend.git
cd youtube-clone-backend
```

### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_connection_string
PORT=8080

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Run the Project

```
npm run dev
```

Server will run on:

```
http://localhost:8080
```

---

## 🔑 API Endpoints

### Auth & Users

* POST /api/users/register
* POST /api/users/login
* GET /api/users/profile

### Videos

* POST /api/videos
* GET /api/videos
* GET /api/videos/:id
* DELETE /api/videos/:id

### Subscriptions

* Subscribe / Unsubscribe channels
* Get user subscriptions

### Admin

* Manage users and videos (admin routes)

---

## 🧠 Key Backend Concepts

* RESTful API Design
* MVC Architecture
* Middleware-based request handling
* Async Error Handling
* Role-Based Access Control (RBAC)
* File Upload Handling
* Token-based Authentication

---

## ☁️ File Upload Flow

1. User uploads video via API
2. Multer processes the file
3. File uploaded to Cloudinary
4. URL stored in MongoDB
5. Response sent to client

---

## 🛡️ Security Features

* Password hashing using bcrypt
* JWT Authentication
* HTTP-only cookies
* Protected routes middleware
* Centralized error handling

---

## 📌 Future Improvements

* Comment System
* Search & Recommendation System
* Real-time Notifications
* Analytics Dashboard
* Advanced Like/Dislike System

---

## 👨‍💻 Author

Sujal Hammad
Backend Developer

---

## ⭐ Contribution

Feel free to fork this repository and submit pull requests.
