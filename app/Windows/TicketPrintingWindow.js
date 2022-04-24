const { app, BrowserWindow, protocol, ipcMain} = require("electron");
var windowsDefault = require('./Extends/DefaultSettingWindow')
const path = require("path");
const XMLHttpRequest = require('xhr2');
const {TicketData} = require("../../app/Services/TicketData");
const {NFCService} = require("../../app/Services/NFC/NFCService");
const {CaptureImageService} = require("../../app/Services/CaptureImageService");
const {ConfigEnum} = require("../../app/Enums/ConfigEnum");

class TicketPrintingWindow extends windowsDefault{
    constructor() {
        super({
            width: '839px',
            height: '483px',
            webPreferences: {
                preload: path.join(process.cwd(), 'resources', 'views', 'ticket', 'ticket.js')
            },
            frame: false,
            win : false
        })

        this.data = []
        this.eventClickButton()
        this.nfcRun()
        this.view = path.join(process.cwd(), 'resources', 'views', 'ticket', 'ticket.html');

        //mainWindow.webContents.openDevTools()
        //this.win.loadFile(path.join(__dirname, 'resources', 'views', 'ticket', 'ticket.html'));
    }

    nfcRun(){
        NFCService.nfc.on('reader', reader => {
            reader.on('card', card => {
                // card is object containing following data
                // [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
                // [always] String standard: same as type
                // [only TAG_ISO_14443_3] String uid: tag uid
                // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response
                console.log(`${reader.reader.name}  card detected`, card);
                CaptureImageService.takeImage()
                this.print()
            });
        })
    }



     basiAuth(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        var data =JSON.stringify({'grant_type': 'client_credentials'});
        let username = "96122656-f61d-48b5-b361-313f57f1f574"
        let password = 'YcOqoWKScsD1YA3QWud6htiZScG9q0pAPFINrJJZ'



        console.log('UNSENT: ', xmlHttp.status);

        let key = Buffer.from(username + ':' + password).toString('base64')
        xmlHttp.open( "POST", theUrl, true ); // false for synchronous request
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.setRequestHeader("Authorization", "Basic " + key);
        xmlHttp.send(data)
        console.log('OPENED: ', xmlHttp.status);

        xmlHttp.onprogress = function () {
            console.log('LOADING: ', xmlHttp.status);
        };

        return xmlHttp;

    }

    restApi(theUrl,type, data) {
        this.response = null
        var xmlHttp = new XMLHttpRequest();
        var data =JSON.stringify(data);



        console.log('UNSENT: ', xmlHttp.status);
        xmlHttp.open( type, theUrl, true ); // false for synchronous request
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.setRequestHeader("Authorization", "Bearer  " + this.access_token);
        xmlHttp.send(data)
        console.log('OPENED: ', xmlHttp.status);

        xmlHttp.onprogress = function () {
            console.log('LOADING: ', xmlHttp.status);
        };

        return xmlHttp;

    }

    auth = () => {
            return new Promise((resolve, reject) => {
                const  key = this.basiAuth('http://192.168.110.38/oauth/token')
                key.onload =  () => {
                    console.log('DONE: ', key.status);
                    this.access_token = JSON.parse(key.responseText).access_token;
                    resolve()
                };

            })
    }


    async eventClickButton( ) {
        console.log('click button')
        const auth = () => {
            return new Promise((resolve, reject) => {
                const  key = this.basiAuth('http://192.168.110.38/oauth/token')
                key.onload =  () => {
                    console.log('DONE: ', key.status);
                    this.access_token = JSON.parse(key.responseText).access_token;
                    resolve()
                };

            })
        }

        await auth()

        this.print = async (event, someArgument) => {
            //const result = await doSomeWork(someArgument)
            //return mainWindow.webContents.getPrinters()




            const saveFile = () => {
                return new Promise((resolve, reject) => {
                    TicketData.generateData(this.response, (data, barcode_data_img) => {
                        this.data = data
                        resolve()
                    });
                })
            }

            const api = () => {
                return new Promise((resolve, reject) => {
                    const  key = this.restApi('http://192.168.110.38/api/ticket/in', 'POST', {'area_position_in_id' : '1'})
                    key.onload =  () => {
                        console.log('DONE: ', key.status);
                        this.response = JSON.parse(key.responseText);
                        resolve()
                    };

                })
            }

            await api()
            await saveFile()


            console.log(this.response)
            if (!this.win){
                this.win = new BrowserWindow();
                 this.win.webContents.openDevTools()
            } else{
                this.win.close();
                this.win = new BrowserWindow();
                this.win.webContents.openDevTools()
            }

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
                     console.log('Print Initiated');
                        this.win.webContents.print(options, (success, failureReason) => {
                             console.log(success);
                             console.log(failureReason);
                             if (!success) {
                                 console.log('Print failled');
                                 console.log(failureReason);
                             } else{
                                 if(this.win){
                                      // setTimeout(()=> {
                                      //     this.win.close();
                                      // }, 200)
                                 }
                                 console.log('Print success');
                                 return this.data
                             }


                         });


            },500)


        }
    }


}

module.exports = new TicketPrintingWindow()