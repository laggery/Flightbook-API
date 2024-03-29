import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentType } from './enrollment-type';
import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentService {

    constructor(
        @InjectRepository(Enrollment)
        private readonly enrollmentRepository: Repository<Enrollment>
    ) { }

    async saveEnrollment(studentEnrollment: Enrollment): Promise<Enrollment> {
        return await this.enrollmentRepository.save(studentEnrollment);
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
        return this.enrollmentRepository.find(options);
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
        return this.enrollmentRepository.find(options);
    }

    async getEnrollmentByToken(token: string): Promise<Enrollment> {
        if (!token) {
            return undefined;
        }
        return this.enrollmentRepository.findOne(
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
