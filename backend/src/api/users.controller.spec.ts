import { Test, TestingModule } from '@nestjs/testing';
import { GetAllUsersController } from './users.controller';

describe('GetAllUsersController', () => {
  let controller: GetAllUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllUsersController],
    }).compile();

    controller = module.get<GetAllUsersController>(GetAllUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
