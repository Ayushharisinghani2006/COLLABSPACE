CollabSpace
Overview
CollabSpace is a full-stack web application designed to facilitate real-time collaboration for remote and hybrid teams, educators, and creative professionals. It features a collaborative whiteboard, integrated chat, and meeting management tools, enabling users to brainstorm, plan, and communicate effectively in a single platform. Built with a modern tech stack, CollabSpace aims to provide a seamless and intuitive experience for visual collaboration.
Objectives

Enable Real-Time Collaboration: Allow multiple users to draw, add shapes, and write text on a shared whiteboard in real-time, with instant synchronization using Socket.IO.
Streamline Communication: Provide an integrated chat feature for seamless communication during collaborative sessions.
Enhance Productivity: Offer tools like undo/redo, save/load, and diverse drawing modes (draw, line, rectangle, circle, text, eraser) to improve workflow efficiency.
Support Educational and Creative Use Cases: Cater to educators and creative teams with a versatile whiteboard for teaching, brainstorming, and design.
Lay the Foundation for a Scalable Business: Position CollabSpace for monetization through a freemium or subscription model, targeting small businesses, remote teams, and educational institutions.
Ensure Data Persistence and Accessibility: Allow users to save whiteboard states and reload them later, ensuring continuity across sessions.
Foster Team Engagement: Display online user counts and enable real-time interaction to create a sense of community.

Features

Real-Time Whiteboard: Collaborate on a canvas with drawing tools (freehand, line, rectangle, circle, text, eraser), color selection, and brush size adjustments.
Integrated Chat: Send messages within the platform, with timestamps and user identification.
Meeting Management: View meeting details (title, creator, participants) and join/leave meetings dynamically.
User Presence: See how many users are online in a meeting, updated in real-time.
Save/Load Functionality: Persist whiteboard states in MongoDB and reload them for future sessions.
Undo/Redo: Revert or reapply changes made on the whiteboard.
Responsive Design: Built with React for a user-friendly and responsive interface.

Tech Stack

Frontend: React, Vite, Socket.IO-Client
Backend: Node.js, Express, Socket.IO
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Styling: Tailwind CSS (optional, can be added for enhanced UI)
Deployment: Can be deployed on local machines or cloud platforms like AWS (future scope)

Prerequisites
Before setting up CollabSpace, ensure you have the following installed:

Node.js (v16.x or higher)
npm (v8.x or higher)
MongoDB (running locally or via a cloud service like MongoDB Atlas)
Git (for cloning the repository)

Installation
1. Clone the Repository
git clone https://github.com/your-username/collabspace.git
cd collabspace

2. Set Up the Backend

Navigate to the backend directory:cd backend


Install backend dependencies:npm install


Create a .env file in the backend directory with the following variables:MONGO_URI=mongodb://localhost:27017/collabspace
PORT=5000
JWT_SECRET=your_jwt_secret_here


Replace your_jwt_secret_here with a secure secret key for JWT authentication.


Start the backend server:npm start


Expected Output:{"level":"info","message":"MongoDB connected successfully","timestamp":"2025-05-16T..."}
{"level":"info","message":"Server running on http://localhost:5000","timestamp":"2025-05-16T..."}





3. Set Up the Frontend

Navigate to the frontend directory:cd ../frontend


Install frontend dependencies:npm install


Start the frontend development server:npm run dev


Expected Output:VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/





4. Seed the Database (Optional)
If no meetings exist in the database, you can manually create one using MongoDB:

Connect to MongoDB:mongosh


Switch to the collabspace database:use collabspace


Insert a test meeting:db.meetings.insertOne({
  title: "Test Meeting",
  creator: ObjectId("your_user_id_here"),
  participants: [ObjectId("your_user_id_here")],
  whiteboard: true,
  createdAt: new Date(),
  updatedAt: new Date()
})


Replace your_user_id_here with a user ID from db.users.find().



Usage

Access the Application:
Open your browser and navigate to http://localhost:3000.


Sign Up / Log In:
Create an account or log in with existing credentials (e.g., email: test19@example.com, password: password123).


Join a Meeting:
From the dashboard, join an existing meeting or navigate to http://localhost:3000/meeting/<meetingId> using a meeting ID from the database.


Use the Whiteboard:
Draw, add shapes, or write text on the whiteboard.
Use the toolbar to switch modes (draw, line, rectangle, circle, text, eraser), change colors, or adjust brush size.
Save your work using the "Save Whiteboard" button, and reload it later.
Use undo/redo to manage changes.


Chat with Team Members:
Send messages via the chat box to communicate with others in the meeting.


Monitor Online Users:
Check the "Online" count in the meeting details to see how many users are currently active.



Troubleshooting

Error: "Canvas initialization failed":
Ensure the meeting is loaded successfully before the canvas initializes. This issue was resolved by splitting the useEffect hook in Whiteboard.jsx to depend on the meeting state.
Check the browser console for additional errors and verify that the <canvas> element is rendered.


Error: "Failed to load meeting details: Request failed with status code 404":
Verify the meetingId in the URL matches an existing meeting in the database.
Ensure the backend server is running and the /v1/meetings/:meetingId endpoint is accessible.
The application now creates a new meeting if one doesn’t exist (see Whiteboard.jsx).


Socket.IO Connection Issues:
Confirm that the socket prop is passed correctly from MeetingDetails.jsx to Whiteboard.jsx.
Check backend logs for Socket.IO connection errors.



Future Enhancements

Add templates for project planning, Kanban boards, and brainstorming.
Integrate with tools like Microsoft Teams, Zoom, or Jira.
Implement AI features (e.g., automatic summarization of whiteboard content).
Enhance security with GDPR compliance and role-based access control.
Add video conferencing and screen sharing capabilities.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit them (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For inquiries or support, reach out to:

