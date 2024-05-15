import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Officina, SedeOperativa } from '../entities/officina.entity';

@Injectable()
export class OfficinaService {
  constructor(
    @InjectRepository(Officina)
    private readonly officineRepository: Repository<Officina>
  ) { }

  // TODO: fa ancora i duplicati!!
  public async exec(mergeFields: object) {
    const newOfficina = this.createEntity(mergeFields);
    const checkOfficina = await this.find(newOfficina);
    if (checkOfficina.length == 0) {
      return this.create(newOfficina);
    } else {
      return checkOfficina[0];
    }
  }

  private createEntity(obj: object) {
    let newOfficina: Officina = new Officina({});
    let sedeOperativa: SedeOperativa = new SedeOperativa();
    let objFields = Object.keys(obj);

    objFields.map(key => {
      if (key.includes('sedeoperativa')) {
        sedeOperativa[key.replace('sedeoperativa_', '')] = obj[key]
      } else {
        newOfficina[key] = obj[key]
      }
    })

    newOfficina.sede_operativa = sedeOperativa
    return newOfficina
  }

  private async find(officina: Officina) {
    const isOfficina = await this.officineRepository.find({
      where: officina
    })

    return isOfficina;
  }

  private async create(officina: Officina) {
    return await this.officineRepository.save(officina);
  }
}
