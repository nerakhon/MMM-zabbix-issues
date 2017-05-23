var NodeHelper = require('node_helper');
var zabbix = require("nodebix");

module.exports = NodeHelper.create({
  start: function () {
    console.log('mmm-zabbix-issues helper started...');
  },

  getStats: function (server) {
      var self = this;
      var client = new zabbix(server.url + "/api_jsonrpc.php",server.user,server.password);
      var response = {};

      client.login()
          .then((result) => {
              console.log(result);
              return client.call("trigger.get", {
                  output: "extend",
                  selectHosts: "extend",
                  selectLastEvent: "extend",
                  sortfield: "lastchange",
                  monitored: true,
                  only_true: true,
                  maintenance: false,
                  limit: false
              });
          })
          .then((result) => {
              result.result.forEach(function(entry) {
                  hostname = ""
                  entry.hosts.forEach(function(entry) {
                      hostname = entry.name;
                  })
                  response[hostname] = { desc:entry.description, severity:entry.priority };
              })
              return client.logout();
          })
          .then((result) => {
              self.sendSocketNotification('STATS_RESULT', response);
              console.log(result);
          })
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_STATS') {
      this.getStats(payload);
    }
  }

});
