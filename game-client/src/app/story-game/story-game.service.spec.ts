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
  it('should kick off web api to start game on web server', inject([StoryGameService], (service: StoryGameService) => {
    expect(service).toBeFalsy();
  }));
});
