
function newDiv(classes) {
    return newElement('div', classes);
}

function newElement(tagName, classes) {
    var el = document.createElement(tagName);
    for (i = 0; i < classes.length; i++) {
        el.classList.add(classes[i])
    }
    return el;
}