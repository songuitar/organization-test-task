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

@Tree('closure-table')
@Entity()
export class EmployeeEntity extends BaseEntity implements Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @TreeParent()
  boss: EmployeeEntity;

  @TreeChildren()
  subordinates: EmployeeEntity[]

  @Column()
  name: string;
}
