// src/User/AuthService.ts
import { UserRepository } from "./UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "./model/UsuarioInterface";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async signUp(email: string, password: string, profileData: any): Promise<IUser> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("Usuário já existe");

    const hashed = await bcrypt.hash(password, 10);
    const partnerCode = uuidv4().slice(0, 6).toUpperCase();

    const user = await this.userRepo.createUser({
      email,
      password: hashed,
      partnerCode,
      ...profileData,
    });

    return user;
  }
  

  async signUpWithPartnerCode(
    email: string,
    password: string,
    profileData: any,
    partnerCode: string
  ): Promise<IUser> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("Usuário já existe");

    const partner = await this.userRepo.findByPartnerCode(partnerCode);
    if (!partner) throw new Error("Código de parceiro inválido");

    const hashed = await bcrypt.hash(password, 10);
    const newPartnerCode = uuidv4().slice(0, 6).toUpperCase();

    const user = await this.userRepo.createUser({
      email,
      password: hashed,
      partnerCode: newPartnerCode,
      partnerId: partner.id,
      ...profileData,
    });

    // (Opcional) Atualiza o parceiro para também apontar para o novo usuário
    await this.userRepo.updatePartner(partner.id, user.id);

    return user;
  }

  async signIn(email: string, password: string): Promise<string> {
    console.log("[DEBUG] signIn iniciado");
    console.log("[DEBUG] Email recebido:", email);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      console.log("[DEBUG] Usuário não encontrado para email:", email);
      throw new Error("Credenciais inválidas");
    }
    console.log("[DEBUG] Usuário encontrado:", { id: user.id, email: user.email });

    if (!user.password) {
      console.log("[DEBUG] Usuário não possui senha cadastrada");
      throw new Error("Credenciais inválidas");
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log("[DEBUG] Validação da senha:", valid);
    if (!valid) {
      console.log("[DEBUG] Senha inválida para usuário:", user.id);
      throw new Error("Credenciais inválidas");
    }

    const secret = process.env.JWT_SECRET;
    console.log("[DEBUG] JWT_SECRET:", secret ? "definido" : "undefined");
    if (!secret) {
      throw new Error("JWT_SECRET não definido");
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
    console.log("[DEBUG] Token JWT gerado com sucesso");

    return token;
  }

  async linkPartner(userId: string, partnerCode: string): Promise<IUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const partner = await this.userRepo.findByPartnerCode(partnerCode);
    if (!partner) throw new Error("Código parceiro inválido");

    if (user.partnerId) throw new Error("Usuário já possui parceiro vinculado");
    if (partner.partnerId) throw new Error("Parceiro já está vinculado a outro usuário");

    await this.userRepo.updatePartner(user.id, partner.id);
    await this.userRepo.updatePartner(partner.id, user.id);

    const updatedUser = await this.userRepo.findById(user.id);
    if (!updatedUser) throw new Error("Erro ao buscar usuário atualizado");

    return updatedUser as IUser;
  }

  async createUserWithPartner(
    email: string,
    password: string,
    profileData: any,
    partnerId: string
  ): Promise<IUser> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("Usuário já existe");

    const partner = await this.userRepo.findById(partnerId);
    if (!partner) throw new Error("Parceiro não encontrado");

    const hashed = await bcrypt.hash(password, 10);
    const partnerCode = uuidv4().slice(0, 6).toUpperCase();

    const user = await this.userRepo.createUser({
      email,
      password: hashed,
      partnerCode,
      partnerId,
      ...profileData,
    });

    return user;
  }
}