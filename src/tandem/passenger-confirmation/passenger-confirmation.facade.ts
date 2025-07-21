import { Injectable } from '@nestjs/common';
import { PassengerConfirmationDto } from './interface/passenger-confirmation-dto';
import { User } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';
import { PassengerConfirmationRepository } from './passenger-confirmation.repository';
import { PassengerConfirmation } from './passenger-confirmation.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PagerEntityDto } from '../../interface/pager-entity-dto';

@Injectable()
export class PassengerConfirmationFacade {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly passengerConfirmationRepository: PassengerConfirmationRepository
    ) { }

    async createPassengerConfirmation(userId: number, passengerConfirmationDto: PassengerConfirmationDto): Promise<any> {
        const user: User = await this.userRepository.getUserById(userId);
        let passengerConfirmation: PassengerConfirmation = plainToClass(PassengerConfirmation, passengerConfirmationDto);

        passengerConfirmation.id = null;
        passengerConfirmation.user = user;

        return this.passengerConfirmationRepository.save(passengerConfirmation);
    }

    async getPassengerConfirmations(userId: number, query: any): Promise<any> {
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
