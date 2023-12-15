import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import {EmployeeEntity} from "./entity/employee.entity";
import {EmployeeTreeManagerService} from "./service/employee-tree-manager.service";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [EmployeeEntity],
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [EmployeeTreeManagerService]
})
export class AppModule {}
