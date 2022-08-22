const updateBookItemSchema = {
    type: "object",
    properties: {
        status: {
            type: "string",
            enum: ["LOANED", "AVAILABLE", "LOST"],
            nullable : false
        },
        profileId: {
            type: "number",
            nullable: false
        }
    }
}

module.exports = {
    updateBookItemSchema
}