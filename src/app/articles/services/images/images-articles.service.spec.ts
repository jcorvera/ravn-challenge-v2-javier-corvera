import { Test, TestingModule } from '@nestjs/testing';
import { ImagesArticlesService } from '../images/images-articles.service';

describe('ImagesArticlesService', () => {
  let service: ImagesArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesArticlesService],
    }).compile();

    service = module.get<ImagesArticlesService>(ImagesArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
