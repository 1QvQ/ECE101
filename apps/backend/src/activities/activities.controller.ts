import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activities')
@UseGuards(AuthGuard('jwt'))
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  // POST/ create activities
  @Post()
  create(@Req() req, @Body() createActivityDto: any) {
    const userId = req.user.id;
    return this.activitiesService.create(userId, createActivityDto);
  }

  // GET/ find all activities (by theme or age group if provided)
  @Get()
  findAll(@Query('theme') theme?: string, @Query('ageGroup') ageGroup?: string) {
    return this.activitiesService.findAll(theme, ageGroup);
  }

  // GET/ find all activities by user
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.activitiesService.findOne(id, req.user.id);
  }

  // PATCH/ updates a specific activity by id
  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() updateActivityDto: any) {
    const userId = req.user.id;
    return this.activitiesService.update(id, userId, updateActivityDto);
  }

  // DELETE/ deletes a specific activity by id
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.activitiesService.remove(id, userId);
  }
}
