module.exports = (sequelize, DataTypes) => {
	const account = sequelize.define('accounts', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        username: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
			validate: {
				// We require usernames to have length of at least 3, and
				// only use letters, numbers and underscores.
				is: /^\w{3,}$/
			}
		},
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
		role : {
			type: DataTypes.ENUM('ADMIN','USER'),
			defaultValue : 'USER'
		}
	});

	account.associate = (models) => {
		account.hasOne(models.member, { 
			foreignKey: {
				name: 'account_id',
				unique: true,
				allowNull : false
			}
		});
        account.hasOne(models.librarian, {
			foreignKey: {
				name: 'account_id',
				unique: true,
				allowNull : false
			}
		});
	}

	return account;
};
