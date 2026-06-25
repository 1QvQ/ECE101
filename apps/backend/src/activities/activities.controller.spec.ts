import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        ActivitiesService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
