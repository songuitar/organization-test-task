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
import {DeepPartial} from "typeorm";
import {BossChangeRequest} from "@organization-tree/api-interfaces";
import {EmployeeTreeManagerService} from "./service/employee-tree-manager.service";


@Controller('employee')
export class AppController {

  constructor(private employeeService: EmployeeTreeManagerService) {
  }

  @Get('tree')
  async getTree() {
    return this.employeeService.getTrees()
  }

  @Get()
  getList() {
    return this.employeeService.getList()
  }

  @Post()
  createEmployee(@Body() employee: DeepPartial<EmployeeEntity>) {
    return this.employeeService.create(employee)
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    const employee = await this.employeeService.findOne(Number(id))
    if (!employee) {
      throw new NotFoundException('cannot find an employee with id=' + id)
    }

    return this.employeeService.deleteEmployee(employee)
  }

  @Patch(':id/boss')
  async changeBoss(@Param('id') id: string, @Body() request: BossChangeRequest) {

    if (Number(id) === request.newBossId) {
      throw new BadRequestException('cannot make an employee a boss to itself')
    }

    const employee = await this.employeeService.findOne(Number(id))
    if (!employee) {
      throw new NotFoundException('cannot find an employee with id=' + id)
    }

    await this.employeeService.changeBoss(request.newBossId, employee)
  }
}
