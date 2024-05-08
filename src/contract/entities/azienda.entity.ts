import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/db/abstract.entity';

@Entity('azienda_vfleet')
export class Azienda extends AbstractEntity<Azienda> {
  @Column({ nullable: false })
  name: string;
}
