// cat.js

// constructor function for the Cat class
const XMLHttpRequest = require("xhr2");
const {ConfigEnum} = require("../../Enums/ConfigEnum");

class ApiConnectionService {
    constructor(){

    }

    restApi(url,type, payload, query) {
        this.response = null
        var xmlHttp = new XMLHttpRequest();
        var payload =JSON.stringify(payload);
        url = ConfigEnum.auth.base_url + url
        let access_token = ConfigEnumConfigEnum.access_token

        console.log('UNSENT: ', xmlHttp.status);
        xmlHttp.open( type, url, true ); // false for synchronous request
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.setRequestHeader("Authorization", "Bearer  " + access_token);
        xmlHttp.send(payload)
        console.log('OPENED: ', xmlHttp.status);

        xmlHttp.onprogress = function () {
            console.log('LOADING: ', xmlHttp.status);
        };
        return xmlHttp;
    }
}


// now we export the class, so other modules can create Cat objects
module.exports = {
    ApiConnectionService: ApiConnectionService
}