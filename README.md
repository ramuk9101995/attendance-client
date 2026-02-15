🎨 Attendance & Task Management App (Frontend)

Modern React application built with React 18 + TypeScript + Vite for managing attendance and tasks.

🚀 Tech Stack

React 18

TypeScript

Vite

Zustand (state management)

TanStack Query (server state)

Axios

Tailwind CSS

React Router v6

react-hot-toast

✨ Features
🔐 Authentication

Login / Signup

Protected routes

Automatic token injection

Auto redirect on token expiry

🗓️ Attendance UI

Check-in / Check-out

Today's attendance display

Attendance history view

✅ Task Management UI

Create, update, delete tasks

Filter by status & priority

Sort by due date

Responsive UI

⚙️ Setup Instructions
1️⃣ Install Dependencies
cd frontend
npm install

2️⃣ Configure Environment Variables

Create .env file:

VITE_API_URL=http://localhost:5000/api

3️⃣ Start Development Server
npm run dev


App runs at:

http://localhost:3000

🔐 Authentication Flow

User logs in

JWT token stored securely

Axios interceptor attaches token

Protected routes validate authentication

🌐 Deployment
Vercel

Framework: Vite
Build Command:

npm run build


Output Directory:

dist


Environment Variable:

VITE_API_URL=https://your-backend-url/api

📁 Project Structure (Frontend)
src/
 ├── api/
 ├── components/
 ├── pages/
 ├── store/
 ├── hooks/
 ├── routes/
 └── utils/

🧪 Testing Checklist

Signup works

Login works

Protected routes redirect

Attendance prevents duplicate check-in

Tasks CRUD works

Logout clears token