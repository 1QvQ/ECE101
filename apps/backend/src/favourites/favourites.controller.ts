import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  UseGuards
} from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('favourites')
@UseGuards(AuthGuard('jwt'))
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) { }

  // POST/ toggle favourite
  @Post('toggle')
  toggleFavourite(
    @Req() req,
    @Body() body: { resourceType: string, resourceId: string }
  ) {
    const userId = req.user.id;
    return this.favouritesService.toggleFavourite(
      userId,
      body.resourceType,
      body.resourceId
    )
  }

  // GET/ favourites by user id

  @Get()
  getMyFavourites(@Req() req, @Query('resourceType') resourceType?: string) {
    const userId = req.user.id;
    return this.favouritesService.getMyFavourite(userId, resourceType);
  }

}
