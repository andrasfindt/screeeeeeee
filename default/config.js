const DEBUG = false;
const SHOW_POPULATION = true;
const SHOW_RESOURCES = true;
const SHOW_ROLES = true;

const HARVESTER = 'harvester';
const BUILDER = 'builder';
const UPGRADER = 'upgrader';
const PATHFINDER = 'pathfinder';
const REPAIRER = 'repairer';

const COLOR_STROKE_WORK = '#ffffff';
const COLOR_STROKE_COLLECT = '#ffaa00';

const config = {
    isDebugEnabled: function () {
        return DEBUG;
    },
    isShowPopulationEnabled: function () {
        return SHOW_POPULATION;
    },
    isShowResourcesEnabled: function () {
        return SHOW_RESOURCES;
    },
    isShowRolesEnabled: function () {
        return SHOW_ROLES;
    },
    /**
     * @return {string}
     */
    ROLE_BUILDER: function () {
        return BUILDER;
    },
    /**
     * @return {string}
     */
    ROLE_UPGRADER: function () {
        return UPGRADER;
    },
    /**
     * @return {string}
     */
    ROLE_HARVESTER: function () {
        return HARVESTER;
    },
    /**
     * @return {string}
     */
    ROLE_PATHFINDER: function () {
        return PATHFINDER;
    },
    /**
     * @return {string}
     */
    ROLE_REPAIRER: function () {
        return REPAIRER;
    },
    PATH_STYLE_TO_COLLECT: function () {
        return {visualizePathStyle: {stroke: COLOR_STROKE_COLLECT}};
    },
    PATH_STYLE_TO_WORK: function () {
        return {visualizePathStyle: {stroke: COLOR_STROKE_WORK}};
    }
};
module.exports = config;