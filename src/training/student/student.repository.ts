import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentRepository extends Repository<Student> {
    constructor(
        @InjectRepository(Student)
        private readonly repository: Repository<Student>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getStudentById(id: number): Promise<Student> {
        return this.repository.findOneOrFail({
            relations: {
                user: true,
                school: true
            },
            where: {
                id
            }
        });
    }

    async getStudentsBySchoolId(schoolId: number, archived?: boolean): Promise<Student[]> {
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                school: {
                    id: schoolId
                }
            }
        };
        if (archived != undefined) {
            options.where.isArchived = archived;
        }
        return this.repository.find(options);
    }

    async getStudentByUserId(userId: number): Promise<Student[]> {
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                user: {
                    id: userId
                }
            }
        };
        return this.repository.find(options);
    }

    async getStudentByEmail(email: string): Promise<Student[]> {
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                user: {
                    email: email
                }
            }
        };
        return this.repository.find(options);
    }
}
