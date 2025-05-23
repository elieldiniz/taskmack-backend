import express from "express";
import { signUp, signIn, linkPartner } from "./User/AuthController";
import { signUpWithPartner, signUpWithPartnerCode } from './User/AuthController';

const app = express();
app.use(express.json());

app.post("/api/auth/signup", signUp);
app.post("/api/auth/signin", signIn);
app.post("/api/auth/partner", linkPartner);
app.post("/api/auth/signup-with-partner", signUpWithPartner);
app.post("/api/auth/signup-with-invite", signUpWithPartnerCode);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});