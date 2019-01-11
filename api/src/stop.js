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
    let url = `https://api.winnipegtransit.com/v3/stops/${stopNumber}/schedule.json?max-results-per-route=50&api-key=${
      process.env.TRANSIT_API_KEY
    }`;

    //Query all the bus data
    let busData = await axios({
      method: 'get',
      url,
    }).catch((err) => {
      logger.error(`There was an error looking up this ${stopNumber} stop number`, err);
    });
    // prettier-ignore
    return busData.data["stop-schedule"]["route-schedules"]
  } else {
    return `Bus System down with a status of ${systemStatus}`;
  }
}

/**
 * Checks if the bus trasit sysem is active
 * @returns If the system is active it will return 'regular' if it returns anything else the system is down
 */
async function checkSystem() {
  //Check if the bus system is actice
  let url = `https://api.winnipegtransit.com/v3/statuses/schedule.json?api-key=${process.env.TRANSIT_API_KEY}`;

  let systemData = await axios({
    method: 'get',
    url,
  }).catch((err) => {
    logger.error('There was an error looking up the status of the bus system', err);
  });

  return systemData.data.status.value;
}

module.exports.getBusData = getBusData;
