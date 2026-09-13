# streak it! - Life RPG Web Application

## 1. Project Overview & The Core Problem
Traditional productivity tools and habit trackers often feel like chores due to delayed gratification. **streak it!** solves this by translating mundane real-world tasks into an engaging virtual progression system. By utilizing instant feedback loops, clear progression mechanics, and tangible rewards, this application bridges the gap between daily discipline and the immediate dopamine of video games.

## 2. Product Feel & Creative Direction
This application avoids the generic "SaaS dashboard" aesthetic. It has a soul and adheres to the following principles:
*   **Alive and Tactile:** The UI reacts instantly. Earning XP and leveling up is celebratory, utilizing CSS micro-interactions and smooth animations.
*   **Thematically Cohesive:** A rich, fantasy-inspired interface mapped to a Westeros-style environment.
*   **Seamlessly Integrated:** Utilizing optimistic UI updates, the application feels as fast as a native client-side app, masking any network latency.

## 3. Technology Stack (MERN + TanStack)
*   **Architecture:** Monorepo (`/client` and `/server`)
*   **Frontend:** React + Vite, Tailwind CSS, Framer Motion
*   **Server State / API:** TanStack Query (React Query) + Axios
*   **Backend:** Node.js + Express.js
*   **Database:** MongoDB Atlas + Mongoose
*   **Authentication:** Custom JWT (JSON Web Tokens) stored in `httpOnly` cookies

## 4. UI / UX Reference Architecture
The application layout and styling are heavily driven by the following creative guidelines:

*   **Dashboard Background Map:** 
    *   *Reference:* `Game Of Thrones map...jpeg`
    *   *Function:* Main interactive background canvas for the daily task dashboard.
    *   *Details:* Divided vertically into 24-hour time zones (hidden grid). Hosts interactive task nodes (e.g., Wake-up at 6 AM, Maths at 9 AM). Includes environmental CSS animations (moving clouds).
*   **Character Attributes Panel:** 
    *   *Reference:* `825ced97-15cf-435a-8d38-5c010e746eeb.jpg`
    *   *Function:* Character stats and attributes display.
    *   *Details:* Triggered by clicking the user avatar. Displays core RPG metrics (Strength, Intellect, Focus) and active/passive abilities. Positioned on the right side (desktop) or via slide-up modal (mobile).
*   **Main Navigation Menu:** 
    *   *Reference:* `image-thumb-Purple122...jpg`
    *   *Function:* Visual layout of the core navigation.
    *   *Details:* Left-side dropdown/slide-out menu containing routes (Calendar, Leaderboard, Character, Vault, Store). Uses strong visual icons next to text labels.

## 5. Monorepo Directory Structure
```text
streak-it/
│
├── client/                 # The Vite + React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/            # Axios instances and TanStack Query hooks
│   │   ├── assets/         # Westeros map, icons
│   │   ├── components/     # Reusable UI (TaskNode, StatBar)
│   │   ├── pages/          # Dashboard, Login, Store
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # The Express Backend
│   ├── controllers/        # Route logic (authController, taskController)
│   ├── middleware/         # JWT verification, error handling
│   ├── models/             # Mongoose schemas (User, Task)
│   ├── routes/             # API endpoints (/api/auth, /api/tasks)
│   ├── .env                # DB URI, JWT Secret
│   ├── server.js           # Express entry point
│   └── package.json
│
├── .gitignore
└── package.json            # Root package for running both concurrently

```
## 6. Core Systems & Gamification Mechanics

- **User Authentication & Security:**
  - Secure signup, login, and session management via HTTP-only JWTs.
  - Users can securely modify only their own data.

- **Database Schema & CRUD:**
  - Mongoose models handling Users, Tasks, and character attributes.
  - Full Create, Read, Update, and Delete capabilities.

- **The RPG Progression Engine:**
  - A non-linear leveling system where each subsequent level requires exponentially more XP.

- **Gamified Elements:**
  - **Streaks:** Tracking consecutive days of activity.
  - **Attributes:** Tasks level up specific stats (e.g., Coding increases "Intellect", Gym increases "Strength").
  - **Rewards/Economy:** Users earn currency to "buy" virtual items, themes, or profile badges.

- **Accessibility:**
  - Fully responsive across devices.
  - Navigatable via keyboard.
  - Compatible with screen readers.

## 7. Delivery & Disqualification Standards (Zero-Tolerance)

- **No Broken Links:**
  - Live deployment and public GitHub repository must be accessible.

- **True Data Persistence:**
  - No reliance on `localStorage` for primary data.
  - MongoDB must be utilized for persistent application data.

- **No Build/Runtime Crashes:**
  - App must load cleanly.
  - Application must connect to the database in production.
  - Errors must be handled gracefully without blank screens.

- **Valid Repository:**
  - Clean commit history.
  - Full backend and frontend code must be present.

- **Illustration Video:**
  - A 90–180 second screen recording.
  - Maximum file size: 100 MB.
  - Must demonstrate:
    - Signup
    - Task completion
    - Leveling up
    - Database persistence via page refresh