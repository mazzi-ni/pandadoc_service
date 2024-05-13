import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Azienda } from '../entities/azienda.entity';
import { Contract } from '../entities/contract.entity';
import { Officina } from '../entities/officina.entity';
import { Repository } from 'typeorm';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

class Token {
  name: string;
  value: string;
}

@Injectable()
export class TokenService {
  private readonly logger: Logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(Azienda)
    private readonly aziendaRespository: Repository<Azienda>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  async exec(
    tokens: Token[],
    contractName: string,
    docId: string,
    officina: Officina,
  ) {
    const tokenObj = this.extractTokens(tokens);
    let agencies = await this.getAgencies();

    let newContract = [];

    Object.entries(tokenObj).map((tokenByAgency) => {
      newContract.push(
        new Contract({
          contract_name: contractName,
          doc_id: docId,
          id_officina: officina,
          // tables: tokenByAgency[1],
          id_azienda: agencies.find(
            (agencie) => agencie.name === tokenByAgency[0],
          ),
        }),
      );
    });
  }

  public extractTokens(tokens: Token[]) {
    const tokenTree = {};
    tokens.map((token) => {
      this.assignByPath(tokenTree, token.name.split('.'), token.value);
    });

    return tokenTree;
  }

  private assignByPath(targetObj: any, pathArray: string[], value: any) {
    const key = pathArray.shift();
    if (!(key in targetObj)) {
      targetObj[key] = {};
    }

    if (pathArray.length === 0) {
      targetObj[key] = value;
    } else {
      this.assignByPath(targetObj[key], pathArray, value);
    }
  }

  private async getAgencies(): Promise<Azienda[]> | null {
    const azienda = await this.aziendaRespository.find();
    return azienda;
  }
}
