import {GVC} from "../glitterBundle/GVController.js";
import {ShareDialog} from "../dialog/ShareDialog.js";

export async function traverseHTML(element: any) {
    console.log(`elem:${element}:tag:${element.tagName}`)
    var result: any = {};

    // 取得元素的標籤名稱
    result.tag = element.tagName;
    // 取得元素的屬性
    var attributes = element.attributes;
    if (attributes.length > 0) {
        result.attributes = {};
        for (var i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    // 取得元素的子元素
    let children = element.children;
    if (children.length > 0) {
        result.children = [];
        for (let j = 0; j < children.length; j++) {
            result.children.push(traverseHTML(children[j]));
        }
    }
    element.innerHTML=element.innerHTML??"";
    element.innerText=element.innerText??"";
    let trimmedStr = element.innerHTML.replace(/\n/,'').replace(/^\s+|\s+$/g, "");
    let trimmedStr2 = element.innerText.replace(/\n/,'').replace(/^\s+|\s+$/g, "");
    result.textIndex=trimmedStr.indexOf(trimmedStr2)
    result.innerText=element.innerText.replace(/\n/,'').replace(/^\s+|\s+$/g, "")
    // 返回 JSON 結果
    return result;
}