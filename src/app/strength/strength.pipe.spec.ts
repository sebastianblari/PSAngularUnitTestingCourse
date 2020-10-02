import { StrengthPipe } from './strength.pipe';

describe('StrenghtPipe, ()', () => {
    it('should display weak if strength is less than 10', () => {
        // arrange
        let pipe: StrengthPipe = new StrengthPipe();
        let strengthLevel: number = 5;
        let expectedStrengthCategory: string = strengthLevel + ' (weak)';

        // act
        let actualStrengthCathegory: string = pipe.transform(strengthLevel);

        // assert
        expect(actualStrengthCathegory).toEqual(expectedStrengthCategory);
    })

    it('should display strong if strength is greater or equal than 10 and less than 20', () => {
        // arrange
        let pipe: StrengthPipe = new StrengthPipe();
        let strengthLevel: number = 10;
        let expectedStrengthCategory: string = strengthLevel + ' (strong)';

        // act
        let actualStrengthCathegory: string = pipe.transform(strengthLevel);

        // assert
        expect(actualStrengthCathegory).toEqual(expectedStrengthCategory);
    })

    it('should display unbelievable if strength is greater or equal than 20', () => {
        // arrange
        let pipe: StrengthPipe = new StrengthPipe();
        let strengthLevel: number = 20;
        let expectedStrengthCategory: string = strengthLevel + ' (unbelievable)';

        // act
        let actualStrengthCathegory: string = pipe.transform(strengthLevel);

        // assert
        expect(actualStrengthCathegory).toEqual(expectedStrengthCategory);
    })
})