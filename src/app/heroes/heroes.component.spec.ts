import { shouldCallLifecycleInitHook } from '@angular/core/src/view';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroesComponent } from '../heroes/heroes.component';

describe('HeroesComponent', () => {
    const mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj<HeroService>('service', ['method']);
    let component: HeroesComponent;
    let heroes: Hero[];

    beforeEach(() => {
        heroes = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Woderful Woman', strength: 24},
            {id: 3, name: 'SpiderDude', strength: 55}
        ];
        component = new HeroesComponent(mockHeroService);
    });

    describe('delete', () => {
        it('should remove the indicated hero from the heroes list', () => {
            // arrange
            component.heroes = heroes;
            const heroToDelete: Hero = heroes[1];
            const expectedHeroes: Hero[] = [
                {id: 1, name: 'SpiderDude', strength: 8},
                {id: 3, name: 'SpiderDude', strength: 55}
            ];
            mockHeroService.deleteHero.and.returnValue(of(true));

            // act
            component.delete(heroToDelete);

            // assert
            expect(component.heroes).toEqual(expectedHeroes);
        });
    });
});
