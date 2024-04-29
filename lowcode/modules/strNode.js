import { toCSS } from './toCSS.js';
export const strNode = function (name, value, depth = 0) {
    let cssString = '';
    for (let i = 0; i <= depth; ++i) {
        cssString += '  ';
    }
    cssString += name + ' {\n';
    cssString += toCSS(value, depth + 1);
    for (let i = 0; i <= depth; ++i) {
        cssString += '  ';
    }
    cssString += '}\n';
    return cssString;
};
