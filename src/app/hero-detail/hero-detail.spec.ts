import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { of } from "rxjs/internal/observable/of"
import { Hero } from "../hero"
import { HeroService } from "../hero.service"
import { HeroDetailComponent } from "./hero-detail.component"
import { Location } from "@angular/common";

describe('HeroDetailComponent', () => {
    // const mockActivatedRoute: jasmine.SpyObj<ActivatedRoute> = jasmine.createSpyObj('activatedRoute', ['snapshot.paramMap.get']);
    const mockActivatedRoute = { 
        snapshot: { 
            paramMap: { 
                get: () => { return '3' }
            }
        }
    };
    // const mockActivatedRoute: jasmine.SpyObj<ActivatedRoute> = jasmine.createSpyObj('activatedRoute', ['snapshot.paramMap.get']);
    const mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj('heroService', ['getHero', 'updateHero']);
    const mockLocation : jasmine.SpyObj<Location> = jasmine.createSpyObj('location',['back']);
    let fixture: ComponentFixture<HeroDetailComponent>;
    beforeEach( () => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: HeroService, useValue: mockHeroService },
                { provide: Location, useValue: mockLocation }, 
            ]
        });
        fixture = TestBed.createComponent(HeroDetailComponent);
    });

    
    it('should render hero name in a h2 tag', () => {
        // arrange
        const newHero: Hero = {id: 23, name: 'Michael Jordan', strength: 100}
        mockHeroService.getHero.and.returnValue(of(newHero));
        
        // act
        fixture.detectChanges()

        // assert
        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('MICHAEL JORDAN');


    });
});