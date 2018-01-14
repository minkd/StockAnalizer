const Quandl = require('./Quandl');


let quandl;
exports.init = function(settings){
    const qSettings = settings.Quandl;
    quandl = new Quandl(qSettings.api_endpoint, qSettings.auth_token, qSettings.api_version);
};

exports.Quandl = {
  getConnection: function(){
      if (quandl) {
          return quandl;
      } else {
          throw Error('No active Quandl connections available')
      }
  }
};



