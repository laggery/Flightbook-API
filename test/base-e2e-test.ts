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

  public get enrollmentRepository(): Repository<any> {
    return (global as any).testEnrollmentRepository;
  }

  public get studentRepository(): Repository<any> {
    return (global as any).testStudentRepository;
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
    // Clear tables in the correct order (child tables first)
    // 1. Clear tables with no dependencies first
    await this.newsRepository.clear();
    await this.controlSheetRepository.clear();
    
    // 2. Clear flight-related data (flights might reference places/gliders)
    await this.flightRepository.delete({});
    
    // 3. Clear training-related data in correct order
    // team_member depends on school and user
    await this.teamMemberRepository.delete({});
    
    // student might depend on school  
    await this.studentRepository.delete({});
    
    // enrollment might depend on school
    await this.enrollmentRepository.delete({});
    
    // Now safe to delete schools (no more references)
    await this.schoolRepository.delete({});
    
    // 4. Clear other independent tables
    await this.placeRepository.delete({});
    await this.gliderRepository.delete({});

    // 5. Delete all users except the default test user (do this last)
    const defaultUser = Testdata.getDefaultUser();
    await this.userRepository.delete({
      email: Not(defaultUser.email)
    });
  }

  getRepository<T>(entity: new (...args: any[]) => T): Repository<T> {
    return this.dataSource.getRepository(entity);
  }
}