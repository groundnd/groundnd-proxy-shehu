require('newrelic');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const redis = require("redis");
const axios = require('axios');
const { promisify } = require('util');

const getRedisAsync = promisify(client.get).bind(client);
const setRedisAsync = promisify(client.setex).bind(client);
const app = express();
const port = process.env.PORT || 3000;
const loadBalancerIP = process.env.LOADBALANCEIP || '18.144.55.17';
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || localhost;
const client = redis.createClient(redisPort, redisHost);

// app.use(morgan('dev'));

app.get('/', (req, res) => res.redirect(`/${Math.floor(Math.random()* 100)}`));

app.use('/:roomid', express.static(path.join(__dirname, '../public')));

app.get('/photosandcomments/:accommodationid', (req, res) => {
  axios.get(`http://localhost:3001/photosandcomments/${req.params.accommodationid}`)
    .then(response => {
      res.send(response.data);
    });
});

app.get('/bookings/:accommodationid', (req, res) => {
  
  return getRedisAsync(`${req.params.accommodationid}-accommodation`)
  .then(async (result) => {
    if (result) {
      res.send(result);
    } else {
      axios.get(`http://${loadBalancerIP}/bookings/${req.params.accommodationid}`)
        .then(response => {
          res.send(response.data);
        });
        setRedisAsync(`${req.params.accommodationid}-accommodation`, 3600, response.data)
    }
  })
});

app.get('/bookings/:accommodationid/:startDate&:endDate', (req, res) => {
  return getRedisAsync(`${req.params.accommodationid}-reservations`)
  .then(async (result) => {
    if (result) {
      res.send(result);
    } else {
      axios.get(`http://${loadBalancerIP}/bookings/${req.params.accommodationid}/${req.params.startDate}&${req.params.endDate}`)
        .then(response => {
          res.send(response.data);
        });
        setRedisAsync(`${req.params.accommodationid}-reservations`, 3600, response.data)
    }
  })
});

app.get('/abodes/:abode_id/reviews', (req, res) => {
  axios.get(`http://localhost:3002/abodes/${req.params.abode_id}/reviews`)
    .then(response => {
      res.send(response.data);
    });
});

app.get('/homes', (req, res) => {
  axios.get(`http://localhost:3004/homes`)
    .then(response => {
      res.send(response.data);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

client.on('connect', function() {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});