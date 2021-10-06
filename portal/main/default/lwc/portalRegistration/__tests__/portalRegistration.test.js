import { createElement } from 'lwc';
import PortalRegistration from 'c/portalRegistration';
import register from '@salesforce/apex/PortalRegistrationController.register';
import { leftComposeWithStartElement } from 'c/functionalUtils';

jest.mock(
    '@salesforce/apex/PortalRegistrationController.register',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

const invalidResponse = require('./data/formInvalid.json');
const actionFailedResponse = require('./data/actionFailed.json');
const irnSelectedButNotFilledResponse = require('./data/irnSelectedButNotFilled.json');
const irnSelectedButInvalid = require('./data/irnSelectedButInvalid.json');
const irnSelectedButNotMatched = require('./data/irnSelectedButNotMatched.json');
const registrationFullValid = require('./data/registrationFullValid.json');

const IRN_YES_OPTION = 0;
const IRN_NO_OPTION = 1;
const changeEvent = new Event('change', {
    bubbles: true
});

const selectAllInputs = component => Array.from(component.shadowRoot.querySelectorAll('lightning-input'));
const setCheckValidityForInputs = isValid => inputs => inputs.map(element => {
    element.checkValidity = () => isValid
    return element;
});

const createPortalRegistrationComponent = () => {
    const element = createElement('c-portal-registration', {
        is: PortalRegistration
    });
    document.body.appendChild(element);

    return element;
};

const dispatchQuestionEvent = (element, option) => {
    element.shadowRoot.querySelector('c-single-answer-checkboxes-question').dispatchEvent(new CustomEvent('answerselected', {
        detail: option
    }));
}

describe('c-portal-registration', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        register.mockClear();
    });

    it('Should enable registration button', () => {
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_YES_OPTION);
        expect(element.shadowRoot.querySelector('lightning-button').disabled).toBe(true);

        return Promise.resolve().then(() => {
            const inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
        });
    });

    it('Should disable registration button', () => {
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_YES_OPTION);
        expect(element.shadowRoot.querySelector('lightning-button').disabled).toBe(true);
        let inputs;

        return Promise.resolve().then(() => {
            inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
            inputs[0].checkValidity = () => false;
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBe(true);
        });
    });

    it('Should emit error occur event', () => {
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_YES_OPTION);
        expect(element.shadowRoot.querySelector('lightning-button').disabled).toBe(true);

        let errorEmited = false;
        element.addEventListener('erroroccur', () => errorEmited = true);

        let inputs;

        return Promise.resolve().then(() => {
            inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
            inputs[0].checkValidity = () => false;
            element.shadowRoot.querySelector('lightning-button').click();
        }).then(() => {
            expect(errorEmited).toBe(true);
        });
    });

    it('Should render irn number input', () => {
        const element = createPortalRegistrationComponent();
        expect(element.shadowRoot.querySelector('lightning-input[data-id="irnInput"')).toBeFalsy();
        dispatchQuestionEvent(element, IRN_YES_OPTION);

        return Promise.resolve().then(() => {
            expect(element.shadowRoot.querySelector('lightning-input[data-id="irnInput"')).toBeTruthy();
        });
    });

    it('Should unrender irn number input', () => {
        const element = createPortalRegistrationComponent();
        expect(element.shadowRoot.querySelector('lightning-input[data-id="irnInput"')).toBeFalsy();
        dispatchQuestionEvent(element, IRN_YES_OPTION);

        return Promise.resolve().then(() => {
            expect(element.shadowRoot.querySelector('lightning-input[data-id="irnInput"')).toBeTruthy();
            dispatchQuestionEvent(element, IRN_NO_OPTION);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-input[data-id="irnInput"')).toBeFalsy();
        });
    });

    it("Should emit error occure event because form doesn't pass server validation", () => {
        register.mockResolvedValue(invalidResponse);
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_NO_OPTION);

        let errorEmitted = false;
        element.addEventListener('erroroccur', () => errorEmitted = true);

        return Promise.resolve().then(() => {
            const inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
            element.shadowRoot.querySelector('lightning-button').click();
            return Promise.resolve();
        }).then(() => {
            expect(register.mock.calls.length).toBe(1);
            expect(errorEmitted).toBe(true);
        });
    });

    it("Should emit error occure event because form request failed", () => {
        register.mockResolvedValue(actionFailedResponse);
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_NO_OPTION);

        let errorEmitted = false;
        element.addEventListener('erroroccur', () => errorEmitted = true);

        return Promise.resolve().then(() => {
            const inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
            element.shadowRoot.querySelector('lightning-button').click();
            return Promise.resolve();
        }).then(() => {
            expect(register.mock.calls.length).toBe(1);
            expect(errorEmitted).toBe(true);
        });
    });

    it("Should present error on irn input because it's selected but empty.", () => {
        register.mockResolvedValue(irnSelectedButNotFilledResponse);
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_YES_OPTION);

        return Promise.resolve().then(() => {
            const inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
            element.shadowRoot.querySelector("[data-id=irnInput]").setCustomValidity = jest.fn();
            element.shadowRoot.querySelector('lightning-button').click();
            return new Promise(resolve => setImmediate(resolve()));
        }).then(() => {
            expect(register.mock.calls.length).toBe(1);
            expect(element.shadowRoot.querySelector("[data-id=irnInput]").setCustomValidity.mock.calls.length).toBe(1);
        });
    });

    it("Should present error on irn input because it's selected but invalid.", () => {
        register.mockResolvedValue(irnSelectedButInvalid);
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_YES_OPTION);

        return Promise.resolve().then(() => {
            const inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
            element.shadowRoot.querySelector("[data-id=irnInput]").setCustomValidity = jest.fn();
            element.shadowRoot.querySelector('lightning-button').click();
            return new Promise(resolve => setImmediate(resolve()));
        }).then(() => {
            expect(register.mock.calls.length).toBe(1);
            expect(element.shadowRoot.querySelector("[data-id=irnInput]").setCustomValidity.mock.calls.length).toBe(1);
        });
    });

    it("Should emit registration successful event with irn matched as false.", () => {
        register.mockResolvedValue(irnSelectedButNotMatched);
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_YES_OPTION);

        let registrationSuccessful = {
            eventEmitted : false,
            irnMatched : false
        };

        element.addEventListener('registrationsuccessful', event => {
            registrationSuccessful.eventEmitted = true;
            registrationSuccessful.irnMatched = event.detail.isIrnMatched;
        });

        return Promise.resolve().then(() => {
            const inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
            element.shadowRoot.querySelector("[data-id=irnInput]").setCustomValidity = jest.fn();
            element.shadowRoot.querySelector('lightning-button').click();
            return Promise.resolve();
        }).then(() => {
            expect(register.mock.calls.length).toBe(1);
            expect(registrationSuccessful.eventEmitted).toBe(true);
            expect(registrationSuccessful.irnMatched).toBe(false);
        });
    });

    it("Should emit registration successful event with irn matched as true.", () => {
        register.mockResolvedValue(registrationFullValid);
        const element = createPortalRegistrationComponent();
        dispatchQuestionEvent(element, IRN_YES_OPTION);

        let registrationSuccessful = {
            eventEmitted : false,
            irnMatched : false
        };

        element.addEventListener('registrationsuccessful', event => {
            registrationSuccessful.eventEmitted = true;
            registrationSuccessful.irnMatched = event.detail.isIrnMatched;
        });

        return Promise.resolve().then(() => {
            const inputs = leftComposeWithStartElement(element)(selectAllInputs, setCheckValidityForInputs(true));
            inputs[0].dispatchEvent(changeEvent);
        }).then(() => {
            expect(element.shadowRoot.querySelector('lightning-button').disabled).toBeFalsy();
            element.shadowRoot.querySelector("[data-id=irnInput]").setCustomValidity = jest.fn();
            element.shadowRoot.querySelector('lightning-button').click();
            return new Promise(resolve => setImmediate(resolve()));
        }).then(() => {
            expect(register.mock.calls.length).toBe(1);
            expect(registrationSuccessful.eventEmitted).toBe(true);
            expect(registrationSuccessful.irnMatched).toBe(true);
        });
    });

    it("Should present message that password doesn't match password confirmation.", () => {
        const element = createPortalRegistrationComponent();
        const passwordField = element.shadowRoot.querySelector("lightning-input[data-id='password']");
        const passwordConfirmationField = element.shadowRoot.querySelector("lightning-input[data-id='password-confirmation']");
        passwordField.setCustomValidity = jest.fn();
        passwordConfirmationField.setCustomValidity = jest.fn();

        passwordField.value = "123";
        passwordConfirmationField.value = "345"

        passwordConfirmationField.dispatchEvent(new CustomEvent("change"));
        expect(passwordField.setCustomValidity.mock.calls.length).toBe(1);
        expect(passwordConfirmationField.setCustomValidity.mock.calls.length).toBe(1);    
        passwordConfirmationField.dispatchEvent(new CustomEvent("blur"));
        expect(passwordConfirmationField.setCustomValidity.mock.calls.length).toBe(2);  
    });
});