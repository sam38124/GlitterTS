export class PageBox extends HTMLElement {

    public elementCallback: { [name: string]: { onCreate: () => void, onInitial: () => void, notifyDataChange: () => void, getView: () => string, updateAttribute: () => void } } = {}

    constructor() {
        super();
        console.log(`document222---`,document)
        const that = this
        const shadow = this.attachShadow({mode: 'open'});
        // Create a button element
        const divElement = document.createElement('html');
        divElement.setAttribute('class',"light-mode")
        divElement.innerHTML=`<head ></head>
<body id="glitterWebComponent"></body>`
        that.listenElementChange(divElement)
        shadow!.appendChild(divElement);
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
        shadow!.appendChild(css);

        this.initial_style()
    }


    initial_style() {
        const glitter = (window as any).glitter
        glitter.parameter.style.map((dd: any) => {
            this.add_style(dd)
        })
    }

    add_style(dd: any) {
        if (dd.type === 'code') {
            var css = document.createElement('style');
            css.type = 'text/css';
            css.id = dd.id
            if ((css as any).styleSheet)
                (css as any).styleSheet.cssText = dd.style;
            else
                css.appendChild(document.createTextNode(dd.style));
            this.shadowRoot!.querySelector('head')!.appendChild(css);
        } else {
            // 創建一個 link 元素來引入外部的 CSS 樣式
            const link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = dd.src;
            link.id = dd.id;
            // 將 link 元素添加到 Shadow DOM 中
            this.shadowRoot!.querySelector('head')!.appendChild(link);
        }
    }

    traverseHTML(element: any) {
        const that = this;
        const glitter = (window as any).glitter
        let result: any = {};
        result.attributes = {};
        // 取得元素的標籤名稱
        result.tag = element.tagName;
        // 取得元素的屬性
        var attributes = element.attributes ?? [];
        if (attributes.length > 0) {
            result.attributes = {};
            for (var i = 0; i < attributes.length; i++) {
                result.attributes[attributes[i].name] = attributes[i].value;
            }
        }
        // 取得元素的子元素
        let children = element.children;
        if (children && children.length > 0) {
            result.children = [];
            for (let j = 0; j < children.length; j++) {
                result.children.push(that.traverseHTML(children[j]));
            }
        }
        if (result.attributes.glem === 'bindView') {
            const gvcID = result.attributes['gvc-id']
            try {
                const view = that.elementCallback[gvcID].getView()
                glitter.$(element).html(`${view}`)

            } catch (e) {
            }
            try {
                that.elementCallback[gvcID].updateAttribute()
            } catch (e) {
            }
            try {
                that.elementCallback[gvcID].onInitial()
            } catch (e) {
            }
            try {
                that.elementCallback[gvcID].onCreate()
            } catch (e) {
            }
        }
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].value.includes('clickMap')) {
                const funString = `${attributes[i].value}`
                element.addEventListener(attributes[i].name.replace('on', ''), function () {
                    eval(funString)
                });
                element.removeAttribute(attributes[i].name);
            }
        }
        // 返回 JSON 結果
        return result;
    }

    listenElementChange(query: Element) {
        const that = this
        const targetElement: any = query;
        // 建立 Mutation Observer
        const observer = new MutationObserver(function (mutationsList) {
            // 檢查每個突變（變化）
            for (let mutation of mutationsList) {
                // 檢查是否是目標元素的子節點被插入
                if (mutation.addedNodes.length > 0) {
                    // 在這裡編寫對元素插入內容的處理程式碼
                    for (const b of mutation.addedNodes) {
                        that.traverseHTML(b)
                    }

                }
            }
        });
        // 開始觀察目標元素的變化
        observer.observe(targetElement, {childList: true, subtree: true});
    }

}

