const updateProfileSchema = {
    type : 'object',
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
        }
    }
}

module.exports = {
    updateProfileSchema
}