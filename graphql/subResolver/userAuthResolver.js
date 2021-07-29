const User = require("../../modals/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (args) => {
    try {
      const users = await User.findOne({ email: args.userInput.email });
      if (users) {
        throw new Error("user already exists");
      }
      const hashedpass = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedpass,
      });
      const res = await user.save();
      return {
        ...res._doc,
        _id: res.id,
        password: null,
      };
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("user is not registered");
    }
    const verifying = await bcrypt.compare(password, user.password);
    if (!verifying) {
      throw new Error("pass/email is wrong");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.Secret_string,
      {
        expiresIn: "1h",
      }
    );
    return { userId: user.id, token: token, tokenExpiry: 1 };
  },
};
