const createBookItemSchema = {
    type: "object",
    properties: {
        bookId : {
            type: "number",
            nullable: false
        }
    }
}

module.exports = {
    createBookItemSchema
}