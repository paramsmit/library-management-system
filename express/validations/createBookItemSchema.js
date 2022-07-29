const createBookItemSchema = {
    type: "object",
    properties: {
        status: {
            enum: ["LOANED", "AVAILABLE", "LOST"],
            nullable : false
        },
        bookId : {
            type: "number",
            nullable: false
        },
        profileId: {
            type: "number",
            nullable: false
        }
    }
}

module.exports = {
    createBookItemSchema
}