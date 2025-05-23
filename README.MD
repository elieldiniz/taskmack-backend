Absolutely! Here is your TaskMack Backend README fully translated to English, keeping all sections, structure, and integration with the frontend:

TaskMack Backend

TaskMack is an API for collaboration on tasks in pairs, featuring invitation code pairing, JWT authentication, and social features. This backend is designed to be secure, scalable, and easy to contribute to.

Official Frontend:
TaskMatch Frontend

✨ Vision

TaskMack was created to transform productivity into something social, fun, and gamified. Here, you can create your account, connect with a partner via invitation code, share tasks, and grow together.

🚀 Features Implemented
User registration (with or without a partner)
Pairing via invitation code (during or after registration)
JWT login
Automatic invitation code generation
Partner linking by code or ID
Decoupled structure (services, repositories, controllers)
Prisma ORM for relational database
Standardized validation and error handling
🛣️ Upcoming Features
Shared tasks CRUD
Achievements and rewards system
Real-time notifications (WebSocket)
Password recovery
Public profile and advanced customization
Productivity dashboard
Integration with external services (Google, etc)
Automated tests (Jest)
OpenAPI/Swagger documentation
📚 API Endpoints
Implemented Endpoints
Authentication

POST /api/auth/signup
Register user (without partner)

{
  "email": "joao@email.com",
  "password": "senha123",
  "nome": "João",
  "avatar": "🐶",
  "cor": "#f472b6"
}


Response:

{
  "user": { /* user data */ },
  "token": "jwt..."
}


POST /api/auth/signup-with-partner-code
Register user already paired via invitation code

{
  "email": "maria@email.com",
  "password": "senha123",
  "nome": "Maria",
  "avatar": "🐱",
  "cor": "#f472b6",
  "partnerCode": "ABC123"
}


POST /api/auth/signin
User login

{
  "email": "joao@email.com",
  "password": "senha123"
}


Response:

{
  "token": "jwt..."
}

Partnership
POST /api/user/link-partner
Link partner via invitation code
{
  "userId": "clx123...",
  "partnerCode": "ABC123"
}

Response:
{
  "partner": { /* partner data */ }
}

Planned Endpoints (not yet implemented)
Tasks

GET /api/tasks
List user/partnership tasks
Response:

[
  {
    "id": "tsk123",
    "titulo": "Study React",
    "descricao": "Read official documentation",
    "status": "pending", // or "completed"
    "dataCriacao": "2024-06-01T12:00:00Z",
    "dataConclusao": null,
    "responsavelId": "clx123...",
    "parceriaId": "prc456..."
  }
]


POST /api/tasks
Create new task
Payload:

{
  "titulo": "Study React",
  "descricao": "Read official documentation",
  "responsavelId": "clx123...",
  "parceriaId": "prc456..."
}


Response:

{
  "id": "tsk123",
  "titulo": "Study React",
  "descricao": "Read official documentation",
  "status": "pending",
  "dataCriacao": "2024-06-01T12:00:00Z",
  "responsavelId": "clx123...",
  "parceriaId": "prc456..."
}


PUT /api/tasks/:id
Update task
Payload:

{
  "titulo": "Advanced React Study",
  "descricao": "Read advanced hooks",
  "status": "completed"
}


DELETE /api/tasks/:id
Delete task
Response:

{
  "success": true
}

Achievements & Gamification

GET /api/achievements
List user/partnership achievements
Response:

[
  {
    "id": "achv1",
    "nome": "First Task",
    "descricao": "Complete your first task",
    "conquistadaEm": "2024-06-01T13:00:00Z"
  }
]


POST /api/achievements/claim
Claim achievement
Payload:

{
  "achievementId": "achv1"
}


Response:

{
  "success": true,
  "achievement": {
    "id": "achv1",
    "nome": "First Task",
    "descricao": "Complete your first task",
    "conquistadaEm": "2024-06-01T13:00:00Z"
  }
}

Notifications

GET /api/notifications
List notifications
Response:

[
  {
    "id": "ntf1",
    "mensagem": "Your partner completed a task!",
    "lida": false,
    "data": "2024-06-01T14:00:00Z"
  }
]


POST /api/notifications/mark-as-read
Mark notifications as read
Payload:

{
  "notificationIds": ["ntf1", "ntf2"]
}


Response:

{
  "success": true
}

User

GET /api/user/me
Authenticated user data
Response:

{
  "id": "clx123...",
  "nome": "João",
  "email": "joao@email.com",
  "avatar": "🐶",
  "cor": "#f472b6",
  "partnerCode": "ABC123",
  "parceiroId": "clx456...",
  "createdAt": "2024-06-01T12:00:00Z"
}


PUT /api/user/me
Update user profile
Payload:

{
  "nome": "João Silva",
  "avatar": "🦊",
  "cor": "#aabbcc"
}


Response:

{
  "success": true,
  "user": { /* updated data */ }
}


POST /api/user/recover-password
Password recovery
Payload:

{
  "email": "joao@email.com"
}


Response:

{
  "success": true,
  "message": "If the email exists, we will send recovery instructions."
}


Note:
Planned endpoints are not yet available and may change during development.
To contribute new endpoints, follow the REST standard and keep the documentation updated.

🏗️ Project Structure
src/
  controllers/
  services/
  repositories/
  middlewares/
  routes/
  prisma/
  app.ts

controllers/: endpoint logic
services/: business rules
repositories/: database access (Prisma)
middlewares/: authentication, validation, etc.
routes/: Express route definitions
prisma/: schema and migrations
⚙️ How to Run Locally

Clone the repository

git clone https://github.com/Elieldiniz/taskmack-backend.git
cd taskmack-backend


Install dependencies

npm install


Configure the database

Rename .env.example to .env and set DATABASE_URL and JWT_SECRET.

Run migrations

npx prisma migrate dev


Start the server

npm run dev

🧑‍💻 How to Contribute
Fork this repository
Create a branch: git checkout -b my-feature
Make your changes and commits
Submit a Pull Request with a clear description of what was done
Wait for review and feedback

Tips:

Follow the project's code and organization standards
Always write tests for new features
Document endpoints and relevant business rules
👤 About Me

This project is developed and maintained by Elieldiniz.

I'm passionate about productivity, technology, and collaboration.
My goal with TaskMack is to create the best experience for paired tasks, with gamification and social integration.

GitHub: Elieldiniz

📈 Roadmap Summary
 Registration and login with JWT
 Pairing by invitation code
 Services and repositories structure
 Tasks CRUD
 Achievements system
 Real-time notifications
 Automated tests
 Cloud deployment
📄 License

MIT

TaskMack — Collaborate, grow, achieve.
Feel free to open issues, suggest improvements, or contribute code!