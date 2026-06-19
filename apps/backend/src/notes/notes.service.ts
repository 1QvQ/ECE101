import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class NotesService {
  async create(createNoteDto: CreateNoteDto, authorId) {
    const { title, content, tags, isPublic } = createNoteDto;
    const tagsOperation =
      tags && tags.length > 0
        ? {
            connectOrCreate: tags.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          }
        : undefined;

    return await prisma.note.create({
      data: {
        title,
        content,
        isPublic: isPublic ?? false,

        author: {
          connect: { id: authorId },
        },
        tags: tagsOperation,
      },
      include: {
        tags: true,
      },
    });
  }

  async findAll(authorId: string) {
    return await prisma.note.findMany({
      where: { authorId: authorId },
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  async update(id: string, authorId: string, updateData: any) {
    const note = await prisma.note.findUnique({
      where: { id: id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.authorId !== authorId) {
      throw new ForbiddenException(
        'You do not have permission to update this note',
      );
    }

    const { tags, ...restData } = updateData;
    const prismaUpdateData: any = { ...restData };
    if (tags && Array.isArray(tags)) {
      prismaUpdateData.tags = {
        set: [],
        connectOrCreate: tags.map((tagName: string) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      };
    }
    return await prisma.note.update({
      where: { id: id },
      data: prismaUpdateData,
    });
  }

  async remove(id: string, authorId: string) {
    const note = await prisma.note.findUnique({
      where: { id: id },
    });

    if (!note) {
      throw new NotFoundException(`Note not found`);
    }
    if (note.authorId !== authorId) {
      throw new ForbiddenException(
        `You do not have permission to delete this note`,
      );
    }

    await prisma.note.delete({
      where: { id: id },
    });

    return { message: 'Note successfully deleted.' };
  }
}
