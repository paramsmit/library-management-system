module.exports = (sequelize, DataTypes) => {
	const bookItem = sequelize.define('bookItems', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},

		name: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
		},
        
        borrowedDate: {
            type: DataTypes.DATE,
            field: 'borrowed_date'
        },

        dueDate: {
            type: DataTypes.DATE,
            field: 'due_date'
        },

        status: {
            type: DataTypes.ENUM('AVAILABLE', 'RESERVED', 'LOANED', 'LOST')
        }
        
	});

	bookItem.associate = (models) => {
		bookItem.belongsTo(models.book);
        bookItem.belongsTo(models.member);
	}
	
	return bookItem;
};
