## Queue system

Simple queue system for creating tickets and processing them on server-side. Users can submit their ticket that will be enqueued to least full station. After some time user will recieve notification when their ticket is completed.

### Tech-stack

- Adonis.js 5 (Node.js framework)
- Redis as database
- Websocket for real-time notification

### Setup (Dev server only)

__Environment:__

Create `.env` file according to `.env.example` template inside root of project.

__Install dependencies and run project:__

```bash
# Install project dependencies
npm install

# Start dev server
npm run dev

# Start worker in next terminal
node ace work
```

### Usage

1. Open ticket form `localhost:3333`
2. Enter valid email
3. Submit form
4. After some time you will recieve notification about your task

__Others:__

- You can make fake request with command `node ace fake --number 10`
- Show basic stats of stations `localhost:3333/stats`

### Potential improvements

- Automatically open/close station instances based on user needs
- Implement transactions for safe data manipulation
- Docker 🐳
- Tests
- Better UI (Template, Notifications, Form validation)