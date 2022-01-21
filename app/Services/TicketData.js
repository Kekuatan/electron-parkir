// cat.js
const bwipjs = require('bwip-js');
const path = require("path");
const nodeConsole = require('console');
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);
// constructor function for the Cat class
class TicketData {
    constructor() {
        this.type = 'PM'
        this.gate = '01'
        //this.generateBarcodeNumber = generateBarcodeNumber()
        this.topLeftCorner = topLeftCorner();
        this.companyLogo = companyLogo();
        this.companyName = companyName();
        this.companyAddress = companyAddress();
        this.ticketTime = ticketTime;
        this.barcode = barcode;
        this.barcodeText = barcodeText;
        this.additionalText1 = additionalText1();
        this.additionalText2 = additionalText2();
        this.bottomRightCorner = bottomRightCorner();
        this.generateData = generateData;

    }
}


function generateBarcodeNumber() {
    var d = new Date();
    var datestring = ("0" + d.getDate()).slice(-2) + "" + ("0"+(d.getMonth()+1)).slice(-2) + "" +
    d.getFullYear() + "" + ("0" + d.getHours()).slice(-2) + "" + ("0" + d.getMinutes()).slice(-2) + ("0"+d.getSeconds()).slice(-2);
    return datestring
  }


function strReplaceCss (data) {

    if (typeof data == 'undefined' || data.length == 0) {
        return ''
    }
    let a = JSON.stringify(data)
    a = a.replace('{', ';')
    a = a.replaceAll('}', ';')
    a = a.replaceAll('"', '')
    a = a.replaceAll(',', ';')
    return a
}

function generateData(barcode_number,callback){
    let code = barcode_number//generateBarcodeNumber()
    let barcodeConfig = {
        bcid:        'qrcode',       // Barcode type
        text:        code,    // Text to encode
        scaleX:       2,               // 3x scaling factor
        scaleY:       3,
        height:      10,              // Bar height, in millimeters
        includetext: false,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
    }
        
        bwipjs.toBuffer(barcodeConfig,  (err, png) =>{
            if (err) {
                // `err` may be a string or Error object
                return callback(false)
            } else {
                let gifBase64 = `data:image/png;base64,${png.toString('base64')}`
                gifBase64  = `<img src="`+gifBase64+`" alt="Red dot" />`

                let data =  [
                    this.topLeftCorner,
                    this.companyLogo,
                    this.companyName,
                    this.companyAddress,
                    this.ticketTime(),
                    this.barcode(gifBase64),
                    this.barcodeText(code),
                    this.additionalText1,
                    this.additionalText2,
                    this.bottomRightCorner,
                ]
                return callback(data,gifBase64)
            }
        });

}


function topLeftCorner(){
    return {
        type: "text",
        value: `||----`,
        style: `text-align:left;`,
        css: { "font-size": "12px" },
      }
}

function companyLogo(){
    return {
        type: "image",
        path: path.join(__dirname, "../../assets/logo.png"), // file path
        position: "center", // position of image: 'left' | 'center' | 'right'
        width: "auto", // width of image in px; default: auto
        height: "60px", // width of image in px; default: 50 or '50px'
      }
}

function companyName(){
    return {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "PT. INDONESIA RAYA",
        style: `text-align:center;`,
        css: { "font-weight": "700", "font-size": "12px", "font-family": "sans-serif"},
      }
}

function companyAddress(){
    return {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Indonesia Jaya Raya Persija Jakarta Indonesia",
        style: `text-align:center;`,
        css: { "font-weight": "700", "font-size": "10px", "font-family": "sans-serif", "margin-bottom" : '10px' },
      }
}

function ticketTime(){
    let date = new Date().toLocaleString("id-IN")
    if (typeof (this.gate) != 'undefined' && typeof (this.type) != 'undefined'){
        date = date + ' ' + this.type + '/' + this.gate
    }
    return {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value:date ,
    
        css: {
          "font-size": "12px",
          "font-family": "sans-serif",
          "text-align": "center",
          "margin-top": '20px',
        },
        'name' : 'ticket_time'
      }
}

function barcode(dataImage){
    return {
        name : 'barcode_data_img',
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: dataImage,
        style: `text-align:center;`,
        css: { "font-size": "16px", "margin-bottom": '5px'},
      }
  
}

function barcodeText(barcodeCode){
    return {
        name : 'barcode_number',
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: barcodeCode,
        style: `text-align:center;`,
        css: { 
        "margin-left": '25px',
        "font-weight": "700", 
        "font-size": "16px", 
        "letter-spacing" : '8px',"font-family": "sans-serif", "margin-bottom": '20px' },
      }
}

function additionalText1 () {
    return {

     name : 'additional_text_1',
     type: "text",
     value: "PASTIKAN KENDARAAN ANDA TERKUNCI",
     style: `text-align:center;`,
     css: {
          "font-weight": "700", "font-size": "10px", "font-family": "sans-serif" }
   }
}

function additionalText2(){
    return {
        name : 'additional_text_2',
     type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
     value: "TIKETJANGAN SAMPAI HILANG",
     style: `text-align:center;`,
     css: { "font-weight": "700", "font-size": "10px", "font-family": "sans-serif", "margin-bottom" : '10px' },
   }
}

function bottomRightCorner(){
    return     {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "---||",
        style: `text-align:right;`,
        css: { "font-size": "12px" },
      }
}


// now we export the class, so other modules can create Cat objects
module.exports = {
    TicketData: new TicketData()
}


  