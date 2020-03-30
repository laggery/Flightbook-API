import { Injectable } from '@nestjs/common';
import { GliderService } from './glider.service';
import { UserService } from 'src/user/user.service';
import { GliderDto } from './interface/place-dto';
import { Glider } from './glider.entity';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/user.entity';
import * as moment from 'moment';
import { WrongDateFormatException } from './exception/wrong-date-format-exception';

@Injectable()
export class GliderFacade {

    constructor(private gliderService: GliderService, private userService: UserService) { }

    async getGliders(token: any, query: any): Promise<GliderDto[]> {
        const list: Glider[] = await this.gliderService.getGliders(token, query);
        return plainToClass(GliderDto, list);
    }

    async createPlace(token: any, gliderDto: GliderDto): Promise<GliderDto> {
        // check if date is valide format
        if (gliderDto.buyDate && !moment(gliderDto.buyDate, 'YYYY-MM-DD',true).isValid()) {
            throw new WrongDateFormatException();
        }

        const user: User = await this.userService.getUserById(token.userId);
        const glider: Glider = plainToClass(Glider, gliderDto);
        glider.id = null;
        glider.user = user;

        const gliderResp: Glider = await this.gliderService.saveGlider(glider);
        return plainToClass(GliderDto, gliderResp);
    }

    async updateGlider(token: any, id: number, gliderDto: GliderDto): Promise<GliderDto> {
        // check if date is valide format
        if (gliderDto.buyDate && !moment(gliderDto.buyDate, 'YYYY-MM-DD',true).isValid()) {
            throw new WrongDateFormatException();
        }

        const glider: Glider = await this.gliderService.getGliderById(token, id);

        glider.brand = gliderDto.brand;
        glider.buyDate = gliderDto.buyDate;
        glider.tandem = gliderDto.tandem;
        const gliderResp: Glider = await this.gliderService.saveGlider(glider);
        return plainToClass(GliderDto, gliderResp);
    }

    async removeGlider(token: any, id: number): Promise<GliderDto> {
        const glider: Glider = await this.gliderService.getGliderById(token, id);
        const gliderResp: Glider = await this.gliderService.removePlace(glider);
        return plainToClass(GliderDto, gliderResp);
    }
}
