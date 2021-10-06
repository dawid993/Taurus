import { LightningElement } from "lwc";
import registrationFirstName from "@salesforce/label/c.FirstName";
import registrationLastName from "@salesforce/label/c.LastName";
import registrationMiddleName from "@salesforce/label/c.MiddleName";
import registrationBirthDay from "@salesforce/label/c.BirthDay";
import registrationEmail from "@salesforce/label/c.Email";
import registrationPhone from "@salesforce/label/c.Phone";
import registrationIrnQuestion from "@salesforce/label/c.DoYouHaveIrnQuestion";
import registrationIrnYesAnswer from "@salesforce/label/c.IrnQuestionYesAnswer";
import registrationIrnNoAnswer from "@salesforce/label/c.IrnQuestionNoAnswer";
import registrationIrnMessage from "@salesforce/label/c.IrnMessage";
import registrationIrnNumber from "@salesforce/label/c.YourIrnNumber";
import registrationTc from "@salesforce/label/c.TermsAndCondition";
import registrationTcAgreement from "@salesforce/label/c.TermsAndConditionAgreement";
import registrationTcLink from "@salesforce/label/c.TermsAndConditionLink";
import registrationTcMessage from "@salesforce/label/c.TermsAndConditionMessage";
import register from "@salesforce/apex/PortalRegistrationController.register";
import emptyIrn from "@salesforce/label/c.EmptyIrn";
import passwordHeader from "@salesforce/label/c.RegistrationPassword";
import passwordInfo from "@salesforce/label/c.RegistrationPasswordInfo";
import password from "@salesforce/label/c.PasswordInput";
import passwordConfirmation from "@salesforce/label/c.PasswordConfirmation";
import passwordDoesntMatch from "@salesforce/label/c.PasswordDoesNotMatch";
import invalidPassword from "@salesforce/label/c.PasswordIsInvalid";

const YES_OPTION = 0;
const AGE_OF_CONSENT = 18;
const IRN_NO_MATCHED = false;
const IRN_MATCHED = true;
const EMPTY_MESSAGE = "";

const isIrnSelectedFormFieldName = "isIrnSelected";

const noServerRequestFields = ["tc-checbox", "password-confirmation"];
export default class PortalRegistration extends LightningElement {
    registrationLabels = {
        registrationFirstName,
        registrationLastName,
        registrationMiddleName,
        registrationBirthDay,
        registrationEmail,
        registrationPhone,
        registrationIrnQuestion,
        registrationIrnMessage,
        registrationIrnNumber,
        registrationTc,
        registrationTcAgreement,
        registrationTcLink,
        registrationTcMessage,
        passwordHeader,
        passwordInfo,
        password,
        passwordConfirmation,
        passwordDoesntMatch,
        invalidPassword
    }

    irnAnswers = [registrationIrnYesAnswer, registrationIrnNoAnswer];

    _showIrnInput;

    _isFormValid = false;

    _maxDate

    connectedCallback() {
        this.setBirthMaxDate();
    }

    get showIrnInput() {
        return this._showIrnInput;
    }

    get isFormValid() {
        return this._isFormValid;
    }

    get maxDate() {
        return this._maxDate;
    }

    onAnswerSelected(event) {
        this._showIrnInput = event?.detail === YES_OPTION;
    }

    onAnyFieldChange() {
        try {
            this._isFormValid = this._areAllFieldsValid();
        } catch (err) {
            this._emitError();
        }
    }

    onPasswordConfirmationBlur() {
        try {
            if (!this._arePasswordTheSame()) {
                this._setMessageForPasswordFields(passwordDoesntMatch);
            }
        } catch (err) {
            this._emitError();
        }
    }

    onPasswordConfirmationChange() {
        try {
            this._setMessageForPasswordFields(EMPTY_MESSAGE);
        } catch (err) {
            this._emitError();
        }
    }

    register() {
        try {
            const form = this._buildRegistrationForm();
            register(form).then(Object.freeze).then(this._processRegisterResult.bind(this));
        } catch (err) {
            this._emitError();
        }
    }

    _setMessageForPasswordFields(message) {
        Array.from(this.template.querySelectorAll("[data-id*='password']")).forEach(input => {
            input.setCustomValidity(message);
            input.showHelpMessageIfInvalid();
        });
    }

    _areAllFieldsValid() {
        return this._isShowIrnDeifned() &&
            Array.from(this.template.querySelectorAll("lightning-input")).reduce((acc, input) => acc && input.checkValidity(), true) &&
            this._arePasswordTheSame();
    }

    _arePasswordTheSame() {
        return this.template.querySelector("lightning-input[data-id='password']").value ===
            this.template.querySelector("lightning-input[data-id='password-confirmation']").value;
    }

    _isShowIrnDeifned() {
        return this._showIrnInput === true || this._showIrnInput === false;
    }

    setBirthMaxDate() {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - AGE_OF_CONSENT);
        this._maxDate = this._getIsoStringWithoutTime(currentDate);
    }

    _getIsoStringWithoutTime(currentDate) {
        return currentDate?.toISOString().substr(0, 10);
    }

    _emitError() {
        this.dispatchEvent(new CustomEvent("erroroccur"));
    }

    _processRegisterResult(result) {
        if (!result || !result.isSuccess || !result.isFormValid) {
            this._emitError();
        } else {  
            if (result.isIrnSelected) {
                if (!result.isIrnFilledByUser) {
                    this._onIrnNotFilled();
                } else if (!result.isIrnValid) {
                    this._onIrnInvalid();
                } else if (!result.isIrnMatchedWithEmailOrPhone) {
                    this._onRegistrationAttemptSuccess(IRN_NO_MATCHED);
                } else {
                    this._onRegistrationAttemptSuccess(IRN_MATCHED);
                }
            } else {
                this._onRegistrationAttemptSuccess(IRN_NO_MATCHED);
            }
        }
    }

    _buildRegistrationForm() {
        if (!this._areAllFieldsValid()) {
            throw new Error("Form is invalid!");
        }

        const form = Array.from(this.template.querySelectorAll("lightning-input"))
            .filter(input => !noServerRequestFields.some(elem => elem === input.dataset.id))
            .reduce((form, current) => {
                form[current.dataset.id] = current.value;
                return form;
            }, {});

        form[isIrnSelectedFormFieldName] = this.showIrnInput;

        return form;
    }

    _onIrnNotFilled() {
        this.template.querySelector("[data-id=irnInput]").setCustomValidity(emptyIrn);
    }

    _onIrnInvalid() {
        this.template.querySelector("[data-id=irnInput]").setCustomValidity(emptyIrn);
    }

    _onRegistrationAttemptSuccess(isIrnMatched) {
        this.dispatchEvent(new CustomEvent("registrationsuccessful", {
            detail: {
                isIrnMatched
            }
        }));
    }
}