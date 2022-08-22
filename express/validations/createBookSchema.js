const createBookSchema = {
    type: "object",
    required: ["isbn", "title", "author", "publisher", "pagecount"],
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
        pagecount: {
            type: "number"
        },
    }
}

module.exports = {
    createBookSchema
}