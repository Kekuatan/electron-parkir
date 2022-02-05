const { app, BrowserWindow, protocol, ipcMain} = require("electron");
var windowsDefault = require('./Extends/DefaultSettingWindow')
const path = require("path");
const {TicketData} = require("../../app/Services/TicketData");

class TicketPrintingWindow extends windowsDefault{
    constructor() {
        super({
            width: '839px',
            height: '483px',
            webPreferences: {
                preload: path.join(process.cwd(), 'resources', 'views', 'ticket', 'ticket.js')
            },
            frame: false
        })
        this.data = []
        this.eventClickButton()
        this.view = path.join(process.cwd(), 'resources', 'views', 'ticket', 'ticket.html');

        //mainWindow.webContents.openDevTools()
        //this.win.loadFile(path.join(__dirname, 'resources', 'views', 'ticket', 'ticket.html'));
    }

    eventClickButton( ) {
        this.print = async (event, someArgument) => {
            //const result = await doSomeWork(someArgument)
            //return mainWindow.webContents.getPrinters()

            const saveFile = () => {
                return new Promise((resolve, reject) => {
                    TicketData.generateData((data, barcode_data_img) => {
                        this.data = data
                        resolve()
                    });
                })
            }
            await saveFile()


            this.win = new BrowserWindow();
            this.win.webContents.openDevTools()

            this.win.loadFile(this.view, {
                query: {queryKey: JSON.stringify(this.data)},
                hash: "hashValue",
            });


            var options = {
                silent: true,
                printBackground: false,
                color: false,
                margin: {
                    marginType: 'custom',
                    top : 0,
                    right:0,
                    left:0,
                    bottom:0
                },
                pageSize: 'A5',
                landscape: false,
                pagesPerSheet: 1,
                collate: false,
                copies: 1,
            }
                setTimeout(()=>{
                    this.win.webContents.print(options, (success, failureReason) => {
                        if (!success) {
                            console.log(failureReason);
                        } else{
                            if(this.win){
                                //   this.win.close();
                            }
                            return this.data
                        }

                        console.log('Print Initiated');
                    });
                },500)


        }
    }


}

module.exports = new TicketPrintingWindow()