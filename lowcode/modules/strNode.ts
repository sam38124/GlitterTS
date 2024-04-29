import { toCSS } from './toCSS.js';
import { JSONNode } from './toJSON.js';

export const strNode = function (
  name: string,
  value: JSONNode,
  depth = 0
): string {
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
