import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/db/abstract.entity';
import { Contract } from './contract.entity';

@Entity('officina_vfleet')
export class Officina extends AbstractEntity<Officina> {
  @OneToMany(() => Contract, contract => contract.id)
  contract: Contract[];

  @Column({ nullable: false })
  pec: string;

  @Column({ nullable: false })
  civico_sede: string;

  @Column({ nullable: false })
  partita_iva: string;

  @Column({ nullable: false })
  sede_legale: string;

  @Column({ nullable: false })
  nome_societa: string;

  @Column({ nullable: false })
  nome_officina: string;

  @Column({ nullable: false })
  indirizzo_sede: string;

  @Column({ nullable: false })
  provincia_sede: string;

  @Column({ nullable: false })
  camera_commercio: string;

  @Column({ type: 'jsonb', nullable: false })
  sede_operativa: {
    sedeoperativa_cap: string;
    sedeoperativa_sdi: string;
    sedeoperativa_iban: string;
    sedeoperativa_citta: string;
    sedeoperativa_email: string;
    sedeoperativa_civico: string;
    sedeoperativa_sitoweb: string;
    sedeoperativa_telefono: string;
    sedeoperativa_cellulare: string;
    sedeoperativa_indirizzo: string;
    sedeoperativa_provincia: string;
    sedeoperativa_referente: string;
    sedeoperativa_ruoloreferente: string;
  };

  @Column({ nullable: false })
  responsabile_trattamento: string;

  @Column({ nullable: false })
  rappresentante_legale: string;
}
