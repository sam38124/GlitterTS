import { Glitter } from "../Glitter.js";
export class AnimationConfig {
    constructor(inView, outView) {
        this.inView = inView;
        this.outView = outView;
    }
}
export class Animation {
}
Animation.none = new AnimationConfig((page, finish) => {
    finish();
}, (page, finish) => {
    finish();
});
Animation.fade = new AnimationConfig((page, finish) => {
    page.getElement().css("opacity", "0.1");
    page.getElement().animate({ "opacity": "1" }, 300);
    setTimeout(() => {
        finish();
    }, 250);
}, (page, finish) => {
    page.getElement().addClass('position-fixed');
    page.getElement().css("opacity", "1.0");
    page.getElement().animate({ "opacity": "0.1" }, 300);
    setTimeout(() => {
        finish();
    }, 250);
});
Animation.rightToLeft = new AnimationConfig((pageConfig, finish) => {
    Glitter.glitter.addStyle(`.inRightToLeft{
    animation:RightToLeft 0.3s ; /*IE*/
    -moz-animation:RightToLeft 0.3s; /*FireFox*/
    -webkit-animation:RightToLeft 0.3s ; /*Chrome, Safari*/
}

@keyframes RightToLeft{
    from {left:100%;}
    to {left:0%;}
}

@-moz-keyframes RightToLeft{
    from {left:100%;}
    to {left:0%;}
}

@-webkit-keyframes RightToLeft{
    from {left:100%;}
    to {left:0%;}
}`);
    Glitter.glitter.addStyle(`.inRightToLeftDismiss{
    animation:RightToLeftD 0.3s ; /*IE*/
    -moz-animation:RightToLeftD 0.3s; /*FireFox*/
    -webkit-animation:RightToLeftD 0.3s ; /*Chrome, Safari*/
}

@keyframes RightToLeftD{
    from {left:0%;}
    to {left:100%;}
}

@-moz-keyframes RightToLeftD{
    from {left:0%;}
    to {left:100%;}
}

@-webkit-keyframes RightToLeftD{
    from {left:0%;}
    to {left:100%;}
}`);
    pageConfig.getElement().addClass(`inRightToLeft`);
    setTimeout(() => {
        pageConfig.getElement().removeClass('inRightToLeft');
        finish();
    }, 300);
}, (pageConfig, finish) => {
    pageConfig.getElement().addClass('position-fixed');
    pageConfig.getElement().addClass(`inRightToLeftDismiss`);
    setTimeout(() => {
        finish();
    }, 250);
});
Animation.topToBottom = new AnimationConfig((pageConfig, finish) => {
    Glitter.glitter.addStyle(`.inTopToBottom{
    animation:TopToBtn 0.3s ; /*IE*/
    -moz-animation:TopToBtn 0.3s; /*FireFox*/
    -webkit-animation:TopToBtn 0.3s ; /*Chrome, Safari*/
}

@keyframes TopToBtn{
    from {top:-100%;}
    to {top:0%;}
}

@-moz-keyframes TopToBtn{
    from {top:-100%;}
    to {top:0%;}
}

@-webkit-keyframes TopToBtn{
    from {top:-100%;}
    to {top:0%;}
}`);
    Glitter.glitter.addStyle(`.TopToBtnDismiss{
    animation:TopToBtnD 0.3s ; /*IE*/
    -moz-animation:TopToBtnD 0.3s; /*FireFox*/
    -webkit-animation:TopToBtnD 0.3s ; /*Chrome, Safari*/
}

@keyframes TopToBtnD{
    from {top:0%;}
    to {top:-100%;}
}

@-moz-keyframes TopToBtnD{
    from {top:0%;}
    to {top:-100%;}
}

@-webkit-keyframes TopToBtnD{
    from {top:0%;}
    to {top:-100%;}
}`);
    pageConfig.getElement().addClass(`inTopToBottom`);
    setTimeout(() => {
        pageConfig.getElement().removeClass('inTopToBottom');
        finish();
    }, 300);
}, (pageConfig, finish) => {
    pageConfig.getElement().addClass('position-fixed');
    pageConfig.getElement().addClass(`TopToBtnDismiss`);
    setTimeout(() => {
        finish();
    }, 250);
});
