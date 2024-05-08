import { Module } from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { ContractController } from './contract.controller';
import { ConfigModule } from '@nestjs/config';
import config from '../common/config/config';

@Module({
  imports: [ConfigModule.forRoot({
    load: [config],
    isGlobal: true,
  })],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
