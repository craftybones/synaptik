const express = require("express");
const Destination = require("./destination.js");
const routes={};

const setConfig=(req,res,next)=>{
  let {srcPath,host,port} = req.body;
  routes[srcPath] = new Destination(host,port);
  res.setHeader('content-type','text/plain');
  res.write("ok");
  res.end();
}

const getConfig=(req,res,next)=>{
  let allRoutes=JSON.stringify(routes);
  res.setHeader('content-type','application/json');
  res.write(allRoutes);
  res.end();
}

const redirect=(srcReq,srcRes,next)=>{
  const destination=routes[srcReq.path];
  destination.sendTo(srcReq,(targetRes)=>{
    console.log(targetRes.body);
    srcRes.status(targetRes.statusCode).send("ok");
  })
}

const getRouter=()=>{
  let r=express.Router();
  r.use(express.json());
  r.post("/config",setConfig);
  r.get("/config",getConfig);
  r.all("*",redirect);

  return r;
}

module.exports = getRouter;
