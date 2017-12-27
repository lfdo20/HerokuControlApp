
const http = require('http'); //importing http
const notifier = require('node-notifier'); // importing notify
const winston = require('winston'); // logging to file
const moment = require('moment'); // date

// App config
const configApps = {
  'bot':{
    appName: "whispering-escarpment-46164.herokuapp.com",
    frequency: 1000*60*28, // load every 28 minutes
    wakeTime: '5:30', // 24h format
    sleepTime: '3:00',
    day: 'Wed', // Camel Case please : Wed, Mon, Fri
    wakeDayTime: '05:30',
    sleepDayTime: '01:00'
  }
}



// Logger Config
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-log',
      filename: 'HerokuWakeControl-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-log',
      filename: 'HerokuWakeControl-error.log',
      level: 'error'
    })
  ]
});

// Notify Config
const notifyConf ={
  'title': 'Heroku Wake Control',
  'message': 'Ping Error: please, see log.',
  'sound': true
};

// Moment config
var nowTime = moment().format('HH:mm');
var nowDay = moment().format('ddd');

function appSelector(configApps){
  console.log(configApps);
  for (let key in configApps) {
    if (!configApps.hasOwnProperty(key)) continue;
  let pingConf = {
    appName: configApps[key].appName,
    frequency: configApps[key].frequency,
    wakeTime: new moment(configApps[key].wakeTime, 'HHmm').format('HH:mm'),
    sleepTime: new moment(configApps[key].sleepTime, 'HHmm').format('HH:mm'),
    day: configApps[key].day,
    wakeDayTime: new moment(configApps[key].wakeDayTime, 'HHmm').format('HH:mm'),
    sleepDayTime: new moment(configApps[key].sleepDayTime, 'HHmm').format('HH:mm')
  };
  //var wakeTime = new moment(pingConf.wakeTime, 'HHmm').format('HH:mm')
  //var sleepTime = new moment(pingConf.sleepTime, 'HHmm').format('HH:mm');
  //console.log(pingConf);
  startKeepAlive(pingConf);
  }
}

function startKeepAlive(pingConfig) {
  //console.log('ok');
  if (moment().format('ddd')==='Wed') {
    var sleepTime = moment(pingConfig.sleepDayTime, 'HH:mm').format('HH:mm');
    var wakeTime = moment(pingConfig.wakeDayTime, 'HH:mm').format('HH:mm');
  }
  if (moment().isBetween(wakeTime, sleepTime, 'hour', '[]')) {
    setInterval(function() {
        var options = {
            host: pingConfig.appName,
            port: 80,
            path: '/'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    // optional logging... disable after it's working
                    console.log("HEROKU RESPONSE: " + chunk);
                    logger.info("HEROKU RESPONSE: " + chunk);
                } catch (err) {
                    //console.log(err.message);
                    logger.error(err.message);
                    notifier.notify(notifyConf);
                }
            });
        }).on('error', function(err) {
            //console.log("Error: " + err.message);
            logger.error("Error: " + err.message);
            notifier.notify(notifyConf);
        });
    }, pingConfig.frequency);
  }
}

appSelector(configApps);
