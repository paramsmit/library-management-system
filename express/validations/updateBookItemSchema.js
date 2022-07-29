const updateBookItemSchema = {
    type: "object",
    properties: {
        status: {
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