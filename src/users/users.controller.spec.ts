import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should call UsersService.create and return the result', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+15551234567',
      };
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+15551234567',
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await usersController.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if UsersService.create fails', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+15551234567',
      };
      mockUsersService.create.mockRejectedValue(
        new BadRequestException('Email already exists'),
      );

      await expect(usersController.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
