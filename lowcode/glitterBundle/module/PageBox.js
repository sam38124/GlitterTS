export class PageBox extends HTMLElement {
    constructor() {
        super();
        this.elementCallback = {};
        console.log(`document222---`, document);
        const that = this;
        const shadow = this.attachShadow({ mode: 'open' });
        const divElement = document.createElement('html');
        divElement.setAttribute('class', "light-mode");
        divElement.innerHTML = `<head ></head>
<body id="glitterWebComponent"></body>`;
        that.listenElementChange(divElement);
        shadow.appendChild(divElement);
        var css = document.createElement('style');
        css.type = 'text/css';
        css.appendChild(document.createTextNode(`
         @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap');
         body{
         font-family: 'Open Sans', sans-serif ;
         }
          html{
         font-family: 'Open Sans', sans-serif ;
         }
        `));
        shadow.appendChild(css);
        this.initial_style();
    }
    initial_style() {
        const glitter = window.glitter;
        glitter.parameter.style.map((dd) => {
            this.add_style(dd);
        });
    }
    add_style(dd) {
        if (dd.type === 'code') {
            var css = document.createElement('style');
            css.type = 'text/css';
            css.id = dd.id;
            if (css.styleSheet)
                css.styleSheet.cssText = dd.style;
            else
                css.appendChild(document.createTextNode(dd.style));
            this.shadowRoot.querySelector('head').appendChild(css);
        }
        else {
            const link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = dd.src;
            link.id = dd.id;
            this.shadowRoot.querySelector('head').appendChild(link);
        }
    }
    traverseHTML(element) {
        var _a;
        const that = this;
        const glitter = window.glitter;
        let result = {};
        result.attributes = {};
        result.tag = element.tagName;
        var attributes = (_a = element.attributes) !== null && _a !== void 0 ? _a : [];
        if (attributes.length > 0) {
            result.attributes = {};
            for (var i = 0; i < attributes.length; i++) {
                result.attributes[attributes[i].name] = attributes[i].value;
            }
        }
        let children = element.children;
        if (children && children.length > 0) {
            result.children = [];
            for (let j = 0; j < children.length; j++) {
                result.children.push(that.traverseHTML(children[j]));
            }
        }
        if (result.attributes.glem === 'bindView') {
            const gvcID = result.attributes['gvc-id'];
            try {
                const view = that.elementCallback[gvcID].getView();
                glitter.$(element).html(`${view}`);
            }
            catch (e) {
            }
            try {
                that.elementCallback[gvcID].updateAttribute();
            }
            catch (e) {
            }
            try {
                that.elementCallback[gvcID].onInitial();
            }
            catch (e) {
            }
            try {
                that.elementCallback[gvcID].onCreate();
            }
            catch (e) {
            }
        }
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].value.includes('clickMap')) {
                const funString = `${attributes[i].value}`;
                element.addEventListener(attributes[i].name.replace('on', ''), function () {
                    eval(funString);
                });
                element.removeAttribute(attributes[i].name);
            }
        }
        return result;
    }
    listenElementChange(query) {
        const that = this;
        const targetElement = query;
        const observer = new MutationObserver(function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    for (const b of mutation.addedNodes) {
                        that.traverseHTML(b);
                    }
                }
            }
        });
        observer.observe(targetElement, { childList: true, subtree: true });
    }
}
