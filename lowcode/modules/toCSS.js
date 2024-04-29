import { strAttr } from './strAttr.js';
import { strNode } from './strNode.js';
export const toCSS = function (node, depth = 0, breaks = 0) {
    let cssString = '';
    if (node.attributes) {
        for (const i in node.attributes) {
            const att = node.attributes[i];
            cssString += strAttr(i, att, depth);
        }
    }
    if (node.children) {
        let first = true;
        for (const i in node.children) {
            if (breaks && !first) {
                cssString += '\n';
            }
            else {
                first = false;
            }
            cssString += strNode(i, node.children[i], depth);
        }
    }
    return cssString;
};
