/**
 * The background of the scene
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Sand} sand The sand renderer
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @param {Number} scale The render scale
 * @constructor
 */
const Background = function(
    gl,
    sand,
    width,
    height,
    scale) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.bottom = new RenderTarget(gl, width, height, gl.RGBA, gl.NEAREST, gl.UNSIGNED_BYTE);

    this.bottom.target();

    sand.write(scale);
};

/**
 * Render the background
 * @param {Quad} quad The quad renderer
 */
Background.prototype.render = function(quad) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.bottom.texture);

    quad.render();
};

/**
 * Free all resources maintained by the background
 */
Background.prototype.free = function() {
    this.bottom.free();
};