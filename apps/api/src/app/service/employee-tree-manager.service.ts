import {DataSource, TreeRepository} from "typeorm";
import {EmployeeEntity} from "../entity/employee.entity";
import {InjectDataSource} from "@nestjs/typeorm";
import {Injectable, NotFoundException} from "@nestjs/common";


@Injectable()
export class EmployeeTreeManagerService {

    private readonly treeRepository: TreeRepository<EmployeeEntity>

    constructor(@InjectDataSource() private datasource: DataSource) {
        this.treeRepository = this.datasource.getTreeRepository(EmployeeEntity)
    }

    async changeBoss(newBossId: number, employee: EmployeeEntity) {
        const queryRunner = this.datasource.manager.connection.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            // Fetch the new boss
            const newBoss = await queryRunner.manager.findOne(EmployeeEntity, {where: {id: newBossId}});

            if (!newBoss) {
                throw new NotFoundException('cannot find entity for newBossId=' + newBossId)
            }

            // Fetch the current materialized path
            const [currentPath] = await queryRunner.query(
                `SELECT mpath
                 FROM employee_entity
                 WHERE id = $1`,
                [employee.id]
            );

            if (!currentPath) {
                throw new Error('Materialized path not found for the current employee')
            }

            const oldPath = currentPath.mpath;

            // Fetch the new boss's materialized path
            const  [newBossPath] = await queryRunner.query(
                `SELECT mpath
                 FROM employee_entity
                 WHERE id = $1`,
                [newBossId]
            );

            if (!newBossPath) {
                throw new Error('Materialized path not found for the new boss')
            }

            const newPath = [...newBossPath.mpath.split('.').filter(entry => entry.length>0), employee.id].join('.')

            // Update the materialized path for the current employee
            await queryRunner.query(
                `UPDATE employee_entity
                 SET bossId = $1,
                     mpath = $2
                 WHERE id = $3`,
                [newBossId, newPath, employee.id]
            );

            // Update the materialized path for all descendants
            await queryRunner.query(
                `UPDATE employee_entity
                 SET mpath = REPLACE(mpath, $1, $2)
                 WHERE mpath LIKE $3`,
                [oldPath, newPath, `${oldPath}%`]
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            console.error('Error changing boss:', error);
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
}
