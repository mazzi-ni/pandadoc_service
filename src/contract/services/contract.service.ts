import { Injectable } from '@nestjs/common';

@Injectable()
export class ContractService {
  exec(contract: object) {
    return contract;
  }
}
