import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {EmployeeEntity} from "./entity/employee.entity";
import {DataSource, DeepPartial} from "typeorm";
import {BossChangeRequest} from "@organization-tree/api-interfaces";
import {InjectDataSource} from "@nestjs/typeorm";


@Controller('employee')
export class AppController {

  constructor(@InjectDataSource() private datasource: DataSource) {
  }

  @Get('tree')
  async getTree() {
    const repo = this.datasource.getTreeRepository(EmployeeEntity);
    return repo.findTrees({depth: 512})
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
