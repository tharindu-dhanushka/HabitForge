# HabitForge 🔥

## Project Title
**HabitForge** - *Build Better Habits, Build a Better You.*

## Problem Description
Building good habits and breaking bad ones is incredibly difficult for most people. We often start a new routine with high energy, but quickly lose motivation because we lack a proper, visual way to track our daily progress. Without seeing consistency and success streaks, it's very easy to abandon our goals and fall back into old patterns.

## Proposed Solution
HabitForge is a minimalist, distraction-free habit tracking web application designed to solve this problem. It allows users to log their daily habits and visually track their success over time. By providing immediate visual feedback (such as turning a task green with the exact time of completion) and generating dynamic analytics charts, HabitForge helps keep users motivated and consistent in their self-improvement journeys.

## Features
- **Full CRUD Operations:** Seamlessly Create, Read, Update, and Delete your daily or weekly habits.
- **Daily Check-ins:** A simple "Mark Done" functionality that instantly records the exact time you completed a habit.
- **Real-Time Analytics:** Visual charts that track your check-ins over the last 7 days and compare your overall habit performance.
- **Persistent State:** If you reload the page, your progress for the day is securely fetched and displayed without losing your success streak.
- **Beautiful & Modern UI:** A responsive, glassmorphism-inspired dark mode interface that makes tracking habits visually pleasing.

## Technologies Used
This project was built using the **MERN Stack**:
- **Frontend:** React.js, Vite, Vanilla CSS, Lucide React (Icons), Recharts (Analytics)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose)

---

## API Endpoints

The backend runs locally at `http://localhost:8000/api/habit`. Below are the available endpoints:

### 1. Create a Habit
- **URL:** `/create`
- **Method:** `POST`
- **Body Example:**
  ```json
  {
    "name": "Morning Workout",
    "description": "30 minutes of cardio",
    "frequency": "daily"
  }
  ```

### 2. Get All Habits (with Check-ins)
- **URL:** `/getall`
- **Method:** `GET`
- **Response:** Returns an array of all habits, including their historical check-in data and a boolean indicating if it was completed today.

### 3. Update a Habit
- **URL:** `/update/:id`
- **Method:** `PUT`
- **Body Example:**
  ```json
  {
    "name": "Evening Workout",
    "frequency": "weekly"
  }
  ```

### 4. Delete a Habit
- **URL:** `/delete/:id`
- **Method:** `DELETE`
- **Response:** `{ "message": "Habit deleted" }`

### 5. Mark a Habit as Done (Check-in)
- **URL:** `/checkin/:id`
- **Method:** `POST`
- **Description:** Marks the habit as completed for the current date and records the exact timestamp (`completedAt`).

---

## Setup Instructions

### Prerequisites
Before running the project, make sure you have the following installed on your machine:
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** (Make sure your local MongoDB server is running, or you have a MongoDB Atlas connection string)

### 1. Clone the repository (if applicable)
```bash
git clone <your-repo-url>
cd HabitForge
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd habitforge-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `habitforge-backend` directory and add your MongoDB connection string and Port:
   ```env
   PORT=8000
   MONGO_URL=mongodb://localhost:27017/habitforge
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## How to Run the Project

You will need two separate terminal windows to run both the backend and frontend simultaneously.

### Step 1: Start the Backend Server
In your first terminal, from the `habitforge-backend` directory, run:
```bash
npm start
# OR if you have nodemon installed:
npm run dev
```
*You should see a message in the console saying "Database connected successfully" and "Server running on port 8000".*

### Step 2: Start the Frontend Application
In your second terminal, from the `frontend` directory, run:
```bash
npm run dev
```
*Vite will start the development server. You can now open your browser and navigate to `http://localhost:5173/` to use HabitForge.*
