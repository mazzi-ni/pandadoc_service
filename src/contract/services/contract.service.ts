import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Azienda } from '../entities/azienda.entity';
import { Repository } from 'typeorm';
import { Contract, Table } from '../entities/contract.entity';
import { Officina } from '../entities/officina.entity';

interface Token {
  name: string,
  value: string
}

@Injectable()
export class ContractService {
  private readonly logger: Logger = new Logger(ContractService.name)

  constructor(
    @InjectRepository(Azienda)
    private readonly aziendaRespository: Repository<Azienda>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>
  ) { }

  async exec(tokens: Token[], tables: Table[], officina: Officina, docId: string, name: string) {

    let agencies = await this.getAgencies()
    let newContracts: {
      [aziendaName: string]: Contract
    } = {}

    tables.map((table) => {
      const nameTablePath = table.name.split('.');

      if (nameTablePath.length >= 2) {
        if (!newContracts.hasOwnProperty(nameTablePath[0])) {
          newContracts[nameTablePath[0]] = new Contract({
            id_azienda: agencies.find(agencie => agencie.name === nameTablePath[0]),
            id_officina: officina,
            doc_id: docId,
            contract_name: name,
            tables: []
          })
        } else {
          console.log('sas')
        }

        newContracts[nameTablePath[0]].tables.push(table)
      }
    })

    Object.values(newContracts).map(contract => this.create(contract))
    return newContracts
  }

  private tokenToJson(items) {
    const root = {};

    items.forEach(item => {
      const parts = item.name.split('.');
      let current = root;
      parts.forEach((part, index) => {
        // Se siamo all'ultima parte del percorso, impostiamo il valore
        if (index === parts.length - 1) {
          current[part] = item.value;
        } else {
          // Altrimenti, continuamo a costruire l'albero
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    });

    return root;
  }


  private async create(contract: Contract) {
    return await this.contractRepository.save(contract)
  }

  private async getAgencies(): Promise<Azienda[]> | null {
    const azienda = await this.aziendaRespository.find()
    return azienda;
  }
}
