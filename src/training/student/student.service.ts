import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>
    ) { }

    async getStudentsBySchoolId(schoolId: number): Promise<Student[]> {
        let options: any = {
            relations: ["user", "school"],
            where: {
                school: {
                    id: schoolId
                }
            }
        };
        return this.studentRepository.find(options);
    }

    async getStudentsById(userId: number): Promise<Student[]> {
        let options: any = {
            relations: ["user", "school"],
            where: {
                user: {
                    id: userId
                }
            }
        };
        return this.studentRepository.find(options);
    }

    async saveStudent(student: Student): Promise<Student | undefined> {
        return await this.studentRepository.save(student);
    }
}
