const { handleError } = require("../utils/handleErrors");
const { verifyToken } = require("./providers/jwt");
const config = require("config");

const tokenGenerator = config.get("TOKEN_GENERATOR");

const auth = (req, res, next) => {
  if (tokenGenerator === "jwt") {
    try {
      const tokenFromClient = req.header("x-auth-token");

      if (!tokenFromClient){
        throw new Error("Authentication Error: Please Login");
      }

      const userInfo = verifyToken(tokenFromClient);
      if (!userInfo) throw new Error("Authentication Error: Could not verify token");

      req.user = userInfo;

      return next();
    }
    catch (error) {
      return handleError(res, 401, error.message);
    }
  }

  return handleError(res, 500, "Configuration error.");
};

module.exports = auth;