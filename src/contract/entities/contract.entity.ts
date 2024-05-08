import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/db/abstract.entity';

@Entity('contract')
export class Contract extends AbstractEntity<Contract> {
  @Column({ nullable: false })
  id_officina: string;

  @Column({ nullable: false })
  id_azienda: string;

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
