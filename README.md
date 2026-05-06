# SignalFlow: Real-Time Price Alert Engine

SignalFlow is a full-stack, real-time cryptocurrency price monitoring and alert system. It allows users to set specific price conditions for various assets and receive instant WebSocket-driven notifications when those conditions are met.

## 🚀 Live Demo
- **Frontend (Live):** https://signal-flow-eight.vercel.app
- **Backend API:** https://signalflow-z5dm.onrender.com

---

## 🏗 Architecture & Tech Stack

This project was built with a focus on real-time data processing, background job execution, and containerized deployment.

### Core Stack
* **Frontend:** React.js, Vite, TailwindCSS, Socket.io-client
* **Backend:** Node.js, Express.js, Socket.io
* **Database:** MongoDB (User data, Alert Rules)
* **Cache & Message Broker:** Redis
* **Background Workers:** BullMQ (for alert evaluation)
* **Infrastructure:** Docker, Docker Compose, Nginx (Reverse Proxy)

### System Flow
1. **The Ticker:** A backend process continuously updates asset prices in Redis.
2. **The Evaluator:** A BullMQ worker constantly pulls active rules from MongoDB and compares them against the real-time prices in Redis.
3. **The Trigger:** When a condition is met, the worker marks the alert as "Triggered" in the database and emits an event via Socket.io.
4. **The Client:** The React frontend receives the WebSocket event and instantly displays a Toast notification to the user without requiring a page refresh.

---

## ⚙️ Local Development Setup

The application is fully containerized. You do not need to install Node, MongoDB, or Redis locally—only Docker is required.

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/divyanshu-kumar123/SignalFlow.git
cd signalflow
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory:
```bash
touch backend/.env
```
Paste the following into `backend/.env`:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
REDIS_HOST=redis
REDIS_PORT=6379
```

*Note: The frontend environment variables (`VITE_API_URL` and `VITE_SOCKET_URL`) are handled automatically via Docker build arguments in the compose file.*

### 3. Run the Application
Start the entire stack (Frontend, Backend, Redis, Nginx) using Docker Compose:
```bash
docker-compose up --build
```

### 4. Access the App
* **Frontend:** http://localhost:3000
* **Backend API:** http://localhost:8000/api
* **WebSocket Endpoint:** `ws://localhost:8000`

---

## 🧠 Technical Decisions & Best Practices

To ensure scalability and reliability, several architectural patterns were implemented:

* **Dockerized Nginx Reverse Proxy:** 
  Instead of dealing with complex CORS configurations and hardcoded ports, an Nginx container serves the built React static files and proxies `/api` and `/socket.io` requests directly to the backend container. This perfectly mimics a production environment.
* **Separation of Concerns (BullMQ):** 
  The heavy lifting of comparing hundreds of rules against real-time prices is offloaded from the main Express event loop to a BullMQ worker process. This ensures the API remains fast and responsive.
* **In-Memory State (Redis):** 
  Asset prices are highly volatile and change every second. Instead of spamming MongoDB with price updates, the live ticker pushes prices directly to Redis, allowing the rule evaluator to fetch them with near-zero latency.
* **WebSocket Upgrade Handling:** 
  The Nginx configuration explicitly includes `Upgrade` and `Connection "Upgrade"` headers to ensure the Socket.io handshake succeeds through the proxy without falling back to long-polling.

---

## ✅ Assessment Requirements Checklist
- [x] **Mock Price Ticker:** Generates and broadcasts real-time price updates.
- [x] **Alert Rule Engine:** Users can create and store alerts in the database.
- [x] **Real-time Notifications:** Frontend receives WebSocket events and shows toasts.
- [x] **Containerization:** Complete Docker Compose setup for local testing.
- [x] **Live Deployment:** App is hosted and accessible via public URLs.
