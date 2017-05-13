import { TestBed, inject } from '@angular/core/testing';

import { StoryGameService } from './story-game.service';

describe('StoryGameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoryGameService]
    });
  });

  it('should ...', inject([StoryGameService], (service: StoryGameService) => {
    expect(service).toBeTruthy();
  }));
});
