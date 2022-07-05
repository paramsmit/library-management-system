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
            allowNull: true,
            type: DataTypes.INTEGER
        },
        email: {
            allowNull: true,
            type: DataTypes.STRING
        }
	});

	profile.associate = (models) => {
		profile.hasMany(models.bookItem);
		profile.belongsTo(models.account, { 
			foreignKey: {
				name: 'account_id',
				unique: true,
				allowNull : false
			}
		});
	}


	return profile;
};
