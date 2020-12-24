/**
 * A bug spawner
 * @param {Constellation} constellation The constellation
 * @constructor
 */
const BugSpawner = function(constellation) {
    this.maxBugs = Math.ceil(constellation.width * constellation.height / this.MAX_AREA_PER_BUG);
    this.countdown = this.SPAWN_FREQUENCY;
};

BugSpawner.prototype.MAX_AREA_PER_BUG = 12;
BugSpawner.prototype.SPAWN_FREQUENCY = 30;
BugSpawner.prototype.LOST_RAIN_BUG_CHANCE = .12;
BugSpawner.prototype.MAX_BUGS_MULTIPLIER = {
    [WeatherState.prototype.ID_SUNNY]: 1,
    [WeatherState.prototype.ID_OVERCAST]: .7,
    [WeatherState.prototype.ID_DRIZZLE]: .2,
    [WeatherState.prototype.ID_RAIN]: .1,
    [WeatherState.prototype.ID_THUNDERSTORM]: .1
};
BugSpawner.prototype.SPAWN_CHANCE = {
    [WeatherState.prototype.ID_SUNNY]: .8,
    [WeatherState.prototype.ID_OVERCAST]: .5,
    [WeatherState.prototype.ID_DRIZZLE]: .2,
    [WeatherState.prototype.ID_RAIN]: .1,
    [WeatherState.prototype.ID_THUNDERSTORM]: .05
};

/**
 * Create a bug body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {WeatherState} weatherState The current weather state
 * @param {Random} random A randomizer
 * @returns {BugBody} A bug body, or null if no body could be made
 */
BugSpawner.prototype.makeBody = function(gl, weatherState, random) {
    switch (weatherState.state) {
        case weatherState.ID_SUNNY:
            return new BugBodyButterflySunny(gl);
        case weatherState.ID_OVERCAST:
            if (random.getFloat() < this.LOST_RAIN_BUG_CHANCE)
                return new BugBodyButterflyRainy(gl);
            else
                return new BugBodyButterflySunny(gl);
        case weatherState.ID_DRIZZLE:
            return new BugBodyButterflyRainy(gl);
        case weatherState.ID_THUNDERSTORM:
            return new BugBodyButterflyThunder(gl);
    }

    return null;
};

/**
 * Spawn a bug body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {WeatherState} weatherState The current weather state
 * @param {BugPathMaker} pathMaker The bug path maker
 * @param {Number} bugCount The number of bugs in view
 * @param {Random} random A randomizer
 * @returns {Bug} A bug that should be spawned, or null if no bug should be spawned
 */
BugSpawner.prototype.update = function(
    gl,
    weatherState,
    pathMaker,
    bugCount,
    random) {
    if (--this.countdown === 0) {
        this.countdown = this.SPAWN_FREQUENCY;

        if (bugCount >= Math.ceil(this.maxBugs * this.MAX_BUGS_MULTIPLIER[weatherState.state]) ||
            random.getFloat() > this.SPAWN_CHANCE[weatherState.state])
            return null;

        const path = pathMaker.makeEntrance(random);

        if (path) {
            const body = this.makeBody(gl, weatherState, random);

            if (body)
                return new Bug(body, path);
            else
                pathMaker.recycle(path);
        }
    }

    return null;
};