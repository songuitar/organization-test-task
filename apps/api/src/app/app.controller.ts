import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {EmployeeEntity} from "./entity/employee.entity";
import {DeepPartial} from "typeorm";
import {BossChangeRequest} from "@organization-tree/api-interfaces";


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
    return EmployeeEntity.create(employee).save()
  }

  @Patch(':id')
  async updateEmployee(@Param('id') id: string, @Body() employee: DeepPartial<EmployeeEntity> | BossChangeRequest) {
    if ((employee as BossChangeRequest).newBossId  !== undefined) {
        (employee as EmployeeEntity).boss = await EmployeeEntity.findOne({where: {id: (employee as BossChangeRequest).newBossId}})
        delete (employee as BossChangeRequest).newBossId
    }

    return EmployeeEntity.update(id, employee as DeepPartial<EmployeeEntity>)
  }


}
