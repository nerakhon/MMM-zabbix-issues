# MMM-zabbix-issues
A MagicMirror module that displays current problems present on zabbix

This code is based on MMM-json-feed module: https://github.com/amcolash/MMM-json-feed 



## Configuration
It is very simple to set up this module, a sample configuration looks like this:

```
modules: [
  {
    module: 'MMM-zabbix-isues',
    position: 'bottom_bar',
    config: {
        server: {
            url: 'http://your.server.here',
            user: 'admin',
            password: 'password'
    }
  }
]
```

## Configuration Options

| Option               | Description
| -------------------- | -----------
| `title`              | Title to display at the top of the module. <br><br> **Default value:** `ZABBIX`
| `server`             | Address and credentials to Zabbix server. <br><br> **Default value:** `REQUIRED`
| `updateInterval`     | The time between updates (In milliseconds). / <br><br> **Default value:** `300000 (5 minutes)`
