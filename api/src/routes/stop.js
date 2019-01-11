const express = require('express');
const router = express.Router();
const stop = require('../stop');
const pino = require('pino');
const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });

router.get('/:stopNumber/:busNumber', async (req, res, next) => {
  let stopData = await stop.getBusData(req.params.stopNumber, req.params.busNumber);
  res.send(stopData);
});

module.exports = router;
