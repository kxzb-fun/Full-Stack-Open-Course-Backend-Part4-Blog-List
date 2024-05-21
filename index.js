/**
 * The contents of the index.js file used for starting the application gets simplified as follows:
 */

const app = require("./app.js"); // the actual Express application

const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running at http://localhost:${config.PORT}`);
});
