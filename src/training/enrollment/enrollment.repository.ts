import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentType } from './enrollment-type';
import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentRepository extends Repository<Enrollment> {

    constructor(
        @InjectRepository(Enrollment)
        private readonly repository: Repository<Enrollment>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getStudentsEnrollmentByEmailAndSchoolId(email: string, schoolId: number): Promise<Enrollment[]> {
        let options: any = {
            relations: {
                school: true
            },
            where: {
                email: email,
                school: {
                    id: schoolId
                },
                type: EnrollmentType.STUDENT
            }
        };
        return this.find(options);
    }

    async getTeamMemberEnrollmentByEmailAndSchoolId(email: string, schoolId: number): Promise<Enrollment[]> {
        let options: any = {
            relations: {
                school: true
            },
            where: {
                email: email,
                school: {
                    id: schoolId
                },
                type: EnrollmentType.TEAM_MEMBER
            }
        };
        return this.find(options);
    }

    async getEnrollmentByToken(token: string): Promise<Enrollment> {
        if (!token) {
            return undefined;
        }
        return this.findOne(
            {
                relations: {
                    school: true
                },
                where: {
                    token: token
                }
            }
        );
    }
}
