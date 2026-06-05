import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class NotesService {
  async create(createNoteDto: CreateNoteDto, authorId) {
    const { title, content, tags, isPublic } = createNoteDto;
    const tagsOperation = tags && tags.length > 0 ? ({
      connectOrCreate: tags.map((tagName) => ({
        where: { name: tagName },
        create: { name: tagName },
      }))
    }) : undefined;

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
      }
    })
  }






  findAll() {
    return `This action returns all notes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
