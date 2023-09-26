const config = require("config");
const User = require("./mongodb/User");
const lodash = require("lodash");
const { comparePassword } = require("../helpers/bcrypt");
const { generateAuthToken } = require("../../auth/providers/jwt");
const { handleBadRequest } = require("../../utils/handleErrors");

const DB = config.get("DB") || "MONGODB";

const registerUser = async (normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      const { email } = normalizedUser;
      let user = await User.findOne({ email });

      if (user){
        throw new Error("User is already registered");
      }

      user = new User(normalizedUser);
      user = await user.save();

      user = lodash.pick(user, ["name", "email", "_id"]);

      return Promise.resolve(user);
    }
    catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }

  return Promise.resolve("Database error");
};

const loginUser = async ({ email, password }) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findOne({ email });

      if (!user){
        throw new Error("Authentication Error: Invalid email or password");
      }

      const validPassword = comparePassword(password, user.password);

      if (!validPassword){
        throw new Error("Authentication Error: Invalid email or password");
      }

      const token = generateAuthToken(user);

      return Promise.resolve(token);
    }
    catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }

  return Promise.resolve("Database error");
};

const getUsers = async () => {
  if (DB === "MONGODB") {
    try {
      const users = await User.find({}, { password: 0, __v: 0 });

      return Promise.resolve(users);
    }
    catch (error) {
      error.status = 404;
      return Promise.reject(error);
    }
  }

  return Promise.resolve("Database error");
};

const getUser = async (userId) => {
  if (DB === "MONGODB") {
    try {
      let user = await User.findById(userId, {password: 0, __v: 0});

      if (!user){
        throw new Error("User not found");
      }

      return Promise.resolve(user);
    }
    catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("Database error");
};

const getUserByEmail = async (emailAddress) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findOne({ email: emailAddress });

      if (!user){
        throw new Error("User not found");
      }

      return Promise.resolve(user);
    }
    catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }

  return Promise.resolve("Database error");
};

const updateUser = async (userId, normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      let user = await User.findByIdAndUpdate(userId, normalizedUser, {new: true});

      if (!user){
        throw new Error("User not found");
      }

      return Promise.resolve(user);
    }
    catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }

  return Promise.resolve("Database error");
};

const changeUserBusinessStatus = async (userId) => {
  if (DB === "MONGODB") {
    try {
      let user = await User.findById(userId);

      if (!user){
        throw new Error("User not found");
      }

      user.isBusiness ^= true;

      user = await user.save();
      return Promise.resolve(user);
    }
    catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }

  return Promise.resolve("Database error");
};

const deleteUser = async (userId) => {
  if (DB === "MONGODB") {
    try {
      let user = await User.findById(userId);

      if (!user){
        throw new Error("User not found");
      }

      user = await User.findByIdAndDelete(user._id);

      return Promise.resolve(user);
    }
    catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }

  return Promise.resolve("Database error");
};

exports.registerUser             = registerUser;
exports.loginUser                = loginUser;
exports.getUsers                 = getUsers;
exports.getUser                  = getUser;
exports.updateUser               = updateUser;
exports.changeUserBusinessStatus = changeUserBusinessStatus;
exports.deleteUser               = deleteUser;
exports.getUserByEmail           = getUserByEmail;