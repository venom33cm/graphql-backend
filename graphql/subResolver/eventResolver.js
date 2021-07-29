const Event = require("../../modals/event");
const User = require("../../modals/user");
const { transEvent } = require("./merger");

module.exports = {
  getEvent: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("unAuthenticated ");
    }
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date,
        creator: req.userId, //"60fc22744d65ba193c8e927c"
      });
      let createdEvent;
      const result = await event.save();
      createdEvent = transEvent(result);
      const user = await User.findById(req.userId);

      if (!user) {
        throw new Error("user doesnt exist");
      }
      user.createdEvents.push(event);
      await user.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
};
