import { Controller, Post, Body, Headers } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserWriteDto } from './interface/user-write-dto';
import { UserReadDto } from './interface/user-read-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller({
    path: 'users',
    version: '2'
})
@ApiTags('User v2')
@ApiBearerAuth('jwt')
export class UserControllerV2 {

    constructor(
        private userFacade: UserFacade) { }

    @Post()
    createUser(@Body() userWriteDto: UserWriteDto, @Headers('accept-language') language: string, @Headers('origin') origin: string): Promise<UserReadDto> {
        let isInstructorApp = false;
        if (origin.includes(process.env.ORIGIN_INSTRUCTOR)) {
            isInstructorApp = true;
        }
        return this.userFacade.createUser(userWriteDto, isInstructorApp, language);
    }
}
