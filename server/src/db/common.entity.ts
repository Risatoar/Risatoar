import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('common_db')
export class CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;
}
