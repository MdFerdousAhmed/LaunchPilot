#  LaunchPilot

LaunchPilot is an AI-powered SaaS platform that helps entrepreneurs validate startup ideas, analyze competitors, generate landing page content, and manage projects in one place.

##  Features

-  AI Startup Validation
-  Competitor Analysis
-  AI Landing Page Generator
-  Project & Task Management
-  JWT Authentication
-  Interactive Dashboard

##  Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- TypeScript

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT
- Gemini AI API

##  Getting Started

### Clone the repository

```bash
git clone https://github.com/MdFerdousAhmed/LaunchPilot.git
cd LaunchPilot
```

### Install dependencies

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Run the project

```bash
# Backend
npm run dev

# Frontend
cd ../client
npm run dev
```

##  Project Structure

```
LaunchPilot/
├── client/
├── server/
└── README.md
```

##  Author

**MD. Ferdous Ahmed**

GitHub: https://github.com/MdFerdousAhmed

---

If you found this project helpful, consider giving it a star!