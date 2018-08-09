let constants = require('config');
let populationConfig = require('setup.population');

const ROLE_HARVESTER = constants.ROLE_HARVESTER();
const ROLE_BUILDER = constants.ROLE_BUILDER();
const ROLE_UPGRADER = constants.ROLE_UPGRADER();
const ROLE_PATHFINDER = constants.ROLE_PATHFINDER();
const ROLE_REPAIRER = constants.ROLE_REPAIRER();

let populationProcessor = {
    run: function () {
        this.cleanDeadCreeps();
        this.managePopulation();
    },

    /**
     * CreepSpawner pre_alpha rev0 (09/08/2018)
     *
     * Objectives:
     * > 0) If there are no harvesters, spawn biggest harvester we can afford
     * > 1) If there is at least as many as the minimum of any given role of creep, spawn a new instance of
     *    whichever role's current count is closest to its minimum (as a percentage of population)
     *    (we value harvesters more when their population is low)
     *    An example to consider:
     *      // minimum harvester population to maintain
     *      let minHarvester = 3;
     *      // A zero result means we have the minimum number of harvesters required.
     *      // The result of this will be used along with current population and minimum count to rank
     *      // all roles in order of most important to spawn next.
     *      let distanceFromMinimum = livingHarvesters - minHarvesters;
     *
     *      let harvesterRank = role.priority - (distanceFromMinimum * livingHarvesters / minHarvesters)
     *
     *      // Highest priority wins!
     *
     *
     */
    managePopulation: function () {
        let name = undefined;
        let energyCapacity = Game.spawns.Spawn1.room.energyCapacityAvailable;
        let energyAvailable = Game.spawns.Spawn1.room.energyAvailable;


        let harvester = populationConfig.harvester;
        let builder = populationConfig.builder;
        let upgrader = populationConfig.upgrader;
        let pathfinder = populationConfig.pathfinder;
        let repairer = populationConfig.repairer;

        let minimumHarvesterCount = harvester.count;
        let minimumBuilderCount = builder.count;
        let minimumUpgraderCount = upgrader.count;
        let minimumPathFinderCount = pathfinder.count;
        let minimumRepairerCount = repairer.count;

        let livingHarvesters = this.getLivingCreepCount(ROLE_HARVESTER);
        let livingUpgraders = this.getLivingCreepCount(ROLE_UPGRADER);
        let livingBuilders = this.getLivingCreepCount(ROLE_BUILDER);
        let livingPathFinders = this.getLivingCreepCount(ROLE_PATHFINDER);
        let livingRepairers = this.getLivingCreepCount(ROLE_REPAIRER);

        let roleSpawned = undefined;
        if (livingHarvesters < minimumHarvesterCount) {
            roleSpawned = ROLE_HARVESTER;
            name = this.spawnCreep(roleSpawned, energyCapacity);
            if (name === ERR_NOT_ENOUGH_ENERGY && livingHarvesters === 0) {
                name = this.spawnCreep(roleSpawned, energyAvailable);
            }
        } else if (livingUpgraders < minimumUpgraderCount) {
            roleSpawned = ROLE_UPGRADER;
            name = this.spawnCreep(roleSpawned, energyCapacity);
        } else if (livingRepairers < minimumRepairerCount) {
            roleSpawned = ROLE_REPAIRER;
            name = this.spawnCreep(roleSpawned, energyCapacity);
        } else if (livingPathFinders < minimumPathFinderCount) {
            roleSpawned = ROLE_PATHFINDER;
            name = this.spawnCreep(roleSpawned, energyCapacity);
        } else if (livingBuilders < minimumBuilderCount) {
            roleSpawned = ROLE_BUILDER;
            name = this.spawnCreep(roleSpawned, energyCapacity);
        } else {
            // roleSpawned = ROLE_BUILDER;
            // name = this.spawnCreep(roleSpawned, energyCapacity);
        }
        if (constants.isShowPopulationEnabled()) {
            console.log(livingHarvesters, '/', minimumHarvesterCount, 'harvesters(', harvester.tiers.length - 1, ') |',
                livingUpgraders, '/', minimumUpgraderCount, 'upgraders(', upgrader.tiers.length - 1, ') |',
                livingRepairers, '/', minimumRepairerCount, 'repairers(', repairer.tiers.length - 1, ') |',
                livingPathFinders, '/', minimumPathFinderCount, 'pathfinders(', pathfinder.tiers.length - 1, ') |',
                livingBuilders, '/', minimumBuilderCount, 'builders(', builder.tiers.length - 1, ')');
        }
        if (constants.isShowResourcesEnabled()) {
            console.log(energyAvailable, '/', energyCapacity, 'energy')
        }

        if (!(name < 0)) {
            if (name === undefined) {
                if (constants.isDebugEnabled()) {
                    console.log('not spawning');
                }
            } else {
                if (constants.isShowPopulationEnabled()) {
                    console.log('spawning new', roleSpawned, ':', name);
                }
            }
        } else {
            switch (name) {
                case ERR_NOT_ENOUGH_ENERGY:
                    if (constants.isDebugEnabled()) {
                        console.log('not enough energy to spawn', roleSpawned);
                    }
                    break;
                case ERR_BUSY:
                    let spawning = Game.spawns.Spawn1.spawning;
                    if (constants.isDebugEnabled()) {
                        console.log('already', spawning === undefined ? 'busy' : 'spawning ' + spawning.name);
                    }
                    break;
            }
        }
    },

    cleanDeadCreeps: function () {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                if (constants.isDebugEnabled()) {
                    console.log("clearing old creeper:", name);
                }
            }
        }
    },

    getLivingCreepCount: function (role) {
        return _.sum(Game.creeps, (creep) => creep.memory.role === role);
    },

    spawnCreep: function (role, energy) {
        return Game.spawns.Spawn1.createCustomCreep(role, energy);
    }
};

module.exports = populationProcessor;