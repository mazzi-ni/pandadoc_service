import { Controller, Post, Body } from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { WebhookDto } from './dto/webhook.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  async getWebhookPayload(@Body() data: WebhookDto[]) {
    return this.contractService.exec(data);
  }
}
