import { createElement } from 'lwc';
import ErrorScreen from 'c/errorScreen';

describe('c-error-screen', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('should emit close event when close icon is clicked', () => {
        const element = createElement('c-error-screen', {
            is: ErrorScreen
        });

        document.body.appendChild(element);
        let eventEmitted = false;
        element.addEventListener('closeerrorscreen', () => eventEmitted = true);
        element.shadowRoot.querySelector('.close-icon')?.click();
        expect(eventEmitted).toBe(true);        
    });
});