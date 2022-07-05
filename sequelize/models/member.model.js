module.exports = (sequelize, DataTypes) => {
	const member = sequelize.define('members', {
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

	member.associate = (models) => {
		member.hasMany(models.bookItem);
		member.belongsTo(models.account, { 
			foreignKey: {
				name: 'account_id',
				unique: true,
				allowNull : false
			}
		});
	}


	return member;
};
