import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionFacade } from './subscription.facade';
import { TestBed } from '@automock/jest';

describe('SubscriptionFacade', () => {
  let facade: SubscriptionFacade;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(SubscriptionFacade).compile();

    facade = unit;
  });
  
  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
