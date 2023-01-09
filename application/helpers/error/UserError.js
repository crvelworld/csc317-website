/*
Code given by instructor
Module to log user errors easier
*/
class UserError extends Error {
    constructor(message, redirectURL, status){
        super(message);
        this.redirectURL = redirectURL;
        this.status = status;
    }

    getMessage() {
        return this.message;
    }

    getRedirectURL() {
        return this.redirectURL;
    }

    getStatus() {
        return this.status;
    }
}

module.exports = UserError;