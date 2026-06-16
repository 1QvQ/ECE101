import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';

// This controller handles note-related operations, including creating, retrieving, updating, and deleting notes.
// It uses the AuthGuard to ensure that all requests are authenticated.
@UseGuards(AuthGuard('jwt'))
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    // extract userId from JWT
    const userId = req.user.sub || req.user.userId || req.user.id;

    // if userId is not extracted, throw an error
    if (!userId) {
      throw new Error("Critical Error: Cannot extract User ID from JWT!");
    }

    return this.notesService.create(createNoteDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.sub || req.user.userId || req.user.id;

    if (!userId) {
      throw new Error("Unauthorised: Cannot find User ID");
    }
    return this.notesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub || req.user.userId || req.user.id;

    if (!userId) {
      throw new Error("Unauthorised: Cannot find User ID");
    }
    return this.notesService.remove(id, userId);
  }
}
