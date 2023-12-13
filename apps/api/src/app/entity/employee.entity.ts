import {ManyToOne, OneToMany, Column, PrimaryGeneratedColumn, Entity, BaseEntity} from "typeorm";

@Entity()
export class EmployeeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EmployeeEntity, {nullable: true})
  boss: EmployeeEntity;

  @OneToMany(() => EmployeeEntity, subordinate => subordinate.boss)
  subordinates: EmployeeEntity[]

  @Column()
  name: string;
}
