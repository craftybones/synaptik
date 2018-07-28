const express = require("express");
const http = require("http");
const Destination = require("./destination.js");
const router = express.Router();
const app = express();
const routes = {};

routes["/"] = new Destination("localhost",8099);

router.use(express.json());
router.use((req,res)=>{
  let {srcPath,host,port}=req.body;
  routes[srcPath] = new Destination(host,port);
  res.end();
})

app.post("/config",router);

app.all("*",(srcReq,srcRes)=>{
  const destination=routes[srcReq.path];
  destination.sendTo(srcReq,(targetRes)=>{
    console.log(targetRes.statusCode);
    srcRes.send("ok",targetRes.statusCode);
  })
})

app.listen(8090,()=>console.log("listening on 8090"));
