# Kanban Board Application

A full-stack task management application built with Next.js, featuring a drag-and-drop Kanban board with real-time activity tracking and user authentication.

## Features

- **Kanban Board**: Organize tasks across three columns (To Do, In Progress, Done)
- **Drag & Drop**: Intuitive drag-and-drop interface for task reordering
- **Authentication**: Secure login and registration system
- **Activity Logs**: Track all task modifications with timestamps
- **User Privacy**: Tasks and logs are private per user
- **Responsive Design**: Mobile and desktop compatible

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Architecture

- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Next.js API routes with NextAuth.js authentication
- **Database**: MongoDB with Mongoose ODM
- **Drag & Drop**: Native HTML5 drag-and-drop API

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (auth, tasks, activity logs)
│   ├── components/       # React components (Kanban board, task card, etc.)
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── page.tsx         # Main dashboard
├── lib/                 # Utilities (MongoDB connection)
├── models/              # Mongoose schemas
└── proxy.ts             # NextAuth middleware
```

## License

Private project
