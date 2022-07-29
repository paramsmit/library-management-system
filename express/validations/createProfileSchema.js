const createProfileSchema = {
    type : 'object',
    required: ["name","contact","email"],
    properties : {
        name: {
            type: "string",
            nullable: false
        },
        contact: {
            type: "number",
            nullable: false
        },
        email: {
            type: "string",
            nullable: false
        },
        accountId: {
            type: "integer",
            nullable: false
        }
    }
}

module.exports = {
    createProfileSchema
}