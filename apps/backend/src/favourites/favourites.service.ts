import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavouritesService {
  constructor(private readonly prisma: PrismaService) {}

  // TOGGLE: Add if exist and remove if not exist
  async toggleFavourite(
    userId: string,
    resourceType: string,
    resourceId: string,
  ) {
    // Check if this user already favourites this resource
    const existingFavourite = await this.prisma.favourite.findUnique({
      where: {
        userId_resourceType_resourceId: {
          userId,
          resourceType,
          resourceId,
        },
      },
    });

    // If favourite already exists, remove it (toggle off)
    if (existingFavourite) {
      await this.prisma.favourite.delete({
        where: { id: existingFavourite.id },
      });
      return { status: 'removed', resourceId };
    }

    // If it doesn't exist, add it (toggle on)
    const newFavourite = await this.prisma.favourite.create({
      data: {
        userId,
        resourceType,
        resourceId,
      },
    });
    return { status: 'added', favourite: newFavourite };
  }

  // READ (Get all activities liked by user)
  async getMyFavourite(userId: string, resourceType?: string) {
    const whereClause: any = { userId };
    // Optional filter by resource type
    if (resourceType) {
      whereClause.resourceType = resourceType;
    }

    return await this.prisma.favourite.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }
}
