"use strict";
exports.__esModule = true;
exports.setUP = void 0;
var fs = require("fs");
function setUP(express, rout) {
    rout.map(function (dd) {
        return express.use(dd.rout, function (req, resp) {
            if ((dd.path + req.path).indexOf('index.html') !== -1) {
                var fullPath = dd.path + req.path;
                var data = fs.readFileSync(fullPath, 'utf8');
                var seoPath = fs.readFileSync(fullPath.substring(0, fullPath.indexOf('/index.html')) + '/SEOManager.js', 'utf8');
                var headerString = eval("".concat((seoPath), "(header[\"").concat(req.query["page"], "\"] ?? header[\"default\"])();"));
                resp.header('Content-Type', 'text/html; charset=UTF-8');
                return resp.send(data.replace('<%HEAD%>', headerString));
            }
            else {
                return resp.sendFile((dd.path + req.path.replace(/%20/g, " ")));
            }
        });
    });
}
exports.setUP = setUP;
