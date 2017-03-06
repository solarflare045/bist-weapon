import { BistWeaponPage } from './app.po';

describe('bist-weapon App', () => {
  let page: BistWeaponPage;

  beforeEach(() => {
    page = new BistWeaponPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
