import { LightningElement } from 'lwc';
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

const YES_OPTION = 0;

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
        registrationTcMessage
    }

    irnAnswers = [registrationIrnYesAnswer, registrationIrnNoAnswer];

    _showIrnInput;

    get showIrnInput() {
        return this._showIrnInput;
    }

    onAnswerSelected(event) {
        this._showIrnInput = event.detail === YES_OPTION;
    }

}