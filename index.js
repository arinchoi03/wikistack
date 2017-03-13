var morgan = require("morgan");
var express = require("express");
var bodyParser = require("body-parser");
var nunjucks = require("nunjucks");
var models = require("./models");
var chalk = require("chalk");

var app = express();

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

app.use('/wiki', require('./routes/wiki')); //combines var wikiRouter = require('./routes/wiki); & app.use('/wiki', wikiRouter);



// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);

app.get('/', function(req, res, next) {
	res.send('Homepage')
})

//ERROR middleware (next(err) gets piped here) ! NEED FOUR ARGUMENTS!!!
app.use(function(err, req, res, next) {
	console.error(err);
	res.status(500).send(err.message);
})

models.User.sync({force: true})
.then(function() {
	return models.Page.sync({force: true})
})
.then(function() {
	app.listen(3000, function() {
		console.log('Server is listening at port 3000');
	});
})
.catch(console.error);
