const loginAccountSchema = {
    type: "object",
    required: ["username", "password"],
    properties : {
        username: {
            type: "string"
        },
        password: {
            type: "string"
        }
    }
}

module.exports = {
    loginAccountSchema
}