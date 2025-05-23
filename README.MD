Perfeito!
Aqui está o README.md do backend (TaskMack) com o bloco de integração para o frontend, pronto para colar:

TaskMack Backend

TaskMack é uma API para colaboração em tarefas em dupla, com pareamento via código de convite, autenticação JWT e recursos sociais. Este backend foi projetado para ser seguro, escalável e fácil de contribuir.

Frontend oficial:
TaskMatch Frontend

✨ Visão

O TaskMack nasceu para transformar a produtividade em algo social, divertido e gamificado. Aqui, você pode criar sua conta, se conectar com um parceiro via código de convite, compartilhar tarefas e evoluir juntos.

🚀 Funcionalidades já implementadas
Cadastro de usuário (com ou sem parceiro)
Pareamento via código de convite (ao criar conta ou posteriormente)
Login com JWT
Geração automática de código de convite
Vinculação de parceiros por código ou ID
Estrutura desacoplada (services, repositories, controllers)
Prisma ORM para banco de dados relacional
Validação e tratamento de erros padronizados
🛣️ Próximas funcionalidades
CRUD de tarefas compartilhadas
Sistema de conquistas e recompensas
Notificações em tempo real (WebSocket)
Recuperação de senha
Perfil público e customização avançada
Dashboard de produtividade
Integração com serviços externos (Google, etc)
Testes automatizados (Jest)
Documentação OpenAPI/Swagger
📚 Endpoints da API
Endpoints Implementados
Autenticação

POST /api/auth/signup
Cadastro de usuário (sem parceiro)

{
  "email": "joao@email.com",
  "password": "senha123",
  "nome": "João",
  "avatar": "🐶",
  "cor": "#f472b6"
}


Resposta:

{
  "user": { /* dados do usuário */ },
  "token": "jwt..."
}


POST /api/auth/signup-with-partner-code
Cadastro de usuário já pareado via código de convite

{
  "email": "maria@email.com",
  "password": "senha123",
  "nome": "Maria",
  "avatar": "🐱",
  "cor": "#f472b6",
  "partnerCode": "ABC123"
}


POST /api/auth/signin
Login de usuário

{
  "email": "joao@email.com",
  "password": "senha123"
}


Resposta:

{
  "token": "jwt..."
}

Parceria
POST /api/user/link-partner
Vincular parceiro via código de convite
{
  "userId": "clx123...",
  "partnerCode": "ABC123"
}

Resposta:
{
  "partner": { /* dados do parceiro */ }
}

Endpoints Planejados (não implementados)
Tarefas

GET /api/tasks
Listar tarefas do usuário/parceria
Resposta:

[
  {
    "id": "tsk123",
    "titulo": "Estudar React",
    "descricao": "Ler documentação oficial",
    "status": "pendente", // ou "concluida"
    "dataCriacao": "2024-06-01T12:00:00Z",
    "dataConclusao": null,
    "responsavelId": "clx123...",
    "parceriaId": "prc456..."
  }
]


POST /api/tasks
Criar nova tarefa
Payload:

{
  "titulo": "Estudar React",
  "descricao": "Ler documentação oficial",
  "responsavelId": "clx123...",
  "parceriaId": "prc456..."
}


Resposta:

{
  "id": "tsk123",
  "titulo": "Estudar React",
  "descricao": "Ler documentação oficial",
  "status": "pendente",
  "dataCriacao": "2024-06-01T12:00:00Z",
  "responsavelId": "clx123...",
  "parceriaId": "prc456..."
}


PUT /api/tasks/:id
Atualizar tarefa
Payload:

{
  "titulo": "Estudar React Avançado",
  "descricao": "Ler hooks avançados",
  "status": "concluida"
}


DELETE /api/tasks/:id
Remover tarefa
Resposta:

{
  "success": true
}

Conquistas e Gamificação

GET /api/achievements
Listar conquistas do usuário/parceria
Resposta:

[
  {
    "id": "achv1",
    "nome": "Primeira Tarefa",
    "descricao": "Conclua sua primeira tarefa",
    "conquistadaEm": "2024-06-01T13:00:00Z"
  }
]


POST /api/achievements/claim
Resgatar conquista
Payload:

{
  "achievementId": "achv1"
}


Resposta:

{
  "success": true,
  "achievement": {
    "id": "achv1",
    "nome": "Primeira Tarefa",
    "descricao": "Conclua sua primeira tarefa",
    "conquistadaEm": "2024-06-01T13:00:00Z"
  }
}

Notificações

GET /api/notifications
Listar notificações
Resposta:

[
  {
    "id": "ntf1",
    "mensagem": "Seu parceiro concluiu uma tarefa!",
    "lida": false,
    "data": "2024-06-01T14:00:00Z"
  }
]


POST /api/notifications/mark-as-read
Marcar notificações como lidas
Payload:

{
  "notificationIds": ["ntf1", "ntf2"]
}


Resposta:

{
  "success": true
}

Usuário

GET /api/user/me
Dados do usuário autenticado
Resposta:

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
Atualizar perfil do usuário
Payload:

{
  "nome": "João Silva",
  "avatar": "🦊",
  "cor": "#aabbcc"
}


Resposta:

{
  "success": true,
  "user": { /* dados atualizados */ }
}


POST /api/user/recover-password
Recuperação de senha
Payload:

{
  "email": "joao@email.com"
}


Resposta:

{
  "success": true,
  "message": "Se o e-mail existir, enviaremos instruções para recuperação."
}


Observação:
Os endpoints planejados ainda não estão disponíveis e podem sofrer alterações durante o desenvolvimento.
Para contribuir com novos endpoints, siga o padrão REST e mantenha a documentação atualizada.

🏗️ Estrutura do Projeto
src/
  controllers/
  services/
  repositories/
  middlewares/
  routes/
  prisma/
  app.ts

controllers/: lógica dos endpoints
services/: regras de negócio
repositories/: acesso ao banco (Prisma)
middlewares/: autenticação, validação, etc.
routes/: definição das rotas Express
prisma/: schema e migrations
⚙️ Como rodar localmente

Clone o repositório

git clone https://github.com/Elieldiniz/taskmack-backend.git
cd taskmack-backend


Instale as dependências

npm install


Configure o banco de dados

Renomeie .env.example para .env e ajuste DATABASE_URL e JWT_SECRET.

Rode as migrations

npx prisma migrate dev


Inicie o servidor

npm run dev

🧑‍💻 Como contribuir
Fork este repositório
Crie uma branch: git checkout -b minha-feature
Faça suas alterações e commits
Envie um Pull Request com uma descrição clara do que foi feito
Aguarde revisão e feedback

Dicas:

Siga o padrão de código e organização do projeto
Sempre escreva testes para novas funcionalidades
Documente endpoints e regras de negócio relevantes
👤 Quem sou

Este projeto é desenvolvido e mantido por Elieldiniz.

Sou apaixonado por produtividade, tecnologia e colaboração.
Meu objetivo com o TaskMack é criar a melhor experiência de tarefas em dupla, com gamificação e integração social.

GitHub: Elieldiniz

📈 Roadmap resumido
 Cadastro e login com JWT
 Pareamento por código de convite
 Estrutura de serviços e repositórios
 CRUD de tarefas
 Sistema de conquistas
 Notificações em tempo real
 Testes automatizados
 Deploy em nuvem
📄 Licença

MIT

TaskMack — Colabore, evolua, conquiste.
Sinta-se à vontade para abrir issues, sugerir melhorias ou contribuir com código!

Se quiser o do frontend, só pedir!