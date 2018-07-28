const http=require("http");

class Destination {
  constructor(host,port) {
    this.host = host;
    this.port = port;
  }
  sendTo(srcReq,cb) {
    let headers=srcReq.headers;
    headers.host = this.host;
    let options={host:headers.host,path:"/",headers:headers,port:this.port};
    let targetReq=http.request(options,(targetRes)=>{
      cb(targetRes);
    });
    targetReq.end();
  }
}

module.exports = Destination;
