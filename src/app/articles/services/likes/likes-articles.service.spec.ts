import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from '../articles/articles.service';
import { LikesArticlesService } from '../likes/likes-articles.service';

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
