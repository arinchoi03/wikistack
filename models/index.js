var Sequelize = require("sequelize");
var db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging: false
});

//three parts of define 'string', 'models', 'methods'
var Page = db.define('page', {
	//MODEL
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('open', 'closed')
	},

}, { //METHODS
	getterMethods: {
		route: function() {
			return '/wiki/' + this.urlTitle
		}
	},
	hooks: {
		beforeValidate: function(page) {
			page.urlTitle = generateUrlTitle(page.title)
		}
	}
});

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		isEmail: true
	}
});

Page.belongsTo(User, {as: 'author'});

module.exports = {
	Page: Page,
	User: User
};

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}
