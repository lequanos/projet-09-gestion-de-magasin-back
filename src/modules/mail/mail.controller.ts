import { Controller, Get, Query } from '@nestjs/common';
import { BecomeCustomerQueryParamsDto } from './mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async becomeCustomer(@Query() query: BecomeCustomerQueryParamsDto) {
    const { firstname, lastname, email } = query;
    const result = await this.mailService.becomeCustomer(
      email,
      firstname,
      lastname,
    );

    if (result) return;
  }
}
