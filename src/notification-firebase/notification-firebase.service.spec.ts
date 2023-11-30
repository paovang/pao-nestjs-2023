import { Test, TestingModule } from '@nestjs/testing';
import { NotificationFirebaseService } from './notification-firebase.service';

describe('NotificationFirebaseService', () => {
  let service: NotificationFirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationFirebaseService],
    }).compile();

    service = module.get<NotificationFirebaseService>(NotificationFirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
