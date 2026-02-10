import { Injectable } from '@nestjs/common';
import { PassengerConfirmationDto } from './interface/passenger-confirmation-dto';
import { User } from '../../user/domain/user.entity';
import { UserRepository } from '../../user/user.repository';
import { PassengerConfirmationRepository } from './passenger-confirmation.repository';
import { PassengerConfirmation } from './passenger-confirmation.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PagerEntityDto } from '../../interface/pager-entity-dto';
import { SchoolRepository } from '../../training/school/school.repository';
import { School } from '../../training/school/school.entity';

@Injectable()
export class PassengerConfirmationFacade {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passengerConfirmationRepository: PassengerConfirmationRepository,
        private readonly schoolRepository: SchoolRepository
    ) { }

    async createPassengerConfirmation(userId: number, passengerConfirmationDto: PassengerConfirmationDto): Promise<any> {
        const user: User = await this.userRepository.getUserById(userId);
        let passengerConfirmation: PassengerConfirmation = plainToClass(PassengerConfirmation, passengerConfirmationDto);

        passengerConfirmation.id = null;
        passengerConfirmation.user = user;
        if (passengerConfirmationDto.tandemSchool?.id) {
            const school: School = await this.schoolRepository.getSchoolById(passengerConfirmationDto.tandemSchool.id);
            passengerConfirmation.tandemSchool = school;
        }

        const response = await this.passengerConfirmationRepository.save(passengerConfirmation);
        return plainToClass(PassengerConfirmationDto, response);
    }

    async getPassengerConfirmations(userId: number, query: any): Promise<PagerEntityDto<PassengerConfirmationDto[]>> {
        const response = await this.passengerConfirmationRepository.getPassengerConfirmation(userId, query);
        const entityPager = new PagerEntityDto<PassengerConfirmationDto[]>();
        entityPager.entity = plainToInstance(PassengerConfirmationDto, response[0] as PassengerConfirmation[]);
        entityPager.itemCount = response[0].length;
        entityPager.totalItems = response[1];
        entityPager.itemsPerPage = (query?.limit) ? Number(query.limit) : entityPager.itemCount;
        entityPager.totalPages = (query?.limit) ? Math.ceil(entityPager.totalItems / Number(query.limit)) : entityPager.totalItems;
        entityPager.currentPage = (query?.offset) ? (query.offset >= entityPager.totalItems ? null : Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1) : 1;
        return entityPager;
    }

    async deletePassengerConfirmation(userId: number, id: number): Promise<void> {
        const passengerConfirmation: PassengerConfirmation = await this.passengerConfirmationRepository.getPassengerConfirmationById(id, userId);
        await this.passengerConfirmationRepository.delete(passengerConfirmation.id);
    }
}
