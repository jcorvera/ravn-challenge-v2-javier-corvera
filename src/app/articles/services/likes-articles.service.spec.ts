import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { LikesArticlesService } from './likes-articles.service';

describe('LikesArticlesService', () => {
  let service: LikesArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesService],
    }).compile();

    service = module.get<LikesArticlesService>(LikesArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
