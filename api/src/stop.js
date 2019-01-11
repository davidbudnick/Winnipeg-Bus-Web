require('dotenv').config();
const pino = require('pino');
const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });
const db = require('../db');
const axios = require('axios');

async function getBusData(routeNumber, busNumber) {
  //Query all the bus data
  let busData = await axios({
    method: 'get',
    url,
  }).catch((err) => {
    logger.error('There was an error finding the products in shopify', err);
  });
}
