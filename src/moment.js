const moment = require("moment");
require("moment-timezone");
require("moment/locale/ko");

moment.tz.setDefault("Asia/Seoul");

module.exports = moment;
