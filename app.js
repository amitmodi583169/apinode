console.log("running");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs=require("fs");
const https=require("https");
var a=103;
var b=34;


fs.readFile("./file.txt","utf8",(err,data)=>{
    setTimeout(() => {
        console.log("internal timeout ")
    }, 3000);
    console.log("File Data",data);
});


https.get("https://dummyjson.com/products/1",(res)=>{
    console.log("fethced data successfully");
})



function multiply(a,b){
    return a*b;
}
setTimeout(() => {
    console.log("settimeout called after 5 seconds");
}, 5000);






setImmediate(()=>{console.log("set immediate")});

var c=multiply(a,b);
console.log(c);
