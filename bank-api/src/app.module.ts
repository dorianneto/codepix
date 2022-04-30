import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankAccountController } from './controller/bank-account/bank-account.controller';
import BankFixtureCommand from './fixtures/bank-fixture.command';
import { BankAccount } from './models/bank-account.model';
import { PixKeyController } from './controller/pix-key/pix-key.controller';
import { PixKey } from './models/pix-key.model';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [BankAccount, PixKey],
    }),
    TypeOrmModule.forFeature([BankAccount, PixKey]),
    ConsoleModule,
    ClientsModule.register([
      {
        name: 'CODEPIX_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL,
          package: 'github.com.dorianneto.codepix',
          protoPath: [join(__dirname, 'grpc/protofiles/pixkey.proto')],
        },
      },
    ]),
  ],
  controllers: [AppController, BankAccountController, PixKeyController],
  providers: [AppService, BankFixtureCommand],
})
export class AppModule {}
