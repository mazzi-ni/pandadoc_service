import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeebHookService } from './services/webhook.service';
import { ContractController } from './contract.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../common/db/database.module';
import { Contract } from './entities/contract.entity';
import { Azienda } from './entities/azienda.entity';
import { Officina } from './entities/officina.entity';
import { ContractService } from './services/contract.service';
import { OfficinaService } from './services/officina.service';
import { Contract_by_token } from './entities/contract_by_token.entity.';
import { TokenService } from './services/token.service';
import config from '../common/config/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Contract, Azienda, Officina, Contract_by_token]),
  ],
  controllers: [ContractController],
  providers: [
    WeebHookService,
    ContractService,
    OfficinaService,
    TokenService
  ],
})
export class ContractModule { }
