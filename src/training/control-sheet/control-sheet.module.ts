import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ControlSheet } from './control-sheet.entity';
import { ControlSheetFacade } from './control-sheet.facade';
import { ControlSheetService } from './control-sheet.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ControlSheet])],
  providers: [ControlSheetFacade, ControlSheetService],
  exports: [ControlSheetService, ControlSheetFacade],
  controllers: []
})
export class ControlSheetModule {}