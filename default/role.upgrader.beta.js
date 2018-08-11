const constants = require('config');
const baseRole = require('role.base');

// this one is the technician
let roleUpgrader = {
    role: 'upgrader.beta',

    /** @param {Creep} creep **/
    performAction: function (creep) {
        if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
        }
        const controller = creep.room.controller;
        if (creep.memory.upgrading) {
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, constants.PATH_STYLE_TO_WORK());
            } else {
                if (constants.isShowRolesEnabled()) {
                    creep.say('U');
                }
            }
        } else {
            //find link closest to controller and extract energy from it
            let closestLink = controller.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (s) => s.structureType === STRUCTURE_LINK
            });
            if (closestLink !== undefined) {
                closestLink = closestLink[0];
            }
            // if (creep.harvest(closestLink) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestLink);
            // }
        }
    }
};

module.exports = roleUpgrader;