import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../UserRepository';

// Mock do PrismaClient completo
jest.mock('@prisma/client', () => {
  const actual = jest.requireActual('@prisma/client');
  return {
    ...actual,
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $on: jest.fn(),
      $use: jest.fn(),
    })),
  };
});

describe('UserRepository', () => {
  let mockPrisma: PrismaClient;
  let userRepository: UserRepository;

  beforeEach(() => {
    mockPrisma = new PrismaClient(); // Retorna a instância mockada
    userRepository = new UserRepository(mockPrisma);
  });

  const mockUser = {
    id: '1',
    email: 'a@a.com',
    name: 'Nome',
    password: 'senha',
    partnerCode: 'xyz789',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('deve criar um usuário', async () => {
    (mockPrisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await userRepository.createUser(mockUser);
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: mockUser });
  });

  it('deve buscar usuário por email', async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await userRepository.findByEmail('a@a.com');
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@a.com' },
    });
  });

  it('deve buscar usuário por ID', async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await userRepository.findById('1');
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('deve buscar usuário por partnerCode', async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await userRepository.findByPartnerCode('xyz789');
    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { partnerCode: 'xyz789' },
    });
  });
});
