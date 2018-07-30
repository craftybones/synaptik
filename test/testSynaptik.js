const assert=require("chai").assert;
const nock=require("nock");
const getRouter=require("../src/synaptik.js");
const request=require("supertest");

describe("config",function(){
  it("should let me configure a simple destination",function(done){
    const router=getRouter();
    request(router)
      .post("/config")
      .send({srcPath:"/foobar",host:"somewhere",port:8099})
      .expect('content-type','text/plain')
      .expect(200,done);
  });
});
