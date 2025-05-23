import { AuthService } from "../AuthService";
import { UserRepository } from "../UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mocks
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      findById: jest.fn(),
      findByPartnerCode: jest.fn(),
      updatePartner: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    authService = new AuthService(mockRepo);
    process.env.JWT_SECRET = "testsecret";
  });

  describe("signUp", () => {
    it("deve criar um novo usuário com senha criptografada", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      const fakeUser = {
        id: "1",
        email: "user@example.com",
        password: "hashedPassword",
        partnerCode: "ABC123",
        partnerId: "fake-id",
        meuApelido: null,
        apelidoParceiro: null,
        nome: "User",
        avatar: null,
        cor: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepo.createUser.mockResolvedValue(fakeUser);

      const result = await authService.signUp("user@example.com", "123456", {
        nome: "User",
        avatar: null,
        cor: null,
      });

      expect(mockRepo.findByEmail).toHaveBeenCalledWith("user@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(mockRepo.createUser).toHaveBeenCalled();
      expect(result).toEqual(fakeUser);
    });

    it("deve lançar erro se o usuário já existir", async () => {
      mockRepo.findByEmail.mockResolvedValue({ email: "user@example.com" } as any);

      await expect(
        authService.signUp("user@example.com", "123456", {})
      ).rejects.toThrow("Usuário já existe");
    });
  });

  describe("signIn", () => {
    it("deve retornar token se login for válido", async () => {
      const fakeUser = {
        id: "1",
        email: "user@example.com",
        password: "hashedPassword",
      };

      mockRepo.findByEmail.mockResolvedValue(fakeUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token_jwt");

      const token = await authService.signIn("user@example.com", "123456");

      expect(mockRepo.findByEmail).toHaveBeenCalledWith("user@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedPassword");
      expect(token).toBe("token_jwt");
    });

    it("deve lançar erro se o usuário não existir", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.signIn("user@example.com", "123456")
      ).rejects.toThrow("Credenciais inválidas");
    });

    it("deve lançar erro se o usuário não tiver senha", async () => {
      mockRepo.findByEmail.mockResolvedValue({
        id: "1",
        email: "user@example.com",
        password: null,
      } as any);

      await expect(
        authService.signIn("user@example.com", "123456")
      ).rejects.toThrow("Credenciais inválidas");
    });

    it("deve lançar erro se a senha estiver incorreta", async () => {
      mockRepo.findByEmail.mockResolvedValue({
        id: "1",
        email: "user@example.com",
        password: "hashedPassword",
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.signIn("user@example.com", "wrongpass")
      ).rejects.toThrow("Credenciais inválidas");
    });

    it("deve lançar erro se JWT_SECRET não estiver definido", async () => {
      delete process.env.JWT_SECRET;
      mockRepo.findByEmail.mockResolvedValue({
        id: "1",
        email: "user@example.com",
        password: "hashedPassword",
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.signIn("user@example.com", "123456")
      ).rejects.toThrow("JWT_SECRET não definido");
    });
  });

  describe("linkPartner", () => {
    it("deve vincular parceiros se ambos existirem e não estiverem vinculados", async () => {
      const fakeUser = {
        id: "1",
        partnerId: null,
      };
      const fakePartner = {
        id: "2",
        partnerId: null,
        partnerCode: "ABC123",
      };

      mockRepo.findById.mockResolvedValue(fakeUser as any);
      mockRepo.findByPartnerCode.mockResolvedValue(fakePartner as any);
      mockRepo.updatePartner.mockResolvedValue({ ...fakeUser, partnerId: "2" } as any);

      mockRepo.findById.mockResolvedValueOnce(fakeUser as any) // para buscar user
        .mockResolvedValueOnce({ ...fakeUser, partnerId: "2" } as any); // para buscar updatedUser

      const result = await authService.linkPartner("1", "ABC123");

      expect(mockRepo.findById).toHaveBeenCalledWith("1");
      expect(mockRepo.findByPartnerCode).toHaveBeenCalledWith("ABC123");
      expect(mockRepo.updatePartner).toHaveBeenCalledWith("1", "2");
      expect(mockRepo.updatePartner).toHaveBeenCalledWith("2", "1");
      expect(result).toEqual({ ...fakeUser, partnerId: "2" });
    });

    it("deve lançar erro se o usuário não existir", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        authService.linkPartner("1", "ABC123")
      ).rejects.toThrow("Usuário não encontrado");
    });

    it("deve lançar erro se o parceiro não existir", async () => {
      mockRepo.findById.mockResolvedValue({ id: "1", partnerId: null } as any);
      mockRepo.findByPartnerCode.mockResolvedValue(null);

      await expect(
        authService.linkPartner("1", "ABC123")
      ).rejects.toThrow("Código parceiro inválido");
    });

    it("deve lançar erro se o usuário já tiver parceiro", async () => {
      mockRepo.findById.mockResolvedValue({ id: "1", partnerId: "2" } as any);
      mockRepo.findByPartnerCode.mockResolvedValue({ id: "2", partnerId: null } as any);
    
      await expect(
        authService.linkPartner("1", "ABC123")
      ).rejects.toThrow("Usuário já possui parceiro vinculado");
    });

    
    it("deve lançar erro se o parceiro já estiver vinculado", async () => {
      mockRepo.findById.mockResolvedValue({ id: "1", partnerId: null } as any);
      mockRepo.findByPartnerCode.mockResolvedValue({ id: "2", partnerId: "3" } as any);

      await expect(
        authService.linkPartner("1", "ABC123")
      ).rejects.toThrow("Parceiro já está vinculado a outro usuário");
    });

    it("deve lançar erro se não encontrar usuário atualizado", async () => {
      const fakeUser = { id: "1", partnerId: null };
      const fakePartner = { id: "2", partnerId: null, partnerCode: "ABC123" };

      mockRepo.findById.mockResolvedValue(fakeUser as any);
      mockRepo.findByPartnerCode.mockResolvedValue(fakePartner as any);
      mockRepo.updatePartner.mockResolvedValue({ ...fakeUser, partnerId: "2" } as any);
      mockRepo.findById.mockResolvedValueOnce(fakeUser as any) // para buscar user
        .mockResolvedValueOnce(null); // para buscar updatedUser

      await expect(
        authService.linkPartner("1", "ABC123")
      ).rejects.toThrow("Erro ao buscar usuário atualizado");
    });
  });
});