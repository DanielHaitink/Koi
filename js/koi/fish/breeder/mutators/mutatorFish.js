/**
 * A fish mutator that mutates a fish in place
 * @param {Fish} fish A fish
 * @constructor
 */
const MutatorFish = function(fish) {
    this.fish = fish;

    this.mutateBody = new MutatorFishBody(fish.body);
};

MutatorFish.prototype = Object.create(Mutator.prototype);
MutatorFish.prototype.SAMPLER_GROWTH_SPEED = new SamplerPlateau(-3, 0, 3, 1.5);
MutatorFish.prototype.SAMPLER_MATING_FREQUENCY = new SamplerPlateau(-5, 0, 5, .5);
MutatorFish.prototype.SAMPLER_OFFSPRING_COUNT = new SamplerPlateau(-15, 0, 15, 1);

/**
 * Mutate the fish
 * @param {Random} random A randomizer
 * @returns {Fish} The mutated fish
 */
MutatorFish.prototype.mutate = function(random) {
    this.mutateBody.mutate(random);

    this.fish.growthSpeed = this.mutateUint8(this.fish.growthSpeed, this.SAMPLER_GROWTH_SPEED, random);
    this.fish.matingFrequency = this.mutateUint8(this.fish.matingFrequency, this.SAMPLER_MATING_FREQUENCY, random);
    this.fish.offspringCount = this.mutateUint8(this.fish.offspringCount, this.SAMPLER_OFFSPRING_COUNT, random);

    return this.fish;
};