import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyContact } from './emergency-contact.entity';

@Injectable()
export class EmergencyContactRepository extends Repository<EmergencyContact> {

    constructor(
        @InjectRepository(EmergencyContact)
        private readonly repository: Repository<EmergencyContact>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getEmergencyContacts(token: any, query: any): Promise<EmergencyContact[]> {
        const options: any = {
            where: {
                user: {
                    id: token.userId
                }
            },
            order: {
                id: 'ASC'
            }
        };

        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            options.take = query.limit;
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            options.skip = query.offset;
        }

        return await this.repository.find(options);
    }

    async getEmergencyContactById(token: any, id: number): Promise<EmergencyContact> {
        return this.repository.findOneByOrFail({ id: id, user: { id: token.userId } });
    }
}
