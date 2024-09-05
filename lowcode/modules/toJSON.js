import { altX, commentX, lineAttrX } from './regex.js';
import { CheckInput } from './checkInput.js';
const capComment = 1;
const capSelector = 2;
const capEnd = 3;
const capAttr = 4;
const defaultArgs = {
    ordered: false,
    comments: false,
    stripComments: false,
    split: false,
};
export const toJSON = function (cssString, args = defaultArgs) {
    const node = {
        children: {},
        attributes: {},
    };
    let match = null;
    let count = 0;
    if (args.stripComments) {
        args.comments = false;
        cssString = cssString.replace(commentX, '');
    }
    while ((match = altX.exec(cssString)) != null) {
        if (!CheckInput.isEmpty(match[capComment]) && args.comments) {
            node[count++] = match[capComment].trim();
        }
        else if (!CheckInput.isEmpty(match[capSelector])) {
            const name = match[capSelector].trim();
            const newNode = toJSON(cssString, args);
            if (args.ordered) {
                node[count++] = { name, value: newNode, type: 'rule' };
            }
            else {
                const bits = args.split ? name.split(',') : [name];
                for (const i in bits) {
                    const sel = bits[i].trim();
                    if (sel in node.children) {
                        for (const att in newNode.attributes) {
                            node.children[sel].attributes[att] = newNode.attributes[att];
                        }
                    }
                    else {
                        node.children[sel] = newNode;
                    }
                }
            }
        }
        else if (!CheckInput.isEmpty(match[capEnd])) {
            return node;
        }
        else if (!CheckInput.isEmpty(match[capAttr])) {
            const line = match[capAttr].trim();
            const attr = lineAttrX.exec(line);
            if (attr) {
                const name = attr[1].trim();
                const value = attr[2].trim();
                if (args.ordered) {
                    node[count++] = { name, value, type: 'attr' };
                }
                else {
                    if (name in node.attributes) {
                        const currVal = node.attributes[name];
                        if (!(currVal instanceof Array)) {
                            node.attributes[name] = [currVal];
                        }
                        node.attributes[name].push(value);
                    }
                    else {
                        node.attributes[name] = value;
                    }
                }
            }
            else {
                node[count++] = line;
            }
        }
    }
    return node;
};
