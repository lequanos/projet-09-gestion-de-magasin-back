import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from './accessToken.guard';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './refreshToken.guard';

@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Request() req: any) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refresh(@Request() req: any) {
    console.log('tu passes dedans');
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
