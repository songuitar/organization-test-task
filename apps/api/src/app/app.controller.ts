import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {EmployeeEntity} from "./entity/employee.entity";
import {DeepPartial} from "typeorm";



@Controller('employee')
export class AppController {

  @Get('tree')
  getTree() {
    return EmployeeEntity.find({relations: {subordinates: true}})
  }

  @Get()
  getList() {
    return EmployeeEntity.find()
  }

  @Post()
  createEmployee(@Body() employee: DeepPartial<EmployeeEntity>) {
    console.log(employee)
    return EmployeeEntity.create(employee).save()
  }

  @Patch(':id')
  updateEmployee(@Param('id') id: string, @Body() employee: DeepPartial<EmployeeEntity>) {
    return EmployeeEntity.update(id, employee)
  }
}
