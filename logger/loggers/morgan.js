const chalk       = require("chalk");
const morgan      = require("morgan");
const currentTime = require("../../utils/timeService");
const config      = require("config");
const fs          = require('fs');

const morganLogger = morgan((tokens, req, res) => {
  const { year, month, day, hours, minutes, seconds } = currentTime();
  const currentDate = `[${year}/${month}/${day} ${hours}:${minutes}:${seconds}]`;

  if (tokens.status(req, res) >= 400){
    let content = [ currentDate, `(${config.get("NODE_ENV")})`, tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), "-", tokens["response-time"](req, res), "ms" ].join(" ");

    fs.writeFile(`./logs/${year}-${month}-${day}_${hours}-${minutes}-${seconds}.log`, content, err => {
      if (err) {
        console.error(err);
      }
    });

    return chalk.redBright(content);
  }

  return chalk.cyanBright(
    [
      currentDate,
      `(${config.get("NODE_ENV")})`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ")
  );
});

module.exports = morganLogger;