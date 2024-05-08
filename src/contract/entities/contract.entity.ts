import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/db/abstract.entity';
import { Officina } from './officina.entity';
import { Azienda } from './azienda.entity';

@Entity('contract')
export class Contract extends AbstractEntity<Contract> {
  @ManyToOne(() => Officina, (officina) => officina.id, { nullable: false })
  id_officina: Officina;

  @ManyToOne(() => Azienda, (azienda) => azienda.id, { nullable: false })
  id_azienda: Azienda;

  @Column({ nullable: false })
  doc_id: string;

  @Column()
  contract_name: string;

  @Column({ type: 'jsonb', nullable: false })
  table: {
    id: string;
    name: string;
    items: object[];
    columns: object[];
    merge_table: object[];
  }[];
}
