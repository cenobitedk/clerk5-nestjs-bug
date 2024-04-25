import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('public')
  getPublicHello(): string {
    return 'Hello from public route';
  }

  @Get('protected')
  getProtectedHello(): string {
    return 'Hello from protected route';
  }
}
