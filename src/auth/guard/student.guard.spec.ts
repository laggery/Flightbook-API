import { StudentGuard } from './student.guard';

describe('StudentGuard', () => {
  it('should be defined', () => {
    expect(new StudentGuard()).toBeDefined();
  });
});
