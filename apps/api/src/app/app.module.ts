import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import {EmployeeEntity} from "./entity/employee.entity";


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
})
export class AppModule {}
