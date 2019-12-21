/* snap: which has the scrollbar
 vph: viewPortHeight, (0 <= vph)
 ch: containerHeight, (0 <= ih <= ch)
 ih: innerHeight, (0 <= ih)
 maxso: containerHeight - viewPortHeight, (0 < maxso)
 ivpo: innerHeight - viewPortHeight, (any)
 so: scrollOffset, (0<= so <= maxso)
 isScrollDown
*/

export const ScrollSync = () => {
    let vph, ch ,ih ,maxso, ivpo, so;
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
        so = null;
        isScrollDown = null;
    }
    
    function resetPrer() {
        prer = {
            vph: null,
            ch: null,
            ih: null,
            maxso: null,
            ivpo: null,
            so: null,
            isScrollDown: null
        };
    }
    
    function updatePrer() {
        prer = {
            vph,
            ch,
            ih,
            maxso,
            ivpo,
            so,
            isScrollDown
        };
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
        isScrollDown = checkIsScrollDown(so, prer.so, prer.isScrollDown);
        onScroll();
        updatePrer();
    }
    
    function onScroll() {
        if (isNil(isScrollDown)) return;
        if (isScrollDown) {
            scrollDown();
        } else {
            scrollUp();
        }
    }
    
    scrollDown() {
    
    }
    
    scrollUp() {
        
    }
        
    function isNil(o) {
        return o === null || o === undefined;
    }
};
