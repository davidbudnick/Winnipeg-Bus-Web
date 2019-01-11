require('dotenv').config();
const pino = require('pino');
const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });
const db = require('../db');
const axios = require('axios');

/**
 *
 * @param {Stop Number} stopNumber
 * @param {Bus Number} busNumber
 * @returns {Query of all the bus data from the specifc bus number}
 */
async function getBusData(stopNumber, busNumber) {
  //Check for information about the transit system
  let systemStatus = await checkSystem();

  //checks if the transit system is "regular" or online
  if (systemStatus === 'regular') {
    let url = `https://api.winnipegtransit.com/v3/stops/${stopNumber}/schedule.json?max-results-per-route=1000&api-key=${
      process.env.TRANSIT_API_KEY
    }`;

    //Query all the bus data
    let busData = await axios({
      method: 'get',
      url,
    }).catch((err) => {
      logger.error(`There was an error looking up this ${stopNumber} stop number`, err);
    });

    //Parse the buses with the specifc bus number out of the list of curretn buses
    let parsedBusData = await parseBus(busNumber, busData);

    return parsedBusData;
  } else {
    return `Bus System down with a status of ${systemStatus}`;
  }
}

function convertInformation(busData) {
  let busInformation = [];
}

/**
 * @param {Bus Number} busNumber
 * Parses out the bus number from the list of json
 */
async function parseBus(busNumber, busData) {
  //Parsed bus data is uses for only buses you want
  let parsedBusData = [];

  // loops though the list of all the buses
  for (let bus of busData.data['stop-schedule']['route-schedules']) {
    //checks if the bus number is the same as the picked bus number
    if (bus.route.number === parseInt(busNumber)) {
      //pushes the picked bus to the list of parsed bus results
      parsedBusData.push(bus);
    }
  }

  //Returns all parsed buses from busData
  return parsedBusData;
}

/**
 * Checks if the bus trasit sysem is active
 * @returns If the system is active it will return 'regular' if it returns anything else the system is down
 */
async function checkSystem() {
  //Check if the bus system is actice
  let url = `https://api.winnipegtransit.com/v3/statuses/schedule.json?api-key=${process.env.TRANSIT_API_KEY}`;

  //Queries the trasit api from system informtaion
  let systemData = await axios({
    method: 'get',
    url,
  }).catch((err) => {
    logger.error('There was an error looking up the status of the bus system', err);
  });

  //Returns status of bus system
  return systemData.data.status.value;
}

module.exports.getBusData = getBusData;
