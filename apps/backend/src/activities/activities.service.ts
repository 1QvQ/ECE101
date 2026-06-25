import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}
  // creates activity and saves it to the database
  async create(userId: string, createActivityDto: any) {
    return await this.prisma.activity.create({
      data: {
        ...createActivityDto,
        createdBy: userId,
      },
    });
  }

  async findAll(theme?: string, ageGroup?: string) {
    // Build a dynamic query object for filtering
    const whereClause: any = {};
    if (theme) whereClause.theme = theme;
    if (ageGroup) whereClause.ageGroup = ageGroup;

    return await this.prisma.activity.findMany({
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });

    // Validate Ownership
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Ensure user can only see their own activities (unless explicitly public)
    // Note: Since our current schema has no 'isPublic' field, we assume all activities are private
    // and only the creator can view/edit them.
    if (activity.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this activity.',
      );
    }

    return activity;
  }

  async update(id: string, userId: string, updateActivityDto: any) {
    // Find the activity to ensure it exists
    const activity = await this.findOne(id, userId);
    // Ensure the editor is the owner of the activity
    if (activity.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this activity.',
      );
    }
    return this.prisma.activity.update({
      where: { id },
      data: updateActivityDto,
    });
  }

  async remove(id: string, userId: string) {
    const activity = await this.findOne(id, userId);
    // Ensure the editor is the owner of the activity
    if (activity.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this activity.',
      );
    }
    return this.prisma.activity.delete({
      where: { id },
    });
  }
}
