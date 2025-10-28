import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { DataSource, Not, Repository } from 'typeorm';
import { News } from '../src/news/news.entity';
import { User } from '../src/user/domain/user.entity';
import { Testdata } from './testdata';

export class BaseE2ETest {
  public get app(): INestApplication {
    return (global as any).testApp;
  }

  public get moduleFixture(): TestingModule {
    return (global as any).testModuleFixture;
  }

  public get dataSource(): DataSource {
    return (global as any).testDataSource;
  }

  public get userRepository(): Repository<any> {
    return (global as any).testUserRepository;
  }

  public get newsRepository(): Repository<News> {
    return (global as any).testNewsRepository;
  }

  public get placeRepository(): Repository<any> {
    return (global as any).testPlaceRepository;
  }

  public get gliderRepository(): Repository<any> {
    return (global as any).testGliderRepository;
  }

  public get controlSheetRepository(): Repository<any> {
    return (global as any).testControlSheetRepository;
  }

  public get flightRepository(): Repository<any> {
    return (global as any).testFlightRepository;
  }

  public get schoolRepository(): Repository<any> {
    return (global as any).testSchoolRepository;
  }

  public get teamMemberRepository(): Repository<any> {
    return (global as any).testTeamMemberRepository;
  }

  public getDefaultUser(): Promise<User> {
    return this.getUserByEmail(Testdata.EMAIL);
  }

  public getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({where: {
      email: email
    }})
  }

  async cleanupBetweenTests() {
    // Clean up data between tests - order matters due to foreign key constraints
    // Clear child tables first, then parent tables
    
    // Clear tables with no foreign key dependencies first
    await this.newsRepository.clear();
    await this.controlSheetRepository.clear();
    
    // Clear flight-related data (flights depend on places and gliders)
    await this.flightRepository.delete({});
    
    // Clear team_member before school (team_member has FK to school)
    await this.teamMemberRepository.delete({});
    
    // Now safe to delete schools
    await this.schoolRepository.delete({});
    
    // Clear remaining tables
    await this.placeRepository.delete({});
    await this.gliderRepository.delete({});

    // Delete all users except the one with test@user.com email
    await this.userRepository.delete({
        email: Not('test@user.com')
    });
  }

  getRepository<T>(entity: new (...args: any[]) => T): Repository<T> {
    return this.dataSource.getRepository(entity);
  }
}