/**
 * The loader icon
 * @constructor
 */
const LoaderIcon = function() {
    this.element = this.createElement();

    this.loadSVG();
};

LoaderIcon.prototype.ID = "loader-icon";
LoaderIcon.prototype.CLASS_INVISIBLE = "invisible";
LoaderIcon.prototype.FILE = "svg/logo.svg";
LoaderIcon.prototype.FADE_IN_DELAY = .32;

/**
 * Load the SVG image
 */
LoaderIcon.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.element.innerHTML = request.responseText;

        setTimeout(() => {
            this.element.classList.remove(this.CLASS_INVISIBLE);
        }, 1000 * this.FADE_IN_DELAY);
    };

    request.open("GET", this.FILE, true);
    request.send();
};

/**
 * Create the element
 * @returns {HTMLDivElement} The element
 */
LoaderIcon.prototype.createElement = function() {
    const element = document.createElement("div");

    element.id = this.ID;
    element.className = this.CLASS_INVISIBLE;

    return element;
};