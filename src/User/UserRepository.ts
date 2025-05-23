// src/repositories/UserRepository.ts
import { PrismaClient, User } from "@prisma/client";

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: Partial<User>): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByPartnerCode(code: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { partnerCode: code } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  async updatePartner(userId: string, partnerId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { partnerId },
    });
  }
  
}
