const createProfileSchema = {
    type : 'object',
    required: ["name","contact","email"],
    properties : {
        name: {
            type: "string",
            nullable: false
        },
        contact: {
            // type: "number",
            type: "string",
            nullable: false
        },
        email: {
            type: "string",
            nullable: false
        },
        accountId: {
            type: "integer",
            // type: "string",
            nullable: false
        }
    }
}

module.exports = {
    createProfileSchema
}