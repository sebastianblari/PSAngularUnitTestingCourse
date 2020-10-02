import { Component } from "@angular/compiler/src/core";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "./hero.component";

describe('HeroComponent - ShallowTests', () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent<HeroComponent>(HeroComponent);
    })

    it('should have the correct hero', () => {
        // arrange
        fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 3};

        // assert
        expect(fixture.componentInstance.hero.id).toEqual(1);
        expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
        expect(fixture.componentInstance.hero.strength).toEqual(3);

    })  

    it('should the hero name in an anchor tag', () => {
        // arrange
        fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 3};
        fixture.detectChanges();

        // assert
        let debugA = fixture.debugElement.query(By.css('a'));
        expect(debugA.nativeElement.textContent).toContain('SuperDude');
        expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
    })
})