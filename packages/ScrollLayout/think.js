/* snap: which has the scrollbar
 vph: viewPortHeight, (0 <= vph)
 ch: containerHeight, (0 <= ih <= ch)
 ih: innerHeight, (0 <= ih)
 maxso: containerHeight - viewPortHeight, (0 < maxso)
 ivpo: innerHeight - viewPortHeight, (any)
 cio: container - innerHeight, (0 <= cio)
 so: scrollOffset, (0<= so <= maxso)
 isScrollDown, (true | false),
 fnIsFixed, (true | false)
 fnOffsetVpY: innerTopToViewPort, (0 <= fnOffsetVpY <= ivpo, ivpo >=0)
 fnOffsetY: innerTopToContainer (0 <= fnOffset <= cio)
*/

export const ScrollSync = () => {
    let vph, ch ,ih ,maxso, ivpo, cio, so;
    let fnIsFixed,
    let fnOffsetVpY,
    let fnOffsetY
    let isScrollDown;
    let prer;
    
    reset();
    resetPrer();
    
    return {
        run
    };
    
    function reset() {
        vph = null;
        ch = null;
        ih = null;
        maxso = null;
        ivpo = null;
        cio = null;
        so = null;
        isScrollDown = null;
        fnIsFixed = null;
        fnOffsetVpY = null;
        fnOffsetY = null;
    }
    
    function resetPrer() {
        prer = {
            vph: null,
            ch: null,
            ih: null,
            maxso: null,
            ivpo: null,
            cio: null,
            so: null,
            isScrollDown: null,
            fnIsFixed: null,
            fnOffsetVpY: null,
            fnOffsetY: null
        };
    }
    
    function updatePrer() {
        prer = {
            vph,
            ch,
            ih,
            maxso,
            ivpo,
            cio,
            so,
            isScrollDown,
            fnIsFixed,
            fnOffsetVpY,
            fnOffsetY
        };
    }
    
    function updateVars() {
        maxso = ch - vph;
        ivpo = ih- vph;
        cio = ch - ih;
    }
    
    function calc(params) {
        
    }
    
    function checkIsScrollDown(soIn, preSoIn, preIsScrollDownIn) {
        if (isNil(preSoIn) || isNil(so)) return null;
        if (soIn === preSoIn) return preIsScrollDownIn;
        if (soIn > preSoIn) return true;
        if (soIn < preSoIn) return false;
        return null;
    }
    
    function run(params) {
        const { scrollOffset, containerHeight, innerHeight, viewPortHeight } = params || {};
        so = scrollOffset;
        ch = containerHeight;
        ih = innerHeight;
        vph = viewPortHeight;
        updateVars();
        isScrollDown = checkIsScrollDown(so, prer.so, prer.isScrollDown);
        if (isNil(fnOffsetVpY)) fnOffsetVpY = 0;
        if (isNil(fnOffsetY)) fnOffsetY = 0;
        onScroll();
        updatePrer();
    }
    
    function onScroll() {
        if (isNil(isScrollDown)) return;
        if (ivpo <= 0) {
            fnOffsetY = so;
            scrollBaseContainer({ isfixedOnTop: true});
            return;
        }
        if (isScrollDown) {
            scrollDown();
        } else {
            scrollUp();
        }
    }
    
    function scrollDown() {
        if (fnOffsetVpY < ivpo) {
            fnOffsetVpY = so - fnOffsetY;
            scrollBaseViewPort();
            return;
        }
        fnOffsetY = so - ivpo;
        scrollBaseContainer();
    }
    
    function scrollUp() {
        
    }
        
    function scrollBaseViewPort() { // inner sync on container, should not be fixed
        fnIsFixed = false;
        
    }
        
    function scrollBaseContainer({ isfixedOnTop } = {}) { // inner sync on viewport, should be fixed
        fnIsFixed = true;
        if (isfixedOnTop) {
            scrollBaseContainerFixedTop();
            return;
        }
        if (isScrollDown) {
            scrollBaseContainerFixedBottom();
        } else {
            scrollBaseContainerFixedTop();
        }
        
    }
        
    function scrollBaseContainerFixedTop() {
    
    }
    
    function scrollBaseContainerFixedBottom() {
        
    }
        
    function isNil(o) {
        return o === null || o === undefined;
    }
};
