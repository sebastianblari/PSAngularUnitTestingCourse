import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { shouldCallLifecycleInitHook } from '@angular/core/src/view';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { HeroesComponent } from '../heroes/heroes.component';

describe('HeroesComponent - Isolated Tests', () => {
    const mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj<HeroService>('heroService', ['addHero', 'deleteHero', 'getHeroes']);
    let component: HeroesComponent;
    let heroes: Hero[];

    beforeEach(() => {
        heroes = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Woderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ];
        component = new HeroesComponent(mockHeroService);
    });

    describe('delete', () => {
        it('should remove the indicated hero from the heroes list', () => {
            // arrange
            const heroToDelete: Hero = heroes[1];
            const expectedHeroes: Hero[] = [
                {id: 1, name: 'SpiderDude', strength: 8},
                {id: 3, name: 'SuperDude', strength: 55}
            ];
            
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = heroes;

            // act
            component.delete(heroToDelete);

            // assert
            expect(component.heroes).toEqual(expectedHeroes);
        });
    });

    describe('delete', () => {
        it('should call deleteHero', () => {
            // arrange
            const heroToDelete: Hero = heroes[1];
            const expectedHeroes: Hero[] = [
                {id: 1, name: 'SpiderDude', strength: 8},
                {id: 3, name: 'SuperDude', strength: 55}
            ];
            
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = heroes;

            // act
            component.delete(heroToDelete);

            // assert
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroToDelete);
        });
    });
});

describe('HeroesComponenet - Shallow Integration Tests', () => {
    let heroes: Hero[];
    let fixture: ComponentFixture<HeroesComponent>;
    const mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj('heroService',['getHeroes','add','delete'])
    
    @Component({
        selector: 'app-hero',
        template: `<div></div>`
    })
    class FakeHeroComponent {
        @Input() hero: Hero;
        @Output() delete = new EventEmitter();
    }

    beforeEach(() => {
        heroes = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Woderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ];

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                FakeHeroComponent
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService}
            ]
        });
        fixture = TestBed.createComponent<HeroesComponent>(HeroesComponent);
    });

    it('should set heroes correctly from the service', () => {
        mockHeroService.getHeroes.and.returnValue(of(heroes));
        fixture.detectChanges();
        expect(fixture.componentInstance.heroes.length).toBe(3);
    });

    it('should create one li for each hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(heroes));
        fixture.detectChanges();

        let debugLi = fixture.debugElement.queryAll(By.css('li'));
        expect(debugLi.length).toBe(heroes.length);
    });
});

describe('HeroesComponenet - Deep Integration Tests', () => { 
    const mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj<HeroService>('heroService',['getHeroes', 'add', 'remove']);
    let heroes: Hero[];
    let fixture: ComponentFixture<HeroesComponent>;
    
    beforeEach(() => {
        heroes = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Woderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ];

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService}  
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(heroes));
        fixture.detectChanges();

        let heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        for (let i = 0; i < heroComponentDEs.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero.id).toEqual(heroes[i].id);
            expect(heroComponentDEs[i].componentInstance.hero.name).toEqual(heroes[i].name);
            expect(heroComponentDEs[i].componentInstance.hero.strength).toEqual(heroes[i].strength);
        }

    })
});