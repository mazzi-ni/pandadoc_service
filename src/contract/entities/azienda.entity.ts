import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/db/abstract.entity';
import { Contract } from './contract.entity';

@Entity('azienda_vfleet')
export class Azienda extends AbstractEntity<Azienda> {
  @OneToMany(() => Contract, (contract) => contract.id)
  contract: Contract[];

  @Column({ nullable: false })
  name: string;
}
