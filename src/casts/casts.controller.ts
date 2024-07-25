import { Controller, Get } from '@nestjs/common';
import { CastsService } from './casts.service';

@Controller('casts')
export class CastsController {
  constructor(private readonly castsService: CastsService) {}

  @Get('/')
  test() {
    return 'Hello from Casts Controller';
  }
}
