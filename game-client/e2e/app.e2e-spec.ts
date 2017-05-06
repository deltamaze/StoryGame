import { GameClientPage } from './app.po';

describe('game-client App', () => {
  let page: GameClientPage;

  beforeEach(() => {
    page = new GameClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
