import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../../user/user.module';
import { ControlSheet } from './control-sheet.entity';
import { ControlSheetFacade } from './control-sheet.facade';
import { ControlSheetRepository } from './control-sheet.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ControlSheet])],
  providers: [ControlSheetFacade, ControlSheetRepository],
  exports: [ControlSheetRepository, ControlSheetFacade],
  controllers: []
})
export class ControlSheetModule {}
