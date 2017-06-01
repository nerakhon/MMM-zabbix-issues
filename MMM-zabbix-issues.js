'use strict';

Module.register("MMM-zabbix-issues", {

    result: {},
    defaults: {
        title: 'ZABBIX',
        updateInterval: 600000,
        server: {
            url: '',
            user: '',
            password: ''
        }
    },

    getStyles: function() {
        return ["MMM-zabbix-issues.css"];
    },

    start: function() {
        this.getStats();
        this.scheduleUpdate();
    },

    isEmpty: function(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    },

    getDom: function() {
        var wrapper = document.createElement("ticker");
        wrapper.className = 'dimmed small';

        var data = this.result;
        var statElement =  document.createElement("header");
        var title = this.config.title;
        statElement.innerHTML = title;
        wrapper.appendChild(statElement);

        if (data) {
            var tableElement = document.createElement("table");

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    tableElement.appendChild(this.addValue(key, data[key].desc, data[key].severity));
                }
            }

            wrapper.appendChild(tableElement);
        } else {
            var error = document.createElement("span");
            error.innerHTML = "Error fetching stats.";
            wrapper.appendChild(error);
        }

        return wrapper;
    },

    addValue: function(name, value, severity) {
        var row = document.createElement("tr");
        var css_class = ''

        switch(severity) {
            case "0":
            case "1":
                css_class='information';
                break;
            case "2":
                css_class='warning';
                break;
            case "3":
                css_class='average';
                break;
            default:
                css_class='disaster';
                break;
        }
        row.innerHTML = "<td><span class='" + css_class + "'>" + name + ": " + JSON.stringify(value) + "</span></td>";
        return row;
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        setInterval(function() {
            self.getStats();
        }, nextLoad);
    },

    getStats: function () {
        this.sendSocketNotification('GET_STATS', this.config.server);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STATS_RESULT") {
            this.result = payload;
            var fade = 500;
            console.log("fade: " + fade);
            this.updateDom(fade);
        }
    },

});
