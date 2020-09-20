/**
 * Mutate a stripes layer in place
 * @param {LayerStripes} layer The stripes layer
 * @constructor
 */
const MutatorLayerStripes = function(layer) {
    this.layer = layer;
};

MutatorLayerStripes.prototype = Object.create(Mutator.prototype);
MutatorLayerStripes.prototype.SAMPLER_ANCHOR_DISTANCE = new SamplerPower(0, 4, 5);
MutatorLayerStripes.prototype.SAMPLER_X_DISTANCE = new SamplerPower(0, .6, 4);
MutatorLayerStripes.prototype.SAMPLER_SCALE = new SamplerPlateau(-8, 0, 8, 1);
MutatorLayerStripes.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(-6, 0, 6, 1.4);
MutatorLayerStripes.prototype.SAMPLER_SLANT = new SamplerPlateau(-4, 0, 4, 2);
MutatorLayerStripes.prototype.SAMPLER_ROUGHNESS = new SamplerPlateau(-7, 0, 7, 1.5);
MutatorLayerStripes.prototype.SAMPLER_DISTORTION = new SamplerPlateau(-6, 0, 6, 1);
MutatorLayerStripes.prototype.SAMPLER_SUPPRESSION = new SamplerPlateau(-9, 0, 9, 2);
MutatorLayerStripes.prototype.SAMPLER_FOCUS = new SamplerPlateau(-5, 0, 5, 3);
MutatorLayerStripes.prototype.SAMPLER_POWER = new SamplerPlateau(-5, 0, 5, 2.7);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerStripes.prototype.mutate = function(random) {
    this.mutateVector3(this.layer.plane.anchor, this.SAMPLER_ANCHOR_DISTANCE, random);
    this.mutateNormalVector3(this.layer.plane.x, this.SAMPLER_X_DISTANCE, random);

    this.layer.plane.clampAnchor();

    this.layer.scale = this.mutateUint8(this.layer.scale, this.SAMPLER_SCALE, random.getFloat());
    this.layer.threshold = this.mutateUint8(this.layer.threshold, this.SAMPLER_THRESHOLD, random.getFloat());
    this.layer.slant = this.mutateUint8(this.layer.slant, this.SAMPLER_SLANT, random.getFloat());
    this.layer.roughness = this.mutateUint8(this.layer.roughness, this.SAMPLER_ROUGHNESS, random.getFloat());
    this.layer.distortion = this.mutateUint8(this.layer.distortion, this.SAMPLER_DISTORTION, random.getFloat());
    this.layer.suppression = this.mutateUint8(this.layer.suppression, this.SAMPLER_SUPPRESSION, random.getFloat());
    this.layer.focus = this.mutateUint8(this.layer.focus, this.SAMPLER_FOCUS, random.getFloat());
    this.layer.power = this.mutateUint8(this.layer.power, this.SAMPLER_POWER, random.getFloat());
};