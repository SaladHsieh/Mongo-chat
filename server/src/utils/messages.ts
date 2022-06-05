const moment = require('moment');

function formatMessage(username: string, text: string): any {
  return {
    username,
    text,
    time: moment().utcOffset(8).format('hh:mm a'),
  };
}

module.exports = formatMessage;
