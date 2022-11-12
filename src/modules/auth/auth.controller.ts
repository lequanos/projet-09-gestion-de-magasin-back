import {
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Body,
  HttpCode,
} from '@nestjs/common';

import { Request } from 'express';

import { LocalAuthGuard } from '../../utils/guards/local-auth.guard';
import { Permission, User } from '../../entities';
import { Public } from '../../utils/decorators/public.decorator';
import { SelectStoreDto, TokensDto } from './auth.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from '../../utils/guards/refresh-token.guard';
import { Permissions } from '../../utils/decorators/permissions.decorator';

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
    return await this.authService.refreshTokens(req.user as User);
  }

  @HttpCode(200)
  @Post('store')
  @Permissions(Permission.READ_ALL)
  async selectStore(
    @Req() req: Request,
    @Body() selectStoreDto: SelectStoreDto,
  ): Promise<TokensDto> {
    const { store } = selectStoreDto;
    return await this.authService.selectStore(req.user as User, store);
  }
}
