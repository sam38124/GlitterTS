export async function traverseHTML(element) {
    var _a, _b;
    console.log(`elem:${element}:tag:${element.tagName}`);
    var result = {};
    result.tag = element.tagName;
    var attributes = element.attributes;
    if (attributes.length > 0) {
        result.attributes = {};
        for (var i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    let children = element.children;
    if (children.length > 0) {
        result.children = [];
        for (let j = 0; j < children.length; j++) {
            result.children.push(traverseHTML(children[j]));
        }
    }
    element.innerHTML = (_a = element.innerHTML) !== null && _a !== void 0 ? _a : "";
    element.innerText = (_b = element.innerText) !== null && _b !== void 0 ? _b : "";
    let trimmedStr = element.innerHTML.replace(/\n/, '').replace(/^\s+|\s+$/g, "");
    let trimmedStr2 = element.innerText.replace(/\n/, '').replace(/^\s+|\s+$/g, "");
    result.textIndex = trimmedStr.indexOf(trimmedStr2);
    result.innerText = element.innerText.replace(/\n/, '').replace(/^\s+|\s+$/g, "");
    return result;
}
