class DomElement {

    /**
     * @constructor
     * @param  {String, HTMLElement} elOrType
     */
    constructor(elOrType) {
        if (elOrType instanceof HTMLElement) {
            this._dom = elOrType;
        } else {
            this._dom = document.createElement(elOrType);
        }
        return this;
    }

    /**
     * @description set className
     * @param  {String} cls
     */
    class(cls) {
        this._dom.className += cls;
        return this;
    }

    /**
     * @description set innerHTML
     * @param  {String} html
     */
    html(html) {
        this._dom.innerHTML = html;
        return this;
    }

    /**
     * @description set textContent
     * @param  {string} text
     */
    text(text) {
        this._dom.textContent = text;
        return this;
    }

    /**
     * @description set an onclick-callback
     * @param  {function} callback
     */
    click(callback) {
        this._dom.onclick = callback;
        return this;
    }

    /**
     * @description Set an attribute
     * @param  {string} name
     * @param  {string, number} content
     */
    attr(name, content) {
        this._dom.setAttribute(name, content);
        return this;
    }


    /**
     * @description append an HTMLElement
     * @param  {HTMLElement, ... } ...another
     */
    app(...another) {
        another.forEach(a => this._dom.append(a.dom));
        return this;
    }

    /**
     * @description returns origin HTMLElement
     */
    get dom() {
        return this._dom;
    }
}

export class DIV extends DomElement { constructor(el = null) { el ? super(el) : super("div"); } }
export class P extends DomElement { constructor(el = null) { el ? super(el) : super("p"); } }
export class H3 extends DomElement { constructor(el = null) { el ? super(el) : super("h3"); } }
export class H4 extends DomElement { constructor(el = null) { el ? super(el) : super("h4"); } }
export class IMG extends DomElement { constructor(el = null) { el ? super(el) : super("img"); } }
export class A extends DomElement { constructor(el = null) { el ? super(el) : super("a"); } }
export class BUTTON extends DomElement { constructor(el = null) { el ? super(el) : super("button"); } }

/**
 * @description shortens the standard dom syntax
 * @param  {String} query
 */
export function $(query) {
    return document.querySelector(query);
}

/**
 * @description toggles the fullscreen-mode of the browser
 */
export function toggleFullscreen() {
    const element = document.querySelector("html");
    var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

    element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
    document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

    isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
}

