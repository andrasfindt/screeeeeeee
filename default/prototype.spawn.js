module.exports = function () {
    StructureSpawn.prototype.createCustomCreep = function (role, energy) {
        let populationConfig = require('setup.population');
        let config = require('config');
        let tierToSpawn = populationConfig.getTierToSpawn(role, energy);

        if (tierToSpawn !== null) {
            if (config.isDebugEnabled()) {
                console.log(tierToSpawn.body, tierToSpawn.cost);
            }
            return this.createCreep(tierToSpawn.body, undefined, {role: role});
        } else {
            return ERR_NOT_ENOUGH_ENERGY;
        }
    };
    StructureSpawn.prototype.sayEnergy = function () {

    }
};