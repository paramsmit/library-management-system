module.exports = (sequelize, DataTypes) => {
	const bookItem = sequelize.define('bookItems', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        
        borrowedDate: {
            type: DataTypes.DATE,
        },

        dueDate: {
            type: DataTypes.DATE,
        },

        status: {
            type: DataTypes.ENUM('AVAILABLE', 'RESERVED', 'LOANED', 'LOST')
        }
		
	});

	bookItem.associate = (models) => {
		bookItem.belongsTo(models.book);
        bookItem.belongsTo(models.profile);
	}
	
	return bookItem;
};
