import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/db/abstract.entity';
import { Officina } from './officina.entity';
import { Azienda } from './azienda.entity';

@Entity('Contract_by_token')
export class Contract_by_token extends AbstractEntity<Contract_by_token> {
  @ManyToOne(() => Officina, (officina) => officina.id, { nullable: false })
  id_officina: Officina;

  @ManyToOne(() => Azienda, (azienda) => azienda.id, { nullable: false })
  id_azienda: Azienda;

  @Column({ nullable: false })
  doc_id: string;

  @Column()
  contract_name: string;

  @Column({ type: 'jsonb', nullable: false })
  tables: object;
}
