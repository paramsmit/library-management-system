const updateBookSchema = {
    type: object,
    isbn: {
        type: "string",
        nullable : false
    },
    title: {
        type: "string",
        nullable : false
    },
    author: {
        type: "string",
        nullable : false
    },
    publisher: {
        type: "string",
        nullable : false
    },
    pageCount: {
        type: "string",
        nullable : false
    }
}