const leftCompose = (...fns) => fns.reduce((accumulator, current) => current(accumulator));
const leftComposeWithStartElement = startElem => (...fns) => fns.reduce((accumulator, current) => current(accumulator), startElem);

export {
    leftCompose,
    leftComposeWithStartElement
}