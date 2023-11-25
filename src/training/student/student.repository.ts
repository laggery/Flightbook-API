import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Student } from './student.entity';
import { ArchivedStudent } from './studentArchived.entity';

@Injectable()
export class StudentRepository {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(ArchivedStudent)
        private readonly studentArchivedRepository: Repository<ArchivedStudent>
    ) { }

    async getStudentById(id: number): Promise<Student> {
        return this.studentRepository.findOneOrFail({
            relations: {
                user: true,
                school: true
            },
            where: {
                id
            }
        });
    }

    async getArchivedStudentById(id: number): Promise<Student> {
        return this.studentArchivedRepository.findOneOrFail({
            relations: {
                user: true,
                school: true
            },
            where: {
                id
            }
        });
    }

    async getStudentsBySchoolId(schoolId: number): Promise<Student[]> {
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
        return this.studentRepository.find(options);
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
        return this.studentRepository.find(options);
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
        return this.studentRepository.find(options);
    }

    async saveStudent(student: Student): Promise<Student | undefined> {
        return await this.studentRepository.save(student);
    }

    async removeStudent(student: Student): Promise<Student | undefined> {
        return await this.studentRepository.remove(student);
    }

    async removeArchivedStudent(student: ArchivedStudent): Promise<Student | undefined> {
        return await this.studentArchivedRepository.remove(student);
    }

    async getArchivedStudentsBySchoolId(schoolId: number): Promise<ArchivedStudent[]> {
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
        return this.studentArchivedRepository.find(options);
    }

    async getArchivedStudentByUserIdAndSchoolId(userId: number, schoolId: number): Promise<ArchivedStudent> {
        return this.studentArchivedRepository.findOneBy({
            user: {
                id: userId
            },
            school: {
                id: schoolId
            }
        });
    }

    async saveArchivedStudent(student: ArchivedStudent): Promise<ArchivedStudent | undefined> {
        return await this.studentArchivedRepository.save(student);
    }
}
