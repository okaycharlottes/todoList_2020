const express = require ("express");
const app = express ();
const dotenv = require ("dotenv");
const mongoose = require ("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();


app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended:true}));

//connexion db
mongoose.set ("useFindAndModify", false);
mongoose.connect (process.env.DB_CONNECT, 
    {useNewUrlParser: true,
    useUnifiedTopology: true}, ()=>{

    console.log ("connecté à la db !");

// ecouter le serveur
app.listen (3000, ()=> console.log ("serveur opérationnel"));
});

app.set ("view engine", "ejs");


//get methode
app.get ('/', (req, res)=>{
    TodoTask.find ({}, (err,tasks)=>{
        res.render("todo.ejs", {todoTasks: tasks});
    });
});

app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });


//mise a jour

app
.route("/edit/:id")
.get((req, res)=>{
    const id = req.params.id;
    TodoTask.find({}, (err,tasks)=>{
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id});
    });
})

.post((req,res)=>{
    const id= req.params.id;

    TodoTask.findByIdAndUpdate(id, {content: req.body.content}, err=>{
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//effacer

app
.route("/remove/:id").get((req,res)=>{
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err=>{
        if(err) return res.status(500,err);
        res.redirect("/");
    });
})