import { Test, TestingModule } from '@nestjs/testing';
import { BcelOneService } from './bcel-one.service';

describe('BcelOneService', () => {
  let service: BcelOneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcelOneService],
    }).compile();

    service = module.get<BcelOneService>(BcelOneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
