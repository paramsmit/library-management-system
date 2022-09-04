const createBookSchema = {
    type: "object",
    required: ["isbn", "title", "author", "publisher", "pageCount"],
    properties : {
        isbn: {
            type: "string"
        },
        title: {
            type: "string"
        },
        author: {
            type: "string"
        },
        publisher: {
            type: "string"
        },
        pageCount: {
            type: "number"
        },
    }
}

module.exports = {
    createBookSchema
}