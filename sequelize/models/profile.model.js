module.exports = (sequelize, DataTypes) => {
	const profile = sequelize.define('profiles', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING
		},
		contact: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING
        }
	});

	profile.associate = (models) => {
		profile.hasMany(models.bookItem);
		profile.belongsTo(models.account, { 
			foreignKey: {
				name: 'accountId',
				unique: true,
				allowNull : false
			}
		});
	}

	return profile;
};
