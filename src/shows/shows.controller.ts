import { Controller, Get, Query } from '@nestjs/common';
import { ShowsService } from './shows.service';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Get('/')
  async getShows(@Query('page') page: string) {
    return await this.showsService.getShows(Number(page || 1));
  }
}
