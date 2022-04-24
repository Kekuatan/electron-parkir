// cat.js

// constructor function for the Cat class
class ConfigEnum {
    constructor() {
        this.auth = {
            'client_id': "96122656-f61d-48b5-b361-313f57f1f574",
            'client_secret': 'YcOqoWKScsD1YA3QWud6htiZScG9q0pAPFINrJJZ'
        }
        this.base_url = 'http://192.168.110.38';
        this.access_token = null
    }
}


// now we export the class, so other modules can create Cat objects
module.exports = {
    ConfigEnum: ConfigEnum
}