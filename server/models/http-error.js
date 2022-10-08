class HttpError extends Error {
    constructor(message, errorCode) {
        super(message);          // Add "message" property to the parent class "Error"
        this.code = errorCode;   // Add a "code" property
    }
}

module.exports = HttpError