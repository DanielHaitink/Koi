/**
 * The fish pattern atlas, containing all fish patterns
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Patterns} patterns A pattern renderer
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 * @constructor
 */
const Atlas = function(gl, patterns, capacity) {
    this.gl = gl;
    this.patterns = patterns;
    this.capacity = 0;
    this.width = 0;
    this.height = 0;
    this.slotSize = new Vector2();
    this.pixelSize = new Vector2();
    this.available = null;
    this.framebuffer = gl.createFramebuffer();
    this.texture = this.createTexture(capacity);
};

Atlas.prototype.RESOLUTION = 48;
Atlas.prototype.RATIO = 4;

/**
 * Find the nearest power of 2 which is bigger than or equal to a number
 * @param {Number} number A number
 * @returns {Number} The biggest power of 2 larger than that number
 */
Atlas.prototype.nearestPow2 = function(number) {
    let n = 1;

    while (n < number)
        n <<= 1;

    return n;
};

/**
 * Create all texture slots on the atlas
 * @param {Number} blockResolution The square root of the number of slot blocks on this atlas
 * @returns {Vector2[]} The positions of all available texture slots
 */
Atlas.prototype.createSlots = function(blockResolution) {
    const available = [];

    for (let y = 0; y < blockResolution; ++y) for (let x = 0; x < blockResolution; ++x)
        for (let row = 0; row < this.RATIO; ++row)
            available.push(new Vector2(
                (x * this.RATIO * this.RESOLUTION) / this.width,
                ((y * this.RATIO + row) * this.RESOLUTION) / this.height))

    return available;
};

/**
 * Create the atlas texture
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 */
Atlas.prototype.createTexture = function(capacity) {
    const texture = this.gl.createTexture();
    const blocks = Math.ceil(capacity / this.RATIO);
    const blockResolution = Math.ceil(Math.sqrt(blocks));

    this.width = this.height = this.nearestPow2(blockResolution * this.RESOLUTION * this.RATIO);
    this.pixelSize.x = 1 / this.width;
    this.pixelSize.y = 1 / this.height;
    this.slotSize.x = this.RESOLUTION * this.RATIO * this.pixelSize.x;
    this.slotSize.y = this.RESOLUTION * this.pixelSize.y;
    this.available = this.createSlots(blockResolution);
    this.capacity = this.available.length;

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.width,
        this.height,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        null);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);

    return texture;
};

/**
 * Get an atlas slot to write to
 * @returns {Vector2} The origin of the atlas slot
 */
Atlas.prototype.getSlot = function() {
    return this.available.pop();
};

/**
 * Return an atlas slot that is no longer being used
 * @param {Vector2} slot The origin of the atlas slot
 */
Atlas.prototype.returnSlot = function(slot) {
    this.available.unshift(slot);
};

/**
 * Write a texture to the atlas
 * @param {Pattern} pattern The pattern to write to the atlas
 */
Atlas.prototype.write = function(pattern) {
    pattern.slot = this.getSlot();
    pattern.size = this.slotSize;

    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

    this.patterns.write(pattern);
};

/**
 * Free all resources maintained by the atlas
 */
Atlas.prototype.free = function() {
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteTexture(this.texture);
};