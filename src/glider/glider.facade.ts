import { Injectable } from '@nestjs/common';
import { GliderService } from './glider.service';
import { UserService } from 'src/user/user.service';
import { GliderDto } from './interface/glider-dto';
import { Glider } from './glider.entity';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/user.entity';
import * as moment from 'moment';
import { InvalidDateException } from './exception/invalid-date-exception';
import { PagerDto } from 'src/interface/pager-dto';
import { checkIfDateIsValid } from '../util/date-utils';

@Injectable()
export class GliderFacade {

    constructor(private gliderService: GliderService, private userService: UserService) { }

    async getGliders(token: any, query: any): Promise<GliderDto[]> {
        const list: Glider[] = await this.gliderService.getGliders(token, query);
        return plainToClass(GliderDto, list);
    }

    async getGliderbyName(token: any, name: string): Promise<GliderDto> {
        const glider: Glider = await this.gliderService.getGliderByName(token, name);
        return plainToClass(GliderDto, glider);
    }

    async getGlidersPager(token: any, query: any): Promise<PagerDto> {
        return this.gliderService.getGlidersPager(token, query);
    }

    async createGlider(token: any, gliderDto: GliderDto): Promise<GliderDto> {
        const { buyDate } = gliderDto;

        if (checkIfDateIsValid(buyDate)) {
            throw new InvalidDateException();
        }

        const user: User = await this.userService.getUserById(token.userId);
        const glider: Glider = plainToClass(Glider, gliderDto);

        // format date
        if (buyDate) {
            glider.buyDate = moment(buyDate).format('YYYY-MM-DD');
        }
        glider.id = null;
        glider.user = user;

        const gliderResp: Glider = await this.gliderService.saveGlider(glider);
        return plainToClass(GliderDto, gliderResp);
    }

    async updateGlider(token: any, id: number, gliderDto: GliderDto): Promise<GliderDto> {
        // check if date is valide
        if (gliderDto.buyDate && Number.isNaN(Date.parse(gliderDto.buyDate))) {
            throw new InvalidDateException();
        }
        const glider: Glider = await this.gliderService.getGliderById(token, id);

        glider.brand = gliderDto.brand;
        glider.name = gliderDto.name;
        // format date
        if (gliderDto.buyDate) {
            glider.buyDate = moment(gliderDto.buyDate).format('YYYY-MM-DD');
        } else {
            glider.buyDate = null;
        }
        glider.tandem = gliderDto.tandem;
        const gliderResp: Glider = await this.gliderService.saveGlider(glider);
        return plainToClass(GliderDto, gliderResp);
    }

    async removeGlider(token: any, id: number): Promise<GliderDto> {
        const glider: Glider = await this.gliderService.getGliderById(token, id);
        const gliderResp: Glider = await this.gliderService.removePlace(glider);
        return plainToClass(GliderDto, gliderResp);
    }

    async getGliderById(token: any, id: number): Promise<GliderDto | undefined> {
        const glider: Glider = await this.gliderService.getGliderById(token, id);
        return plainToClass(GliderDto, glider);
    }
}
