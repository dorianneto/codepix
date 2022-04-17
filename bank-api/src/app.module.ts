import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankAccountController } from './controller/bank-account/bank-account.controller';
import BankFixtureCommand from './fixtures/bank-fixture.command';
import { BankAccount } from './models/bank-account.model';

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
      entities: [BankAccount],
    }),
    TypeOrmModule.forFeature([BankAccount]),
    ConsoleModule,
  ],
  controllers: [AppController, BankAccountController],
  providers: [AppService, BankFixtureCommand],
})
export class AppModule {}
