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
/*
 const { pos = {}, updateInnerContentStyle = () => {} } = props;
 const { bottom = 10, sideWidth = 300, leftPadding = 48, rightPadding = 48, midPadding = 24, isMainPanel = true } = props.pos || {};
*/
export const ScrollSync = (props = {}) => {
    let vph, ch ,ih ,maxso, ivpo, cio, so;
    let fnIsFixed,
    let fnOffsetVpY,
    let fnOffsetY
    let isScrollDown;
    let prer;
    let _props = props;
    
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
    
    updateProps(propsIn = {}) {
        _props = propsIn;
    }
    
    function updateVars() {
        maxso = ch - vph;
        ivpo = ih- vph;
        cio = ch - ih;
    }
    
    function calc() {
        
    }
    
    function checkIsScrollDown(soIn, preSoIn, preIsScrollDownIn) {
        if (isNil(preSoIn) || isNil(so)) return null;
        if (soIn === preSoIn) return preIsScrollDownIn;
        if (soIn > preSoIn) return true;
        if (soIn < preSoIn) return false;
        return null;
    }
    
    function onContextChanged() {
        if (ch !== prer.ch || ih !== prer.ih) {
            if (fnOffsetY > cio) {
                fnOffsetY = cio;
            } else if (fnOffsetY < 0) {
                fnOffsetY = 0;
            }
        }
        if (vph !== prer.vph || ih !== prer.ih) {
            if (ivpo <= 0) {
                fnOffsetVpY = 0;
            } else if (fnOffsetVpY > ivpo) {
                fnOffsetVpY = ivpo;
            } else if (fnOffsetVpY < 0) {
                fnOffsetVpY = 0;
            }
        }
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
        onContextChanged();
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
            if (fnOffsetVpY > ivpo) {
                fnOffsetVpY = ivpo;
            } else {
                scrollBaseViewPort();
                return;
            }
        }
        fnOffsetY = so - ivpo;
        scrollBaseContainer();
    }
    
    function scrollUp() {
        if (fnOffsetVpY > 0) {
            fnOffsetVpY = so - fnOffsetY;
            if (fnOffsetVpY < 0) {
                fnOffsetVpY = 0;
            } else {
                scrollBaseViewPort();
                return;
            }
        }
        fnOffsetY = so;
        scrollBaseContainer();
    }
        
    function scrollBaseViewPort() { // inner sync on container, should not be fixed
        fnIsFixed = false;
        updateInnerStyle({
            position: 'static',
            'margin-top': `${fnOffsetY}px`,
            width: isMainPanel ? '100%' : `${sideWidth}px`
        });
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
        const { bottom = 10, sideWidth = 300, leftPadding = 48, rightPadding = 48, midPadding = 24, isMainPanel = true } = _props.pos || {};
        updateInnerStyle({
            position: 'fixed',
            'margin-top': `${fnOffsetY}px`,
            width: isMainPanel ? `calc(100% - ${ sideWidth + midPadding + leftPadding + rightPadding }px)` : `${sideWidth}px`,
            bottom: `${ -1 * ivpo }px`
        });
    }
    
    function scrollBaseContainerFixedBottom() {
        const { bottom = 10, sideWidth = 300, leftPadding = 48, rightPadding = 48, midPadding = 24, isMainPanel = true } = _props.pos || {};
        updateInnerStyle({
            position: 'fixed',
            'margin-top': `${fnOffsetY}px`,
            width: isMainPanel ? `calc(100% - ${ sideWidth + midPadding + leftPadding + rightPadding }px)` : `${sideWidth}px`,
            bottom: `${bottom}px`
        });
    }
    
    function updateInnerStyle(styleIn) {
        const { updateInnerContentStyle } = _props;
        if (updateInnerContentStyle) {
            updateInnerContentStyle(styleIn);
        }
    }
    
    function isNil(o) {
        return o === null || o === undefined;
    }
};
