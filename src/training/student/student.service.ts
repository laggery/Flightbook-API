import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Student } from './student.entity';
import { ArchivedStudent } from './studentArchived.entity';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(ArchivedStudent)
        private readonly studentArchivedRepository: Repository<ArchivedStudent>
    ) { }

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

    async getStudentById(userId: number): Promise<Student[]> {
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

    async getStudentsByIdAndSchoolId(userId: number, schoolId: number): Promise<Student> {
        if (!userId || !schoolId) {
            return undefined;
        }
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                user: {
                    id: userId
                },
                school: {
                    id: schoolId
                }
            }
        };
        return this.studentRepository.findOne(options);
    }

    async getArchivedStudentsByIdAndSchoolId(userId: number, schoolId: number): Promise<Student> {
        if (!userId || !schoolId) {
            return undefined;
        }
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                user: {
                    id: userId
                },
                school: {
                    id: schoolId
                }
            }
        };
        return this.studentArchivedRepository.findOne(options);
    }

    async saveStudent(student: Student): Promise<Student | undefined> {
        return await this.studentRepository.save(student);
    }

    async removeStudent(student: Student): Promise<Student | undefined> {
        return await this.studentRepository.remove(student);
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

    async updateArchivedStudentByIdAndSchoolId(userId: number, schoolId: number): Promise<UpdateResult> {
        if (!userId || !schoolId) {
            return undefined;
        }
        let options: any = {
            user: {
                id: userId
            },
            school: {
                id: schoolId
            }

        };
        return this.studentArchivedRepository.update(options, { timestamp: () => "now()" });
    }

    async saveArchivedStudent(student: ArchivedStudent): Promise<ArchivedStudent | undefined> {
        return await this.studentArchivedRepository.save(student);
    }
}
