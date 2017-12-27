# Heroku Uptime Control app

This app executes on a local node.js server and is configured to ping various Heroku apps on choosen intervals, wakeUp and sleep times. You can set one day for different settings too.

The app is executed as windows script on silent mode, only notifies on errors and generate logs.

## Instructions

- Define your variables in // App Config
- Add a shortcut to the HerokuControlApp.vbs on your `%AppData%\Microsoft\Windows\Start Menu\Programs\Startup\`
