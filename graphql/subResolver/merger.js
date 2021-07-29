const Event = require("../../modals/event");
const User = require("../../modals/user");
const { transdate } = require("../utils/utils");
const DataLoader = require("dataLoader");

const eventloader = new DataLoader((eventIds) => {
  return allevents(eventIds);
});

const userloader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const allevents = async (eventIds) => {
  try {
    const results = await Event.find({ _id: { $in: eventIds } });
    results.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    // console.log(results, eventIds);
    return results.map((result) => {
      return transEvent(result);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  const result = await eventloader.load(eventId.toString());
  return result;
};

const userSearch = async (userId) => {
  try {
    const result = await userloader.load(userId.toString());

    return {
      ...result._doc,
      _id: result.id,
      password: null,
      createdEvents: () => eventloader.loadMany(result._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const transEvent = (result) => {
  return {
    ...result._doc,
    _id: result.id,
    date: transdate(result._doc.date),
    creator: userSearch.bind(this, result._doc.creator),
  };
};

const transBooking = (booked) => {
  return {
    ...booked._doc,
    _id: booked.id,
    user: userSearch.bind(this, booked._doc.user),
    event: singleEvent.bind(this, booked._doc.event),
    createdAt: transdate(booked._doc.createdAt),
    updatedAt: transdate(booked._doc.updatedAt),
  };
};

exports.transEvent = transEvent;
exports.transBooking = transBooking;
