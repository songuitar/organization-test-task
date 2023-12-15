import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  BaseEntity,
  Tree,
  TreeParent,
  TreeChildren
} from "typeorm";
import {Employee} from "@organization-tree/api-interfaces";

@Tree('materialized-path')
@Entity()
export class EmployeeEntity extends BaseEntity implements Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @TreeParent()
  boss: EmployeeEntity;

  @TreeChildren({cascade: ['update']})
  subordinates: EmployeeEntity[]

  @Column()
  name: string;
}
