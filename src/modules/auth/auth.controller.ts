import { Controller, Req, Post, UseGuards, Get } from '@nestjs/common';

import { Request } from 'express';

import { LocalAuthGuard } from '../../utils/guards/local-auth.guard';
import { User } from '../../entities';
import { Public } from '../../utils/decorators/public.decorator';
import { TokensDto } from './auth.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from '../../utils/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Req() req: Request): Promise<TokensDto> {
    return this.authService.login(req.user as User);
  }

  @Get('logout')
  logout(@Req() req: Request): void {
    this.authService.logout((req.user as User).id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Req() req: Request): Promise<TokensDto> {
    const userId = (req.user as User).id;
    const refreshToken = (req.user as User).refreshToken;
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
