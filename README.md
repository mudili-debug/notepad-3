# NotionPad

A Notion-style note-taking app built with MERN stack, TypeScript, TailwindCSS, and Framer Motion.

## Features

- **User Authentication**: JWT-based auth with secure cookies
- **Page Management**: Create, edit, and organize pages
- **Block-Based Editing**: Rich text editor with multiple block types
- **Real-time Collaboration**: Auto-save and live updates
- **Responsive Design**: Clean, modern UI with light/dark mode
- **Drag & Drop**: Reorder blocks and pages
- **Command Palette**: Quick actions with Cmd+K
- **Smooth Animations**: Framer Motion powered transitions

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript + MongoDB + Mongoose
- **Authentication**: JWT with httpOnly cookies
- **Rich Text Editor**: TipTap
- **State Management**: React hooks + Context
- **Deployment**: Docker + CI/CD

## Project Structure

```
notionpad-monorepo/
├── apps/
│   ├── client/          # React frontend
│   └── server/          # Express backend
├── packages/
│   └── shared/          # Shared types & constants
├── docker-compose.yml   # Development environment
└── .github/workflows/   # CI/CD pipeline
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notionpad-monorepo
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy and fill .env files
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

4. Start development environment:
```bash
# Start all services (client, server, mongo)
docker-compose up

# Or run individually
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Server (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/notionpad
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:3000
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

```bash
# Development
pnpm dev              # Start all services
pnpm dev:client       # Start client only
pnpm dev:server       # Start server only

# Build
pnpm build            # Build all services
pnpm build:client     # Build client
pnpm build:server     # Build server

# Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # Run TypeScript checks
pnpm test             # Run tests

# Docker
docker-compose up     # Start all services
docker-compose down   # Stop all services
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile

### Pages
- `GET /api/pages` - Get all pages
- `POST /api/pages` - Create page
- `GET /api/pages/:id` - Get page with blocks
- `PATCH /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

### Blocks
- `GET /api/blocks?pageId=:id` - Get blocks for page
- `POST /api/blocks` - Create block
- `PATCH /api/blocks/:id` - Update block
- `DELETE /api/blocks/:id` - Delete block
- `PATCH /api/blocks/reorder` - Reorder blocks

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.
