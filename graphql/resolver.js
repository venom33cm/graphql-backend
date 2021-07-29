const userAuthResolver = require("./subResolver/userAuthResolver");
const eventResolver = require("./subResolver/eventResolver");
const bookingResolver = require("./subResolver/bookingResolver");

module.exports = {
  ...eventResolver,
  ...bookingResolver,
  ...userAuthResolver,
};
