import { createElement } from 'lwc';
import PortalRegistrationContainer from 'c/portalRegistrationContainer';

const createPortalRegistrationContainerElement = () => {
    const element = createElement('c-portal-registration-container', {
        is: PortalRegistrationContainer
    });
    document.body.appendChild(element);

    return element;
}

describe('c-portal-registration-container', () => {
    afterEach(() => {        
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('should show error screen when error occurs in registration component', () => {
        const element = createPortalRegistrationContainerElement();
        expect(element.shadowRoot.querySelector('c-error-screen')).toBeFalsy();
        element.shadowRoot.querySelector('c-portal-registration')?.dispatchEvent(new CustomEvent('erroroccure'));
        return Promise.resolve().then(() => 
            expect(element.shadowRoot.querySelector('c-error-screen')).toBeTruthy() 
        );
    });
});