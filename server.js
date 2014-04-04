var http = require('http'),
    express = require('express'),
    marked = require('marked'),
    fs = require('fs');

var app = express();

app.engine('handlebars', require('express3-handlebars')({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded());

app.use(app.router);

// TODO: we will fill this in later....

http.createServer(app).listen(3000, function(){
	console.log('listening on 3000');
});
