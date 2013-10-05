var express = require('express');
var mongoose = require('mongoose');


/*
	Connecting to mongodb
*/
mongoose.connect('mongodb://localhost/todo');

/*
	Creating server instance
*/
var app = express();

/*
	Setting up express middlewares
*/
app.set('port', process.env.PORT || 4004);		//Port

app.use(express.bodyParser());                  //req.body
app.use(express.query());                       //req.query

app.use(app.router);							//Routing


/*
	Model
*/
var Schema = mongoose.Schema;

var todoSchema = new Schema({
	task 		: String,
	done 		: Boolean,
	timeStamp	: {
		type 	: 	Date,
		default : 	Date.now
	}
});

var Todo = mongoose.model('Todo', todoSchema);


/*
	Routes	
*/

//List
app.get('/', function(req, res, next){

	Todo.find({}, function(err, todos){
		if(err){
			res.json(400, {
				msg : err
			});
		}else{
			res.json(200, todos);
		}
	});
});

//Read
app.get('/read/:id', function(req, res, next){
	Todo.findOne({_id: req.params.id}, function(err, todo){
		if(err){
			res.json(400, {
				msg : err
			});
		}else{
			res.json(200, todo);
		}
	});
});

//Create
app.get('/create', function(req, res, next){
	new Todo({
		task 	: req.query.task,
		done 	: false,
	}).save(function(err, todo){
		if(err){
			res.json(400, {
				msg : err
			});
		}else{
			res.json(200, todo);
		}
	});
});

//Update
app.get('/update/:id', function(req, res, next){
	Todo.findOne({_id: req.params.id}, function(err, todo){
		if(err){
			res.json(400, {
				msg : err
			});
		}else{
			todo.task = req.query.task;
			todo.done = req.query.done;
			todo.save(function(err, todo){
				if(err){
					res.json(400, {
						msg : err
					});
				}else{
					res.json(200, todo);
				}
			});
		}
	});
});

//Delete
app.get('/delete/:id', function(req, res, next){
	Todo.remove({_id: req.params.id}, function(err){
		if(err){
			res.json(400, {
				msg : err
			});
		}else{
			res.json(200, {msg: "Removed successfully"});
		}
	});
});


/*
	Starting server
*/
app.listen(app.get('port'), function(){
	console.log('Listening on port '+app.get('port'));	
});
