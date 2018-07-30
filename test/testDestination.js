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

      destination.sendTo(mckSrcReq,(statusCode)=>{
        assert.equal(200,statusCode);
        done();
      });
    });

    it("should respond with a 404 ",function(done) {
      mockHttp.get("/").reply(404);

      let destination=new Destination(host,port);
      let mckSrcReq = {
        'headers':{}
      };

      destination.sendTo(mckSrcReq,(statusCode)=>{
        assert.equal(404,statusCode);
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

      destination.sendTo(mckSrcReq,(statusCode)=>{
        assert.equal(200,statusCode);
        done();
      });
    });
  });

  describe("with body",function(){
    it("should return the body as returned by the destination",function(done){
      mockHttp.get("/").reply(200,"ok");
      let destination=new Destination(host,port);
      let mckSrcReq = {
        'headers':{}
      };

      destination.sendTo(mckSrcReq,(statusCode,body)=>{
        assert.equal(200,statusCode);
        assert.equal("ok",body);
        done();
      })
    });
  });
});
