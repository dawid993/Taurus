import { createElement } from 'lwc';
import SingleAnswerCheckboxesQuestion from 'c/singleAnswerCheckboxesQuestion';

const componentName = 'c-single-answer-checkboxes-question';
const defaultQuestion = 'Does it even work?'
const defaultAnswers = ['Answer1', 'Answer2'];

const createQuestionComponent = (componentName, question, answeres) => {
    const questionCmpInstance = createElement(componentName, {
        is: SingleAnswerCheckboxesQuestion
    });
    questionCmpInstance.question = question;
    questionCmpInstance.answers = answeres;
    document.body.appendChild(questionCmpInstance);

    return questionCmpInstance;
};

const selectInput = (questionCmpInstance, dataId) => {
    return questionCmpInstance.shadowRoot.querySelector(`div.answer-section input[data-id="${dataId}"]`);
};

const answerSelectedEventDecorator = expectedAnswerId => event => expect(event.detail).toBe(expectedAnswerId);

describe('c-single-answer-checkboxes-question', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Should render question and answeres', () => {
        const questionCmpInstance = createQuestionComponent(componentName, defaultQuestion, defaultAnswers);
        expect(questionCmpInstance.shadowRoot.querySelector('h2')?.textContent).toMatch(defaultQuestion);
        expect(questionCmpInstance.shadowRoot.querySelectorAll('div.answer-section')?.length).toBe(2);
        questionCmpInstance.shadowRoot.querySelectorAll('div.answer-section').forEach((div, index) => {
            expect(div.querySelector('input')).toBeTruthy();
            expect(div.querySelector('label')).toBeTruthy();
            expect(+div.querySelector('input')?.dataset.id).toBe(index);
            expect(div.querySelector('label')?.textContent).toMatch(defaultAnswers[index]);
        });
    });

    it('Should emit answerselected event', () => {
        const questionCmpInstance = createQuestionComponent(componentName, defaultQuestion, defaultAnswers);
        let answerSelectorHandler = answerSelectedEventDecorator(0);
        questionCmpInstance.addEventListener('answerselected', answerSelectorHandler);

        let firstOption = selectInput(questionCmpInstance, 0);
        let secondOption = selectInput(questionCmpInstance, 1);
        expect(firstOption?.checked).toBe(false);
        expect(secondOption?.checked).toBe(false);

        firstOption?.click();
        firstOption = selectInput(questionCmpInstance, 0);
        secondOption = selectInput(questionCmpInstance, 1);
        expect(firstOption?.checked).toBe(true);
        expect(secondOption?.checked).toBe(false);

        questionCmpInstance.removeEventListener('answerselected', answerSelectorHandler);
        questionCmpInstance.addEventListener('answerselected', answerSelectedEventDecorator(1));
        secondOption.click();
        return Promise.resolve().then(() => {
            firstOption = selectInput(questionCmpInstance, 0);
            secondOption = selectInput(questionCmpInstance, 1);
            expect(firstOption?.checked).toBe(false);
            expect(secondOption?.checked).toBe(true);
        });
    });
});