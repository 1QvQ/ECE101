import { Test, TestingModule } from '@nestjs/testing';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('FavouritesController', () => {
  let controller: FavouritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouritesController],
      providers: [
        FavouritesService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FavouritesController>(FavouritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
