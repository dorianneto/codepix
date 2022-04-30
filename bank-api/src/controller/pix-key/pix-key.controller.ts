import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PixKeyExistsDto } from 'src/dto/pix-key-exists.dto';
import { PixKeyDto } from 'src/dto/pix-key.dto';
import { PixService } from 'src/grpc/services/pix-service.grpc';
import { BankAccount } from 'src/models/bank-account.model';
import { PixKey } from 'src/models/pix-key.model';
import { Repository } from 'typeorm';

@Controller('bank-accounts/:bankAccountId/pix-keys')
export class PixKeyController {
  constructor(
    @InjectRepository(PixKey)
    private pixKeyRepository: Repository<PixKey>,
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    @Inject('CODEPIX_PACKAGE')
    private client: ClientGrpc,
  ) {}

  @Get()
  index(
    @Param('bankAccountId', new ParseUUIDPipe({ version: '4' }))
    bankAccountId: string,
  ) {
    return this.pixKeyRepository.find({
      where: {
        bank_account_id: bankAccountId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  @Post()
  async store(
    @Param('bankAccountId', new ParseUUIDPipe({ version: '4' }))
    bankAccountId: string,
    @Body(new ValidationPipe({ errorHttpStatusCode: 422 }))
    body: PixKeyDto,
  ) {
    await this.bankAccountRepository.findOneOrFail(bankAccountId);

    const pixService: PixService = this.client.getService('PixService');
    const notFound = await this.checkPixKeyNotFound(body);

    if (!notFound) {
      throw new UnprocessableEntityException('pix key already exists');
    }

    const externalPixKey = await pixService
      .registerPixKey({
        ...body,
        accountId: bankAccountId,
      })
      .toPromise();

    if (externalPixKey.error) {
      throw new InternalServerErrorException(externalPixKey.error);
    }

    const pixKey = this.pixKeyRepository.create({
      id: externalPixKey.id,
      bank_account_id: bankAccountId,
      ...body,
    });

    const createdPixKey = await this.pixKeyRepository.save(pixKey);

    return createdPixKey;
  }

  async checkPixKeyNotFound(body: PixKeyDto) {
    const pixService: PixService = this.client.getService('PixService');

    try {
      await pixService.find(body).toPromise();

      return false;
    } catch (e) {
      if (e.details === 'no key was found') {
        return true;
      }

      throw new InternalServerErrorException('server is not available');
    }
  }

  @Get('exists')
  @HttpCode(204)
  async exists(
    @Query(new ValidationPipe({ errorHttpStatusCode: 422 }))
    params: PixKeyExistsDto,
  ) {
    const pixService: PixService = this.client.getService('PixService');

    try {
      await pixService.find(params).toPromise();
    } catch (e) {
      if (e.details === 'no key was found') {
        throw new NotFoundException(e.details);
      }

      throw new InternalServerErrorException('server is not available');
    }
  }
}
