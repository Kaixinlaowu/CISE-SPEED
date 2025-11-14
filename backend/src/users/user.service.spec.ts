// backend/src/users/user.service.spec.ts
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should register user', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({
      username: 'test',
      password: 'hashed',
      toObject: () => ({ username: 'test' }),
    });

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);

    const result = await service.create({
      username: 'test',
      password: '123456',
    });

    expect(result.username).toBe('test');
    expect(mockUserModel.create).toHaveBeenCalled();
  });

  it('should login user', async () => {
    const hashed = await bcrypt.hash('123456', 10);
    mockUserModel.findOne.mockResolvedValue({
      username: 'test',
      password: hashed,
      toObject: () => ({ username: 'test', password: hashed }),
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await service.login({
      username: 'test',
      password: '123456',
    });

    expect(result.user.username).toBe('test');
  });
});
