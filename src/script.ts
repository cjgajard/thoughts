let index = 0;
let lines = 0;
let target = 0;
let disableScroll = false;
let indexExpired = true;
let $: HTMLElement;

document.addEventListener('DOMContentLoaded', function() {
    $ = document.getElementById('screen');
    document.addEventListener('keydown', onscreenkeydown);
    document.addEventListener('keyup', onscreenkeyup);
    $.addEventListener('scroll', onscreenscroll);
    resetIndex();
});

/* events */

function onscreenkeydown (event) {
    switch (event.code) {
        case 'KeyF':
            if (event.ctrlKey) {
                event.preventDefault();
            }
            break;
    }
}

function onscreenkeyup (event) {
    if (disableScroll) {
        return;
    }
    switch (event.code) {
        case 'KeyB':
            scrollTo($.scrollTop - $.offsetHeight);
            break;
        case 'KeyD':
            scrollTo($.scrollTop + $.offsetHeight / 2);
            break;
        case 'KeyF':
            scrollTo($.scrollTop + $.offsetHeight);
            break;
        case 'KeyG':
            if (event.shiftKey) {
                scrollTo($.scrollHeight);
            } else {
                scrollTo(0);
            }
            break;
        case 'KeyJ':
            scroll(1);
            break;
        case 'KeyK':
            scroll(-1);
            break;
        case 'KeyU':
            scrollTo($.scrollTop - $.offsetHeight / 2);
            break;
        case 'Tab':
            resetIndex();
            break;
    }
}

function onscreenscroll () {
    if (Math.abs(target - $.scrollTop) >= 1) {
        return;
    }
    disableScroll = false;
    if (!indexExpired) {
        return;
    }
    resetIndex();
}

/* actions */

function scrollTo(t: number, r = true) {
    target = limit(t, 0, $.scrollHeight - $.offsetHeight);
    if (Math.abs(target - $.scrollTop) <= 1) {
        return;
    }
    disableScroll = true;
    indexExpired = r;
    $.scrollTo({ top: t, behavior: 'smooth' });
}

function scroll(direction: number) {
    /* ignore event if we are already at max scroll */
    if (direction > 0 && $.scrollTop >= $.scrollHeight - $.offsetHeight) {
        return;
    }

    let current = $.children[index] as HTMLElement;
    const height = Math.floor(getLineHeight(current));
    const start = current.offsetTop + lines * height;
    const nextLine = start + height;
    const bottom = current.offsetTop + current.offsetHeight;

    if (direction >= 0 || lines == 0) {
        do {
            index = limit(index + direction, 0, $.children.length);
            current = $.children[index] as HTMLElement;
        } while (current.tagName == "HR");
    }

    let t /*target*/ = current.offsetTop;
    if (nextLine < t && bottom - nextLine >= height) {
        t = nextLine;
        index -= direction;
        lines += 1;
    } else {
        lines = 0;
    }
    scrollTo(t, false);
}

function resetIndex() {
    for (let i = 0; i < $.children.length; i++) {
        const c = $.children[i] as HTMLElement;
        if ($.scrollTop == c.offsetTop) {
            index = i;
            lines = 0;
            return;
        }
        if ($.scrollTop < c.offsetTop) {
            index = i - 1;
            if (index < 0) {
                index = 0;
                lines = 0;
                return;
            }
            const prev = $.children[index] as HTMLElement;
            const h = getLineHeight(prev);
            const o = prev.offsetTop;
            let j = 0;
            while ($.scrollTop > o + j * h) {
                j++;
            }
            lines = j - 1;
            return;
        }
    }
    index = $.children.length - 1;
}

/* helper */

function limit(n: number, a: number, b: number): number {
    if (n < a) {
        n = a;
    }
    if (n >= b) {
        n = b - 1;
    }
    return n;
}

function getStyle(e: Element, styleProp: string): string | null
{
    let y;
    // if (e.currentStyle)
    //     y = e.currentStyle[styleProp];
    if (window.getComputedStyle) {
        y = document.defaultView.getComputedStyle(e).getPropertyValue(styleProp);
    }
    return y;
}

function getLineHeight(e: HTMLElement): number {
    const lh = getStyle(e, 'line-height');
    const lineHeight = parseFloat(lh);
    if (!isNaN(lineHeight)) {
        return lineHeight;
    }
    const clone = e.cloneNode() as typeof e;
    e.appendChild(clone);
    clone.innerHTML = '<br>';
    const singleLine = clone.offsetHeight;
    clone.innerHTML = '<br><br>';
    const doubleLine = clone.offsetHeight;
    e.removeChild(clone);
    return doubleLine - singleLine;
}
