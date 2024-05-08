import { Controller, Post, Body } from '@nestjs/common';
import { WeebHookService } from './services/webhook.service';
import { WebhookDto } from './dto/webhook.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly weebHookService: WeebHookService) {}

  @Post()
  async getWebhookPayload(@Body() data: WebhookDto[]) {
    return this.weebHookService.exec(data);
  }
}
