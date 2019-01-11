require('dotenv').config();
const pino = require('pino');
const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });
const db = require('../db');
const axios = require('axios');

async function getBusData(stopNumber, busNumber) {
  //Check if the bus system is actice
  let checkUrl = `https://api.winnipegtransit.com/v3/statuses/schedule.json?api-key=${process.env.TRANSIT_API_KEY}`;

  let systemData = await axios({
    method: 'get',
    url,
  }).catch((err) => {
    logger.error('There was an error looking up the status of the bus system');
  });

  logger.info(systemData);

  let url = `https://api.winnipegtransit.com/v3/stops/${stopNumber}.json?api-key=${process.env.TRANSIT_API_KEY}`;
  //Query all the bus data
  let busData = await axios({
    method: 'get',
    url,
  }).catch((err) => {
    logger.error(`There was an error looking up this ${stopNumber} stop number`, err);
  });

  return busData;
}

module.exports.getBusData = getBusData;
