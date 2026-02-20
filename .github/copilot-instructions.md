# To-Do App Development Guide

This is a full-stack to-do application with:
- **Frontend**: Next.js with React for drag-and-drop kanban board
- **Backend**: NestJS for REST API
- **Database**: MongoDB for data persistence

## Project Structure
```
to-do-app/
├── frontend/          # Next.js application
├── backend/           # NestJS application
└── docker-compose.yml # Local MongoDB setup
```

## Development Workflow

### Running the Backend
```bash
cd backend
npm install
npm run start:dev
```

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

### MongoDB Setup
MongoDB will run in Docker when needed or use a local instance.

## Key Features
- Drag and drop tasks between columns (Todo, In Progress, Done)
- Activity logs tracking changes
- Real-time updates via REST API
- Responsive design
