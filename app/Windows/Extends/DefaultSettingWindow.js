const {BrowserWindow} = require ("electron");
const {windowsEnum} = require("../../Enum/PathLocationEnum")

class windowsDefault {
    constructor(config) {
        config = config ? config : {
            webPreferences: {
                show: true, // or true
                nodeIntegration: true,
                contextIsolation: false
            }
        }
        config.width = 1500
        config.height = 600
        this.win = new BrowserWindow(config)
        this.initWindows()
    }
    initWindows() {
        this.win.openDevTools();
        this.win.on('closed', function() {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            //this.win = null;
            //cameraView.close()
            //cameraView = null;
        });
    }
}

module.exports = windowsDefault;