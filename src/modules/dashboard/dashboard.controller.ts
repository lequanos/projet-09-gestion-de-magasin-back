import { Controller, Get, Req } from '@nestjs/common';
import { Permission, User, Dashboard } from 'src/entities';
import { DashboardService } from './dashboard.service';
import { Permissions } from '../../utils/decorators/permissions.decorator';
import { Request } from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get dashboard infos for the current user
   */
  @Get()
  @Permissions(
    Permission.READ_ALL,
    Permission.READ_STORE,
    Permission.READ_PRODUCT,
    Permission.READ_USER,
    Permission.READ_SUPPLIER,
  )
  async getDashboardInfos(@Req() req: Request): Promise<Dashboard> {
    return await this.dashboardService.getInfos(req.user as User);
  }
}
