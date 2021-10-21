const express = require('express');
const app= express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = express.Router();
const ToDo =  require('./models/todoSchema');

dotenv.config({ path : './config.env' })

const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE || 'mongodb://localhost:27017/todo-db';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(DB, {
    useNewUrlParser : true
});

console.log(`DATABASE URI String ${DB}`);
const connection = mongoose.connection;
connection.once('open', ()=> {
    console.log(`Database connected successfully.`);
});

// GET REQUEST FOR GETTING ALL TODOS
router.route('/').get((req, res) => {
    ToDo.find((err, todos)=> {
        if(err){
            console.log(err);
        }else{
            res.json(todos);
        }
    });
});

router.route('/create').post((req, res )=> {
    const {todo_description, todo_responsible, todo_priority, todo_completed } = req.body;
    const todo = new ToDo({
        todo_description : todo_description,
        todo_responsible : todo_responsible, 
        todo_priority : todo_priority,
        todo_completed : todo_completed
    });
    todo.save().then((todo) => {
        res.status(200).json({
            'success' : true,
            'todo' : todo
        });
    });
}); 

router.route('/:id').get((req, res) => {
    const id = req.params.id;
    ToDo.findById(id, (err, todo)=> {
        if(err){
            console.log(err);
        }else{
            res.json(todo);
        }
    });
});

router.route('/update/:id').post((req, res) => {
    const id= req.params.id;
    ToDo.findById(id, (err, todo) => {
        if(!todo){
            res.status(404).send('data not found!!');
        }else{
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then((todo)=>{
                res.status(200).json({
                    'success' : true, 
                    'todo' : todo  
                });
            });
        }
    });
});

app.use('/todos', router);

app.listen(PORT , () => {
    console.log(`Server is running on port : ${PORT}`);
});
