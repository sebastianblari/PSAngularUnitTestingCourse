import { Component, DebugElement, Directive, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { shouldCallLifecycleInitHook } from '@angular/core/src/view';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Button } from 'protractor';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { HeroesComponent } from '../heroes/heroes.component';

// -> Mocking Router    
@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' } ,
})

export class RouterLinkDirectiveStub{
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;
    
    onClick() {
        this.navigatedTo = this.linkParams;
    }
};
// <-

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
            component.deleteHero(heroToDelete);

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
            component.deleteHero(heroToDelete);

            // assert
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroToDelete);
        });
    });
});

describe('HeroesComponenet - Shallow Integration Tests', () => {
    let heroes: Hero[];
    let fixture: ComponentFixture<HeroesComponent>;
    const mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj('heroService',['getHeroes','addHero','delete'])
    
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
    
    const mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj<HeroService>('heroService',['getHeroes', 'addHero', 'remove']);
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

    it(`should call heroService.deleteHero when the Hero Component's delete's event`, () => {
        // arrange
        spyOn(fixture.componentInstance, 'deleteHero'); // -> literally it's used to spy on deleteHero
        mockHeroService.getHeroes.and.returnValue(of(heroes));

        //act
        fixture.detectChanges();
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        
        // Grabs the child component's template and triggers the HTLM element
        heroComponents[0].query(By.css('button')).triggerEventHandler('click', {stopPropagation: () => { }});
        
        // Emits using the child component's Event Emitter called delete using the component Instance 
        (<HeroComponent>heroComponents[1].componentInstance).delete.emit(undefined);
        
        // Emits using the child component's Event Emitter using the debugElement
        heroComponents[2].triggerEventHandler('delete', null);

        // assert
        expect(fixture.componentInstance.deleteHero).toHaveBeenCalledWith(heroes[0]);
        expect(fixture.componentInstance.deleteHero).toHaveBeenCalledWith(heroes[1]);
        expect(fixture.componentInstance.deleteHero).toHaveBeenCalledWith(heroes[2]);
    });

    it(`should add a new hero to the hero list when the add button is clicked`, () => {
        // arrange
        mockHeroService.getHeroes.and.returnValue(of(heroes));
        fixture.detectChanges();
        const name = 'Mr. Ice';
        mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4})); 
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.query(By.css('button'));
        fixture.detectChanges();

        //act
        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        

        // assert
        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(inputElement.value);
    });
});
    

describe('HeroesComponenet - Deep Integration Tests - Mocking Router Link', () => { 

    const mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj<HeroService>('heroService',['getHeroes', 'addHero', 'remove']);
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
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService}  
            ]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should have the correct route for the first hero', () => {
        // arrange
        mockHeroService.getHeroes.and.returnValue(of(heroes));
        fixture.detectChanges();
        const heroComponents: DebugElement[] = fixture.debugElement.queryAll(By.directive(HeroComponent));
        // const routerLink: RouterLinkDirectiveStub = heroComponents[0].query(By.directive(RouterLinkDirectiveStub)).injector.get(RouterLinkDirectiveStub);
        const routerLink: RouterLinkDirectiveStub = heroComponents[0].query(By.directive(RouterLinkDirectiveStub)).injector.get(RouterLinkDirectiveStub);
        
        //  act
        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);
        const heroId = heroComponents[0].componentInstance.hero.id;
        // assert

        expect(routerLink.navigatedTo).toBe(`/detail/${heroId}`)

        
    })
});