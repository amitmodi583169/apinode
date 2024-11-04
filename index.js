const calculateSum=require("./calculate");
calculateSum.calculateSum(2,34);
const express= require("express");
const sql=require("mssql/msnodesqlv8");
const app=express();
const jwt= require("jsonwebtoken");

app.use(express.json());    
app.use(express.urlencoded({extended:true}));

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

var config={
    server:process.env.SERVER,
    database:process.env.DATABASE,
    driver:process.env.DRIVER,
    options:{
        trustedConnection:true
    }
}

const db=sql.connect(config,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Database connected");
    }
})


app.get("/getStudentList",async function(req,res){
    try {
        let request = db.request();
        const result = await request.query("SELECT * FROM studentInfo;");
        res.json({ msg: "Fetch successfully", data: result.recordset });
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ msg: "Error fetching data", error: err.message });
    }
})

app.post("/saveStudentDetail",async function(req,res){
    try {
        let request = db.request();
        console.log(req.body.Name,req.body.RollNo,req.body.Address);
        request.input("Name",sql.VarChar(50),req.body.Name)
        .input("RollNo",sql.Int,req.body.RollNo)
        .input("Address",sql.VarChar(50),req.body.Address)

        const q="insert into studentInfo(Name,RollNo,Address) values(@Name,@RollNo,@Address)";
        const result = await request.query(q);
        res.json({ msg: "Saved Detail Successfully" });
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ msg: "Error Saving data", error: err.message });
    }
})

app.post("/deleteStudentDetail/:RollNo",async function(req,res){
    try{
let request=db.request();
console.log(req.params);
request.input("RollNo",sql.Int,req.params.RollNo);

await request.query("delete from studentInfo where RollNo=@RollNo");
const result1 = await request.query("SELECT * FROM studentInfo;");
res.json({msg: "deleted successfully", data: result1.recordset});
    }
    catch(err){
        console.error("Error executing query:", err);
    }

})

app.post("/updateStudentDetail/:RollNo",async function(req,res){
    try{
let request=db.request();

request.input("RollNo",sql.Int,req.params.RollNo);
request.input("Name",sql.VarChar(50),req.body.Name)
        .input("Address",sql.VarChar(50),req.body.Address)

await request.query("update  studentInfo set Name=@Name,Address=@Address where RollNo=@RollNo");
res.json({msg: "updated successfully"});
    }
    catch(err){
        console.error("Error executing query:", err);
    }

})



const secretKey="secretKey";
app.post("/login",(req,res)=>{

    const user={
        id:1,
        username:"amitmodi",
        email:"amitmodi038@gmail.com"
    }
    jwt.sign({user},secretKey,{expiresIn:'600s'},(err,token)=>{
        console.log(token);
        res.json({"token":token})
    })
})

app.post("/profile",verifyToken,(req,res)=>{
jwt.verify(req.token,secretKey,(err,authData)=>{
    console.log(authData);
    if(err){
        res.send({"result":"invalid token"});
    }
    else{
        res.json({
            message:"profile accessed",
            "authData":authData  
        })
    }
})
})

function verifyToken(req,res,next){
const bearerHeader= req.headers['authorization'];
// console.log(bearerHeader);
if(typeof bearerHeader != undefined){

    const bearer= bearerHeader.split(" ");
    const token=bearer[1];
    req.token=token;
    next();
}
else{
    res.send({result:"token not valid"});
}
}


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});