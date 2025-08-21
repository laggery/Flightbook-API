import { Injectable } from '@nestjs/common';
import { EmergencyContactRepository } from './emergency-contact.repository';
import { UserRepository } from '../../user/user.repository';
import { EmergencyContactDto } from './interface/emergency-contact-dto';
import { User } from '../../user/domain/user.entity';
import { EmergencyContact } from './emergency-contact.entity';
import { plainToClass } from 'class-transformer';
import { EmergencyContactMapper } from './emergency-contact.mapper';

@Injectable()
export class EmergencyContactFacade {
    constructor(
        private emergencyContactRepository: EmergencyContactRepository,
        private userRepository: UserRepository
    ) { }

    async getEmergencyContacts(token: any, query: any): Promise<EmergencyContactDto[]> {
        const list: EmergencyContact[] = await this.emergencyContactRepository.getEmergencyContacts(token, query);
        return EmergencyContactMapper.toEmergencyContactDtoList(list);
    }

    async createUpdateEmergencyContact(token: any, emergencyContactDto: EmergencyContactDto): Promise<EmergencyContactDto> {
        const user: User = await this.userRepository.getUserById(token.userId);
        const emergencyContact: EmergencyContact = plainToClass(EmergencyContact, emergencyContactDto);

        if (emergencyContactDto.id) {
            const current: EmergencyContact = await this.emergencyContactRepository.getEmergencyContactById(token, emergencyContactDto.id);
            emergencyContact.id = current.id;
        }

        emergencyContact.user = user;

        const emergencyContactResp: EmergencyContact = await this.emergencyContactRepository.save(emergencyContact);
        return EmergencyContactMapper.toEmergencyContactDto(emergencyContactResp);
    }
}
