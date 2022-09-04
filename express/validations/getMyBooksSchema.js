const getMyBooksSchema = {
    type: "object",
    required: ["profileId"],
    properties : {
        profileId: {
            type: "string"
        }
    }
}

module.exports = {
    getMyBooksSchema
}