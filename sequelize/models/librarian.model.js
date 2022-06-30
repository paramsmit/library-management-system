module.exports = (sequelize, DataTypes) => {
	const librarian = sequelize.define('librarians', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
        contact: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        email: {
            allowNull: true,
            type: DataTypes.STRING
        }
	});

	librarian.associate = (models) => {
		librarian.belongsTo(models.account);
	}
	
	return librarian;
};
