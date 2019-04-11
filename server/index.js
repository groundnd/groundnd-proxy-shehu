const express = require('express');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.get('/', (req, res) => res.redirect(`/bookings/${Math.floor(Math.random()* 100)}`));

app.use('/bookings/:roomid', express.static(path.join(__dirname, '../public')));

app.get('/photosandcomments/:accommodationid', (req, res) => {
  axios.get(`http://localhost:3001/photosandcomments/${req.params.accommodationid}`)
    .then(response => {
      res.send(response.data);
    });
});

app.get('/bookings/:accommodationid/reserve', (req, res) => {
  axios.get(`http://localhost:3003/bookings/${req.params.accommodationid}/reserve`)
    .then(response => {
      res.send(response.data);
    });
});

app.get('/bookings/:accommodationid/reserve/:startDate&:endDate', (req, res) => {
  axios.get(`http://localhost:3003/bookings/${req.params.accommodationid}/reserve/${req.params.startDate}&${req.params.endDate}`)
    .then(response => {
      res.send(response.data);
    });
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