import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Azienda } from '../entities/azienda.entity';
import { Contract } from '../entities/contract.entity';
import { Officina } from '../entities/officina.entity';
import { Repository } from 'typeorm';
import { Contract_by_token } from '../entities/contract_by_token.entity.';

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
    @InjectRepository(Contract_by_token)
    private readonly contractRepository: Repository<Contract_by_token>,
  ) { }

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
        new Contract_by_token({
          contract_name: contractName,
          doc_id: docId,
          id_officina: officina,
          tables: tokenByAgency[1] as object,
          id_azienda: agencies.find(
            (agencie) => agencie.name.toLowerCase === tokenByAgency[0].toLowerCase,
          ),
        }),
      );
    });

    this.logger.debug(newContract)
    newContract.map(async contract => await this.contractRepository.save(contract))
  }

  public extractTokens(tokens: Token[]) {
    const tokenTree = {};
    const tokenGeneral = {};

    tokens.map((token) => {
      const namePath = token.name.split('.');

      if (namePath.length > 1) {
        this.assignByPath(tokenTree, token.name.split('.'), token.value);
      } else {
        tokenGeneral[token.name] = token.value
      }
    });

    for (let key in tokenTree) {
      tokenTree[key] = { ...tokenTree[key], ...tokenGeneral }
    }

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