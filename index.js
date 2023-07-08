const con=require("./connection");

const express=require("express");
const app=express();
const port=8000;

app.use(express.static(__dirname+'/public'))

app.set('view engine','ejs')
const bodyParser=require('body-parser'); 

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); 

app.get("/",function(req,res){
    res.sendFile(__dirname+'/addcontact.html')
    
})

app.post("/",function(req,res){

    var name=req.body.name;
    var phoneno=req.body.phoneno;
    var email=req.body.email;

        var mysql="insert into contacts(name,phoneno,email) VALUES?"
        var values=[
            [name,phoneno,email]
        ]
        con.query(mysql,[values],function(error,result){
            if(error) console.log(error);
            res.redirect("/contactbook")
        })
})

app.get("/contactbook",function(req,res){
   var mysql="select * from contacts"

   con.query(mysql,function(error,result){
    if(error) console.log(error)
    res.render(__dirname+"/contactbook",{contactbook:result})
   })

})

app.get("/delete-contact",function(req,res){
    var mysql="delete from contacts where sno=?";

    var sno =req.query.sno;

    con.query(mysql,[sno],function(error,result){
        if(error) console.log(error)
        res.redirect("/contactbook")
    })

})

app.get("/update-contact",function(req,res){
    var mysql="select * from contacts where sno=?";

    var sno =req.query.sno;

    con.query(mysql,[sno],function(error,result){
        if(error) console.log(error)
        res.render(__dirname+"/update",{contactbook:result})
    })
})

app.post("/update-contact",function(req,res){
    var sno=req.body.sno
    var name=req.body.name;
    var phoneno=req.body.phoneno;
    var email=req.body.email;

    var mysql = "update contacts set name=?,phoneno=?,email=? where sno=?";
    con.query(mysql,[name,phoneno,email,sno],function(error,result){
        if(error) console.log(error);
        res.redirect("/contactbook")
    })
})

app.get("/search",function(req,res){
    var name=req.query.name;
    var phoneno=req.query.phoneno;
    var email=req.query.email;

    var sql="select * from contacts where name like'"+name+"%' and phoneno like '%"+phoneno+"%' and email like '%"+email+"%' "

    con.query(sql,function(error,result){
        if(error) console.log(error)
        res.render(__dirname+'/contactbook',{contactbook:result})
    })
})
app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})