var windowsDefault = require('./DefaultSettingWindow')
const {windowsEnum} = require("../../Enum/PathLocationEnum");
const {ipcMain: ipc} = require("electron");
const fs = require("fs");
class CaptureImageWindow extends windowsDefault{
    constructor() {
        super({width: 800, height: 600,
            show: false, // or true
            webPreferences: {
                nodeIntegration: true}})
        this.win.loadURL(windowsEnum.view["capture-image"]);
        this.eventClickButton()
    }


    eventClickButton( ) {
        ipc.on('invokeAction', async (event, data) => {
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
            event.sender.send('actionReply', data);
        });
    }
}

module.exports = CaptureImageWindow