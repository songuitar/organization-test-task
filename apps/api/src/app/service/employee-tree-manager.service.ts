import {DataSource, DeepPartial, TreeRepository} from "typeorm";
import {EmployeeEntity} from "../entity/employee.entity";
import {InjectDataSource} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";


export class LogicException extends Error {

}

@Injectable()
export class EmployeeTreeManagerService {

    private readonly treeRepository: TreeRepository<EmployeeEntity>

    constructor(@InjectDataSource() private datasource: DataSource) {
        this.treeRepository = this.datasource.getTreeRepository(EmployeeEntity)
    }

    findOne(id: number) {
        return this.treeRepository.findOne({where: {id: Number(id)}, relations: ['subordinates']})
    }

    create(employee: DeepPartial<EmployeeEntity>) {
        return this.treeRepository.create(employee).save()
    }

    /**
     * Похоже что в typeorm так и не реализовали логику апдейта для material path и closure table так что пришлось апдейтить руками
     * TODO: check if employee gets swapped with a boss and restrict this case
     */
    async changeBoss(newBossId: number | null, employee: EmployeeEntity) {
        const queryRunner = this.datasource.manager.connection.createQueryRunner();

        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            // Fetch materialized path for subject employee
            const oldPath: string = (await queryRunner.query(
                `SELECT mpath
                 FROM employee_entity
                 WHERE id = $1`,
                [employee.id]
            ))[0].mpath


            if (!oldPath) {
                throw new Error('Materialized path not found for subject employee')
            }

            let newBossPath = ''

            if (newBossId !== null) {
                // Fetch the new boss's materialized path
                newBossPath = (await queryRunner.query(
                    `SELECT mpath
                     FROM employee_entity
                     WHERE id = $1`,
                    [newBossId]
                ))[0].mpath

                if (!newBossPath) {
                    throw new Error('Materialized path not found for the new boss')
                }
            }

            if (newBossPath.split('.').includes(employee.id.toString())) {
                throw new LogicException(`Collision: ${newBossId} is a subordinate of ${employee.id}`)
            }


            const newPath = [...newBossPath.split('.')
                .filter(entry => entry.length > 0), employee.id]
                .join('.')

            // Update materialized path for subject employee
            await queryRunner.query(
                `UPDATE employee_entity
                 SET bossId = $1,
                     mpath  = $2
                 WHERE id = $3`,
                [newBossId, newPath, employee.id]
            )

            await queryRunner.query(
                `UPDATE employee_entity
                 SET mpath = REPLACE(mpath, $1, $2)
                 WHERE mpath LIKE $3`,
                [
                    oldPath,
                    newPath,
                    `${oldPath}%`]
            )

            await queryRunner.commitTransaction()
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    async deleteEmployee(employee: EmployeeEntity) {
        for (const subordinate of employee.subordinates ?? []) {
            await this.changeBoss(employee.boss?.id ?? null, subordinate)
        }

        return this.treeRepository.delete({id: employee.id})
    }

    getList() {
        return this.treeRepository.find()
    }

    getTrees() {
        return this.treeRepository.findTrees()
    }
}
