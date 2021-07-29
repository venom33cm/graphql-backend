const Event = require("../../modals/event");
const Booking = require("../../modals/booking");
const { transEvent, transBooking } = require("./merger");

module.exports = {
  BookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("unAuthenticated ");
    }
    const eventSelect = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      event: eventSelect,
      user: req.userId, //"60fc22744d65ba193c8e927c"
    });
    const booked = await booking.save();
    return transBooking(booked);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("unAuthenticated ");
    }
    const booked = await Booking.findById(args.bookedId).populate("event");
    let deletedEvent = transEvent(booked.event);
    await Booking.deleteOne({ _id: args.bookedId });
    return deletedEvent;
  },
  getBookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("unAuthenticated ");
    }
    try {
      const results = await Booking.find({ user: req.userId });
      return results.map((result) => {
        return transBooking(result);
      });
    } catch (err) {
      throw err;
    }
  },
};
