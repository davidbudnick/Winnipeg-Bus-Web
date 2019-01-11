const express = require('express');
const router = express.Router();
const backups = require('../stop');
const pino = require('pino');
const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });

async function getBusData(routeNumber, busNumber) {}
