import { Injectable } from '@nestjs/common';
import { GliderRepository } from './glider.repository';
import { UserRepository } from '../user/user.repository';
import { GliderDto } from './interface/glider-dto';
import { Glider } from './glider.entity';
import { plainToClass } from 'class-transformer';
import { User } from '../user/domain/user.entity';
import * as moment from 'moment';
import { InvalidDateException } from './exception/invalid-date-exception';
import { checkIfDateIsValid } from '../shared/util/date-utils';

@Injectable()
export class GliderFacade {

    constructor(private gliderRepository: GliderRepository, private userRepository: UserRepository) { }

    async getGliders(token: any, query: any): Promise<GliderDto[]> {
        const list: Glider[] = await this.gliderRepository.getGliders(token, query);
        return plainToClass(GliderDto, list);
    }

    async getGliderbyName(token: any, name: string): Promise<GliderDto> {
        const glider: Glider = await this.gliderRepository.getGliderBySimilarityName(token, name);
        return plainToClass(GliderDto, glider);
    }

    async createGlider(token: any, gliderDto: GliderDto): Promise<GliderDto> {
        const { buyDate } = gliderDto;

        if (checkIfDateIsValid(buyDate)) {
            throw new InvalidDateException();
        }

        const user: User = await this.userRepository.getUserById(token.userId);
        const glider: Glider = plainToClass(Glider, gliderDto);

        // format date
        if (buyDate) {
            glider.buyDate = moment(buyDate).format('YYYY-MM-DD');
        }

        if (glider.checks?.length == 0) {
            glider.checks = null;
        }

        glider.id = null;
        glider.user = user;

        const gliderResp: Glider = await this.gliderRepository.save(glider);
        return plainToClass(GliderDto, gliderResp);
    }

    async updateGlider(token: any, id: number, gliderDto: GliderDto): Promise<GliderDto> {
        // check if date is valide
        if (gliderDto.buyDate && Number.isNaN(Date.parse(gliderDto.buyDate))) {
            throw new InvalidDateException();
        }
        const glider: Glider = await this.gliderRepository.getGliderById(token, id);

        glider.brand = gliderDto.brand;
        glider.name = gliderDto.name;
        // format date
        if (gliderDto.buyDate) {
            glider.buyDate = moment(gliderDto.buyDate).format('YYYY-MM-DD');
        } else {
            glider.buyDate = null;
        }
        glider.tandem = gliderDto.tandem;
        glider.archived = gliderDto.archived;
        glider.note = gliderDto.note ? gliderDto.note : null;

        if (gliderDto.checks?.length == 0) {
            glider.checks = null;
        } else {
            glider.checks = gliderDto.checks;
        }
        
        const gliderResp: Glider = await this.gliderRepository.save(glider);
        return plainToClass(GliderDto, gliderResp);
    }

    async removeGlider(token: any, id: number): Promise<GliderDto> {
        const glider: Glider = await this.gliderRepository.getGliderById(token, id);
        const gliderResp: Glider = await this.gliderRepository.remove(glider);
        return plainToClass(GliderDto, gliderResp);
    }

    async getGliderById(token: any, id: number): Promise<GliderDto | undefined> {
        const glider: Glider = await this.gliderRepository.getGliderById(token, id);
        return plainToClass(GliderDto, glider);
    }
}
