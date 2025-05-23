Claro! Aqui está uma documentação clara e objetiva para a sua API de cadastro e vínculo de parceiros, já refletindo o fluxo correto para o usuário final e diferenciando o uso interno/admin.

Documentação da API de Cadastro e Parceria
1. Cadastro de Usuário (Gera Código de Convite)

Endpoint:
POST /api/auth/signup

Descrição:
Cria um novo usuário e gera automaticamente um código de convite (partnerCode) para ser compartilhado com o parceiro.

Body:

{
  "email": "joao@exemplo.com",
  "password": "senha123",
  "nome": "João",
  "avatar": "url-ou-base64",
  "cor": "#FF0000"
}


Resposta de sucesso:
{
  "id": "uuid-do-usuario",
  "email": "joao@exemplo.com",
  "nome": "João",
  "partnerCode": "AB12CD"
}


Observação:
O campo partnerCode deve ser exibido ao usuário para que ele compartilhe com o parceiro.

2. Cadastro de Parceiro via Código de Convite

Endpoint:
POST /api/auth/signup-with-invite

Descrição:
Cria um novo usuário já vinculado a um parceiro existente, usando o código de convite (partnerCode) recebido.

Body:

{
  "email": "maria@exemplo.com",
  "password": "senha123",
  "nome": "Maria",
  "avatar": "url-ou-base64",
  "cor": "#00FF00",
  "partnerCode": "AB12CD"
}


Resposta de sucesso:

{
  "id": "uuid-do-usuario",
  "email": "maria@exemplo.com",
  "nome": "Maria",
  "partnerId": "uuid-do-parceiro",
  "partnerCode": "XY34ZT"
}

3. Cadastro de Parceiro via partnerId (Uso Interno/Admin)

Endpoint:
POST /api/auth/signup-with-partner

Descrição:
Cria um novo usuário já vinculado a um parceiro existente, usando o partnerId (id do usuário).
Atenção: Não recomendado para uso pelo usuário final.

Body:

{
  "email": "parceiro@exemplo.com",
  "password": "senha123",
  "nome": "Parceiro",
  "avatar": "url-ou-base64",
  "cor": "#0000FF",
  "partnerId": "uuid-do-parceiro"
}


Resposta de sucesso:
Igual ao endpoint anterior.

4. Login

Endpoint:
POST /api/auth/signin

Descrição:
Autentica o usuário e retorna um token JWT.

Body:

{
  "email": "joao@exemplo.com",
  "password": "senha123"
}


Resposta de sucesso:

{
  "token": "jwt-token"
}

5. Vincular Parceiros já Cadastrados (Ambos já têm conta)

Endpoint:
POST /api/auth/partner

Descrição:
Vincula dois usuários já cadastrados usando o código de convite.

Body:

{
  "userId": "uuid-do-usuario",
  "partnerCode": "AB12CD"
}


Resposta de sucesso:

{
  "partner": {
    "id": "uuid-do-parceiro",
    "email": "parceiro@exemplo.com",
    "nome": "Parceiro"
  }
}

Observações Gerais
O campo partnerCode é sempre gerado automaticamente no cadastro e deve ser compartilhado pelo usuário.
O endpoint /api/auth/signup-with-invite é o fluxo recomendado para o usuário final se vincular a um parceiro.
O endpoint /api/auth/signup-with-partner deve ser reservado para uso interno/admin.
Nunca exponha o campo password nas respostas da API.
Sempre valide os dados recebidos e retorne mensagens de erro claras.
