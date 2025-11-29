import { GliderRepository } from './glider.repository';
import { Repository } from 'typeorm';
import { Glider } from './glider.entity';

describe('Glider Repository', () => {
  let gliderRepository: GliderRepository;

  beforeAll(async () => {
    const repository = {} as Repository<Glider>;
    gliderRepository = new GliderRepository(repository);
  });

  it('should be defined', () => {
    expect(gliderRepository).toBeDefined();
  });
});
