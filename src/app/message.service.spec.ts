
import { MessageService } from './message.service';

describe('MessageService', () => {
    let service: MessageService;

    beforeEach(() => {
        service = new MessageService();
    });

    it('should have no messages to start', () => {
        // arrange
        let expectedLenght: number = 0;

        // act

        // assert
        expect(service.messages.length).toBe(expectedLenght);
    });

    it('should add a message when add is called', () => {
        // arrange
        let newMessage: string = "message1";
        let expectedLenght: number = 1;

        // act
        service.add(newMessage)

        // assert
        expect(service.messages.length).toBe(expectedLenght);
    });

    it('should remove all messages when clear is called', () => {
        // arrange
        let expectedLenght: number = 0;
        let newMessage: string = "message1";
        service.add(newMessage);

        // act
        service.clear();

        // assert
        expect(service.messages.length).toBe(expectedLenght);
    });
});
