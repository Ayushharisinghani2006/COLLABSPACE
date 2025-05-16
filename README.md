# 🌐 CollabSpace

**CollabSpace** is a full-stack web application designed for real-time collaboration among remote teams, educators, and creative professionals. It offers an interactive whiteboard, integrated chat, and meeting tools to enable seamless teamwork and communication in one unified platform.

---

## 🚀 Overview

CollabSpace empowers users to:
- Brainstorm visually with a shared whiteboard.
- Communicate via integrated chat.
- Manage meetings dynamically.
- Ensure persistence of sessions via MongoDB.
- Lay the foundation for scalable monetization (freemium model).

---

## 🎯 Objectives

- **Real-Time Collaboration:** Multi-user whiteboard with instant updates via Socket.IO.
- **Streamlined Communication:** In-built chat for smooth conversations.
- **Productivity Tools:** Undo/redo, drawing modes, and save/load features.
- **Support for Education & Creativity:** Ideal for teaching, design, and planning.
- **Scalable Architecture:** Prepared for future business models (subscription/freemium).
- **Data Persistence:** MongoDB-powered whiteboard state saving and reloading.
- **User Engagement:** Display active users in real-time for a collaborative feel.

---

## ✨ Features

- **🖌️ Whiteboard Tools:** Freehand, lines, rectangles, circles, text, eraser.
- **🎨 Customization:** Color picker and brush size adjustment.
- **💬 Chat Integration:** Real-time messaging with user names and timestamps.
- **📅 Meeting Management:** Join/leave meetings with detailed metadata.
- **👥 User Presence:** Display online user count in real time.
- **💾 Save/Load Whiteboard:** Persistent whiteboard data using MongoDB.
- **↩️ Undo/Redo:** Easily manage drawing history.
- **📱 Responsive UI:** React + Vite frontend, optimized for all screen sizes.

---

## 🛠 Tech Stack

| Layer        | Tech Used                         |
|--------------|-----------------------------------|
| **Frontend** | React, Vite, Socket.IO-Client     |
| **Backend**  | Node.js, Express, Socket.IO       |
| **Database** | MongoDB                           |
| **Auth**     | JWT (JSON Web Tokens)             |
| **Styling**  | Tailwind CSS (optional)           |
| **Deployment** | Local or Cloud (e.g., AWS - planned) |

---

## 📋 Prerequisites

Ensure the following are installed:

- **Node.js** (v16+)
- **npm** (v8+)
- **MongoDB** (local or MongoDB Atlas)
- **Git**

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ayushharisinghani2006/COLLABSPACE.git
cd collabspace
2. Set Up the Backend
bash
Copy code
cd backend
npm install
Create a .env file inside the backend folder:

ini
Copy code
MONGO_URI=mongodb://localhost:27017/collabspace
PORT=5000
JWT_SECRET=your_jwt_secret_here
Replace your_jwt_secret_here with a secure key.

Start the backend:

bash
Copy code
npm start
Expected Output:

json
Copy code
{"level":"info","message":"MongoDB connected successfully"}
{"level":"info","message":"Server running on http://localhost:5000"}
3. Set Up the Frontend
bash
Copy code
cd ../frontend
npm install
npm run dev
Expected Output:

arduino
Copy code
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
4. (Optional) Seed the Database
Use the MongoDB shell to add a test meeting:

bash
Copy code
mongosh
use collabspace
db.meetings.insertOne({
  title: "Test Meeting",
  creator: ObjectId("your_user_id_here"),
  participants: [ObjectId("your_user_id_here")],
  whiteboard: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
Replace your_user_id_here with a valid ObjectId from the users collection.

💡 Usage
▶ Access the App
Open: http://localhost:3000

🧑 Sign Up / Log In
Use existing credentials or register a new account.

Example:

Email: test19@example.com

Password: password123

📍 Join a Meeting
From the dashboard or by visiting:

bash
Copy code
http://localhost:3000/meeting/<meetingId>
🎨 Use the Whiteboard
Choose drawing mode (draw, line, rectangle, etc.).

Customize brush size and colors.

Use save/load buttons for persistence.

Use undo/redo as needed.

💬 Chat
Send messages during collaboration.

👀 Monitor Users
See real-time user count in the meeting header.

🧰 Troubleshooting
❌ Canvas Initialization Failed
Ensure meeting data is loaded before rendering <canvas>.

Check Whiteboard.jsx's useEffect() setup.

❌ 404 Error for Meeting
Check the meetingId URL is correct.

Confirm the backend is running and /v1/meetings/:id is reachable.

⚠️ Socket.IO Issues
Ensure socket prop is correctly passed between components.

Check backend logs for Socket.IO-related errors.

🔮 Future Enhancements
Whiteboard templates (Kanban, flowcharts).

Integration with Microsoft Teams, Zoom, or Jira.

AI-powered summaries of whiteboard content.

GDPR compliance and role-based access control.

Built-in video conferencing and screen sharing.

🤝 Contributing
We welcome contributions!

bash
Copy code
# Fork the repo and create a new branch:
git checkout -b feature/your-feature

# Make changes and commit:
git commit -m "Add your feature"

# Push your branch:
git push origin feature/your-feature
Then open a pull request!

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

📬 Contact
For support or inquiries:

GitHub: @Ayushharisinghani2006
