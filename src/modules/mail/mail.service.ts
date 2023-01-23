import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { User, Role } from '../../entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: Logger = new Logger('MailService'),
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async becomeCustomer(
    email: string,
    firstname: string,
    lastname: string,
  ): Promise<boolean> {
    try {
      const admin = await this.userRepository.findOneOrFail({
        role: { name: 'super admin' } as FilterQuery<Role>,
      });

      const resultCustomerMail = await this.sendEmail(
        email,
        'Demande Retail Store',
        'becomeCustomer',
        {
          firstname,
          lastname,
        },
      );
      const resultAdminMail = await this.sendEmail(
        admin.email,
        "Demande d'adhésion",
        'becomeCustomer-admin',
        {
          firstname,
          lastname,
          email,
        },
      );

      if (resultCustomerMail && resultAdminMail) return true;

      return false;
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException('Admin user not found');
      }

      throw e;
    }
  }

  async sendEmail(
    email: string,
    subject: string,
    template: string,
    context: { [name: string]: any } | undefined = undefined,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'noreplyretailstore@gmail.com',
        subject,
        template,
        context,
      });
      this.logger.debug(`Email successfully sent to ${email}`);

      return true;
    } catch (e) {
      this.logger.error(`Email not sent to ${email}`);
      this.logger.error(e);

      throw e;
    }
  }

  async sendEmailToPurchasingManagers(
    context: { [name: string]: any } | undefined = undefined,
  ): Promise<boolean> {
    try {
      const purchasingManagers = await this.userRepository.find({
        $and: [
          { role: { name: 'purchasing manager' } },
          { store: context?.product.store },
          { isActive: true },
        ],
      });

      await Promise.all(
        purchasingManagers.map((manager) =>
          this.mailerService.sendMail({
            to: manager.email,
            from: 'noreplyretailstore@gmail.com',
            subject: `Alerte quantité sur ${context?.product.name}`,
            template: 'alertProduct',
            context,
          }),
        ),
      );

      this.logger.debug(`Alert email successfully`);

      return true;
    } catch (e) {
      this.logger.error(`Email not sent successfully`);
      this.logger.error(e);

      throw e;
    }
  }
}
