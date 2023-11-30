import { Test, TestingModule } from '@nestjs/testing';
import { LdbPaymentService } from './ldb-payment.service';

describe('LdbPaymentService', () => {
  let service: LdbPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LdbPaymentService],
    }).compile();

    service = module.get<LdbPaymentService>(LdbPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
