const assert=require("chai").assert;
const nock=require("nock");
const Destination = require("../src/destination.js");

describe("/GET default path",function(){
  let host , port, mockHttp;

  beforeEach(()=>{
    host = "somewhere";
    port = 8099;
    mockHttp=nock(`http://${host}:${port}`);
  });

  describe("with out body",function(){
    it("should respond with a 200 ",function(done){
      mockHttp.get("/").reply(200);

      let destination=new Destination(host,port);
      let mckSrcReq = {
        'headers':{}
      };

      destination.sendTo(mckSrcReq,(targetRes)=>{
        assert.equal(200,targetRes.statusCode);
        done();
      });
    });

    it("should respond with a 404 ",function(done) {
      mockHttp.get("/").reply(404);

      let destination=new Destination(host,port);
      let mckSrcReq = {
        'headers':{}
      };

      destination.sendTo(mckSrcReq,(targetRes)=>{
        assert.equal(404,targetRes.statusCode);
        done();
      });

    })
  });

  describe("with headers",function(){
    it("should transmit source headers to target headers without modification",function(done){
      let mockHttp=nock(`http://${host}:${port}`,{
        reqheaders:{
          'User-agent':'curl',
          'Accept':'*/*'
        }
      })
        .get("/")
        .reply(200);

      let destination=new Destination(host,port);
      let mckSrcReq = {
        'headers':{
          'User-agent':'curl',
          'Accept':'*/*'
        }
      };

      destination.sendTo(mckSrcReq,(targetRes)=>{
        assert.equal(200,targetRes.statusCode);
        done();
      });
    });
  });
});
