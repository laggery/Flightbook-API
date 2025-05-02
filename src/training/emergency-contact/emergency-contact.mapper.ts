import { EmergencyContact } from './emergency-contact.entity';
import { EmergencyContactDto } from './interface/emergency-contact-dto';

export class EmergencyContactMapper {
    static toEmergencyContactDto(emergencyContact: EmergencyContact): EmergencyContactDto {
        if (!emergencyContact) {
            return null;
        }
        
        const emergencyContactDto = new EmergencyContactDto();
        emergencyContactDto.id = emergencyContact.id;
        emergencyContactDto.firstname = emergencyContact.firstname;
        emergencyContactDto.lastname = emergencyContact.lastname;
        emergencyContactDto.phone = emergencyContact.phone;
        emergencyContactDto.additionalInformation = emergencyContact.additionalInformation;
        
        return emergencyContactDto;
    }

    static toEmergencyContactDtoList(emergencyContacts: EmergencyContact[]): EmergencyContactDto[] {
        if (!emergencyContacts) {
            return [];
        }
        
        return emergencyContacts.map(emergencyContact => this.toEmergencyContactDto(emergencyContact));
    }
}
