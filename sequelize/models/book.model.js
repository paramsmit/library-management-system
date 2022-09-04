// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize, DataTypes) => {
	const book = sequelize.define('books', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		isbn: {
			allowNull: false,
			unique: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		title: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
		},
		author: {
			allowNull: false,
			type: DataTypes.STRING
		},
		publisher: {
			allowNull: false,
			type: DataTypes.STRING
		},
		pageCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
		}
	});

	book.associate = (models) => {
		book.hasMany(models.bookItem);
	}
	
	return book;
};
