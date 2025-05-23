import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthService } from "./AuthService";
import { UserRepository } from "./UserRepository";
import { RequestHandler } from "express";

const prisma = new PrismaClient();
const authService = new AuthService(new UserRepository(prisma));

// Cadastro padrão (sem parceiro)
export async function signUp(req: Request, res: Response) {
  try {
    const { email, password, nome, avatar, cor } = req.body;
    const user = await authService.signUp(email, password, { nome, avatar, cor });
    // Gera o token JWT para o novo usuário
    const token = await authService.signIn(email, password);
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export const signUpWithPartnerCode: RequestHandler = async (req, res) => {
  try {
    const { email, password, nome, avatar, cor, partnerCode } = req.body;
    if (!partnerCode) {
      res.status(400).json({ error: "partnerCode é obrigatório para este endpoint" });
      return;
    }
    const user = await authService.signUpWithPartnerCode(
      email,
      password,
      { nome, avatar, cor },
      partnerCode
    );
    // Gera o token JWT para o novo usuário
    const token = await authService.signIn(email, password);
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const signUpWithPartner: RequestHandler = async (req, res) => {
  try {
    const { email, password, nome, avatar, cor, partnerId } = req.body;
    if (!partnerId) {
      res.status(400).json({ error: "partnerId é obrigatório para este endpoint" });
      return;
    }
    const user = await authService.createUserWithPartner(email, password, { nome, avatar, cor }, partnerId);
    // Gera o token JWT para o novo usuário
    const token = await authService.signIn(email, password);
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Login
export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const token = await authService.signIn(email, password);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

// Vincular parceiro via código
export async function linkPartner(req: Request, res: Response) {
  try {
    const { userId, partnerCode } = req.body;
    const partner = await authService.linkPartner(userId, partnerCode);
    res.json({ partner });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}