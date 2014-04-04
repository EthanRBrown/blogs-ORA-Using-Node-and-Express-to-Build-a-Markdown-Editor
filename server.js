var http = require('http'),
    express = require('express'),
    marked = require('marked'),
    fs = require('fs');

var app = express();

app.engine('handlebars', require('express3-handlebars')({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded());

app.use(app.router);

app.get('/', function(req, res){
	fs.readdir(__dirname + '/md', function(err, files){
		if(err) files = [];
		files = files.filter(function(f){ return f.match(/\.md$/i); })
			.map(function(f) { return f.replace(/\.md$/i, ''); });
		res.render('home', { pageTitle: 'Home', files: files });
	});
});

app.get('/edit/:name', function(req, res){
	var name = req.params.name;
	fs.readFile(__dirname + '/md/' + name + '.md', function(err, data){
		// if there's an error, it probably means the file doesn't exist,
		// meaning this is a new file: just set data to an empty string
		if(err) data = '';
		res.render('edit', { pageTitle: 'Editing ' + name, name: name, content: data });
	});
});

app.post('/edit/:name', function(req, res){
	var name = req.params.name;
	fs.writeFile(__dirname + '/md/' + name + '.md', req.body.content, function(err){
		if(err) return res.redirect('/');
		res.redirect('/view/' + name);
	});
});

app.get('/view/:name', function(req, res){
	var name = req.params.name;
	fs.readFile(__dirname + '/md/' + name + '.md', { encoding: 'utf8' }, function(err, data){
		if(err) res.redirect('/');
		res.render('view', { pageTitle: 'Viewing ' + name, name: name, content: marked(data) });
	});
});

app.get('/delete/:name', function(req, res){
	fs.unlink(__dirname + '/md/' + req.params.name + '.md', function(err){
		res.redirect('/');
	}); 
});

app.get('/rename/:oldName/:newName', function(req, res){
	var oldName = __dirname + '/md/' + req.params.oldName + '.md';
	var newName = __dirname + '/md/' + req.params.newName + '.md';
	fs.rename(oldName, newName, function(){
		res.redirect('/');
	});
});

http.createServer(app).listen(3000, function(){
	console.log('listening on 3000');
});
