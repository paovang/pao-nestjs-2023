import { Test, TestingModule } from '@nestjs/testing';
import { PubnubService } from './pubnub.service';

describe('PubnubService', () => {
  let service: PubnubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PubnubService],
    }).compile();

    service = module.get<PubnubService>(PubnubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
