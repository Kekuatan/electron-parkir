var windowsDefault = require('./Extends/DefaultSettingWindow')
const path = require("path");
const {TicketData} = require("../../app/Services/TicketData");

class TicketPrintingWindow extends windowsDefault{
    constructor() {
        super({
            width: '839px',
            height: '483px',
            webPreferences: {
                preload: path.join(__dirname, 'resources', 'views', 'ticket', 'ticket.js')
            },
            frame: false
        })

        this.eventClickButton()
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

            this.win.loadFile(path.join(__dirname, 'resources', 'views', 'ticket', 'ticket.html'), {
                query: {queryKey: JSON.stringify(b)},
                hash: "hashValue",
            });

            var options = {
                silent: false,
                printBackground: true,
                color: false,
                margin: {
                    marginType: 'printableArea'
                },
                landscape: false,
                pagesPerSheet: 1,
                collate: false,
                copies: 1,
                header: 'Header of the Page',
                footer: 'Footer of the Page'
            }

            return this.data

            // workerWindow.webContents.print(options, (success, failureReason) => {
            //   if (!success) {
            //     console.log(failureReason);
            //   } else{
            //     workerWindow.close();
            //   }
            //
            //   console.log('Print Initiated');
            // });

        }
    }


}

module.exports = HomeWindow