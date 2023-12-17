import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post
} from '@nestjs/common';
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

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    const employee = await this.treeRepository.findOne({where: {id: Number(id)}, relations: ['subordinates']})
    if (!employee) {
      throw new NotFoundException('cannot find an employee with id=' + id)
    }

    for (const subordinate of employee.subordinates ?? []) {
      await this.employeeService.changeBoss(employee.boss?.id ?? null, subordinate)
    }

    return this.treeRepository.delete({id: Number(id)})
  }

  @Patch(':id/boss')
  async changeBoss(@Param('id') id: string, @Body() request: BossChangeRequest) {

    if (Number(id) === request.newBossId) {
      throw new BadRequestException('cannot make an employee a boss to itself')
    }

    const employee = await this.treeRepository.findOne({where: {id: Number(id)}})
    if (!employee) {
      throw new NotFoundException('cannot find an employee with id=' + id)
    }
    await this.employeeService.changeBoss(request.newBossId, employee)
  }


}
