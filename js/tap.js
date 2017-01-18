/**                               公用方法开始                 * */
function isPc() {
    var uaInfo = navigator.userAgent;
    var agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var i = 0; i < agents.length; i++) {
        if (uaInfo.indexOf(agents[i]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function isTap(self) {
    if (isVue2 ? self.disabled : self.el.disabled) {
        return false;
    }
    var tapObj = self.tapObj;
    return self.time < 300 && Math.abs(tapObj.distanceX) < 20 && Math.abs(tapObj.distanceY) < 20;
}

function touchstart(e, self) {
    var touches = e.touches[0];
    var tapObj = self.tapObj;
    tapObj.pageX = touches.pageX;
    tapObj.pageY = touches.pageY;
    tapObj.clientX = touches.clientX;
    tapObj.clientY = touches.clientY;
    self.time = +new Date();
}

function touchend(e, self) {
    var touches = e.changedTouches[0];
    var tapObj = self.tapObj;
    self.time = +new Date() - self.time;
    tapObj.distanceX = tapObj.pageX - touches.pageX;
    tapObj.distanceY = tapObj.pageY - touches.pageY;

    if (!isTap(self)) return;
    self.handler(e);

}

/**                               公用方法结束                 * */

if (isPc()) {
    el.addEventListener('click', function(e) {
        if (self.el.href && !self.modifiers.prevent) {
            return window.location = self.el.href;
        }
        self.handler.call(self, e);
    }, false);
} else {
    el.addEventListener('touchstart', function(e) {
        touchstart(e, self);
    }, false);
    el.addEventListener('touchend', function(e) {
        Object.defineProperties(e, { // 重写currentTarget对象 与jq相同
            "currentTarget": {
                value: self.el,
                writable: true,
                enumerable: true,
                configurable: true
            },
        });
        e.preventDefault();

        return touchend(e, el);
    }, false);
}
