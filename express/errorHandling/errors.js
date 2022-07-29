const { UserFacingError, ApplicationError } = require('./application.error')


class BadRequestError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {  
        return 400;
    }
}

class ForbiddenRequestError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get statusCode() {  
        return 403;
    }
}

class NotFoundError extends UserFacingError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }
    get statusCode() {
        return 404
    }
}

class DatabaseError extends ApplicationError {
    constructor(message, options = {}) {
        super(message);
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }
    get statusCode() {
        return 500
    }
}

module.exports = {
    BadRequestError,
    NotFoundError,
    DatabaseError,
    ForbiddenRequestError
}
