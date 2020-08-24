import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('profiles')
class Profiles {
  @PrimaryColumn()
  id: number;

  @Column()
  description: string;
}

export default Profiles;
