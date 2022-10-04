/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param} from '@nestjs/common';
import { User } from 'src/entities';
import * as bcrypt from 'bcrypt';
import { AuthenticationService } from './authentication.service';

/**
 * Controller for the suppliers
 */
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

   
    @Get(':email')
    async getByEmail(@Param('email') authenticationDto: AuthenticationDto): Promise<User> {
        return await this.authenticationService.findByMail(authenticationDto);
    }
}