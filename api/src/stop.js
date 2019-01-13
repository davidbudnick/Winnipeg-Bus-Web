require('dotenv').config();
const pino = require('pino');
const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });
const db = require('../db');
const axios = require('axios');
const timediff = require('timediff');
const dateTime = require('date-time');
const isEmpty = require('is-empty');

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

    //Takes the parsed bus data and get time diff and more information
    let information = await convertInformation(parsedBusData);

    return information;
  } else {
    return `Bus System down with a status of ${systemStatus}`;
  }
}

/**
 *
 * @param {All Bus Data from requested bus} busData
 * @returns {JSON data of bus information}
 */
function convertInformation(parsedBusData) {
  //Stores bus infromation
  let busInformation = [];

  //Checks if the parsed bus data is empty
  if (isEmpty(parsedBusData)) {
    //Sends message to the user is there are not buses
    busInformation.push('NO BUSES AVAILABLE');
  } else {
    //Loops though the scheduled stops
    for (let bus of parsedBusData[0]['scheduled-stops']) {
      //Arriaval Time of bus
      let arrivalTime = bus.times.arrival.estimated;

      //Departue Time of bus
      let departureTime = bus.times.arrival.scheduled;

      //Checks if the buses are [OK, EARLY, LATE]
      let timeDiff = timediff(arrivalTime, departureTime);

      //Status of busses
      let status;

      //Checks for ontime
      if (timeDiff.minutes === 0) {
        status = 'OK';

        //Checks for late
      } else if (timeDiff.minutes < 0) {
        status = 'LATE';

        //Checks for early
      } else if (timeDiff.minutes > 0) {
        status = 'EARLY';
      }

      //Checks current time compared to departure time for time till bus comes
      let time = timediff(dateTime(), departureTime);

      //Formatted time with seconds
      let formattedTime;

      //Checks if the time is less than 10 and adds a 0
      if (time.seconds < 10 && time.seconds > 0) {
        formattedTime = `${time.minutes}:0${time.seconds}`;
      } else if (time.seconds < 10 && time.seconds < 0) {
        formattedTime = `${time.minutes.substr(1)}:0${time.seconds.substr(1)}`;
      } else if (time.seconds < 0) {
        formattedTime = `${time.minutes.substr(1)}:0${time.seconds.substr(1)}`;
      } else {
        formattedTime = `${time.minutes}:${time.seconds}`;
      }

      //Created JSON object that send back information about the bus
      let data = {
        routeNumber: parsedBusData[0]['route']['number'],
        name: parsedBusData[0]['route']['name'],
        status: status,
        time: formattedTime,
      };

      //Pushes the JSON object to the busInformation
      busInformation.push(data);
    }
  }

  //Returns the collection of bus time and information back
  return busInformation;
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
