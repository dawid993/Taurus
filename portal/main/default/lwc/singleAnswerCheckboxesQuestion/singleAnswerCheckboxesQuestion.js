import { api, LightningElement, track } from 'lwc';

export default class SingleAnswerCheckboxesQuestion extends LightningElement {
    _question = '';

    @track
    _answers = [];

    @api
    set question(question) {
        this._question = question;
    }

    get question() {
        return this._question;
    }

    @api
    set answers(answers) {
        this._answers = answers.map((answer, idx) => ({ content: answer, id: idx, isSelected: false }));
    }

    get answers() {
        return this._answers;
    }

    onAnswerClick(event) {
        const answerId = parseInt(event.currentTarget.dataset.id);
        this._answers.filter(answer => answer.id != answerId).forEach(answer => answer.isSelected = false);
        this._answers.find(answer => answer.id === answerId).isSelected = true;
        this._answers = [...this._answers];
        this.dispatchEvent(new CustomEvent('answerselected', {
            bubbles: true,
            detail: answerId
        }));
    }
}