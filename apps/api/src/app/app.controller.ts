import {Body, Controller, Get, NotFoundException, Param, Patch, Post} from '@nestjs/common';
import {EmployeeEntity} from "./entity/employee.entity";
import {DataSource, DeepPartial, TreeRepository} from "typeorm";
import {BossChangeRequest} from "@organization-tree/api-interfaces";
import {InjectDataSource} from "@nestjs/typeorm";
import {EmployeeTreeManagerService} from "./service/employee-tree-manager.service";


@Controller('employee')
export class AppController {

  private readonly treeRepository: TreeRepository<EmployeeEntity>

  constructor(@InjectDataSource() private datasource: DataSource, private employeeService: EmployeeTreeManagerService) {
    this.treeRepository = this.datasource.getTreeRepository(EmployeeEntity)
  }

  @Get('tree')
  async getTree() {
    return this.treeRepository.findTrees({depth: 512})
  }

  @Get()
  getList() {
    return EmployeeEntity.find()
  }

  @Post()
  createEmployee(@Body() employee: DeepPartial<EmployeeEntity>) {
    return this.treeRepository.create(employee).save()
  }

  @Patch(':id')
  async updateEmployee(@Param('id') id: string, @Body() employee: DeepPartial<EmployeeEntity>) {
    return this.treeRepository.update(id, employee as DeepPartial<EmployeeEntity>)
  }

  @Patch(':id/boss')
  async changeBoss(@Param('id') id: string, @Body() request: BossChangeRequest) {
    console.log({request})

    const employee = await this.treeRepository.findOne({where: {id: Number(id)}})
    if (!employee) {
      throw new NotFoundException('cannot find an employee with id=' + id)
    }
    await this.employeeService.changeBoss(request.newBossId, employee)
  }
}
