let http = require("http");

let request = require("./request");
let response = require("./response");

module.exports = class myhttp {
  constructor() {
    this.request = Object.create(request)
    this.response = Object.create(response)
  }

  handleRequest(req, res) {
    let request = Object.create(this.request)
    let response = Object.create(this.response)
    request.req = req
    request.request = request
    response.res = res
    response.response = response
    console.log(request.headers.host, request.req.headers.host, req.headers.host)
  }

  listen(...args) {
    // 起一个服务
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(...args)
  }
}