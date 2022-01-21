var windowsDefault = require('./Extends/DefaultSettingWindow')
const fs = require("fs");

const { app, BrowserWindow, protocol, ipcMain} = require("electron");
const path = require("path");

class CaptureImageWindow extends windowsDefault{
    constructor() {
        super({width: 800, height: 600,
            show: false, // or true
            webPreferences: {
                nodeIntegration: true}})
        this.view = path.join(process.cwd(), 'resources', 'views', 'capture-image', 'capture-image.html')
        //this.win.loadURL(windowsEnum.view["capture-image"]);
        this.eventClickButton()
    }


    eventClickButton( ) {
        this.capture = async () => {
            try {
                await this.win.capturePage()
                    .then(image => {
                        fs.writeFileSync('test.png', image.toPNG(), (err) => {
                            if (err) console.log( err)
                        })
                    })
            } catch (e) {
                console.log(e)
            }
        };
    }
}

module.exports = new CaptureImageWindow()