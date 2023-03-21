"use strict";
exports.__esModule = true;
exports.setUP = void 0;
var fs = require("fs");
function setUP(express, rout) {
    rout.map(function (dd) {
        return express.use(dd.rout, function (req, resp) {
            var path = req.path;
            if (path === '/') {
                path = "/index.html";
            }
            if ((dd.path + path).indexOf('index.html') !== -1) {
                var fullPath = dd.path + "/index.html";
                var data = fs.readFileSync(fullPath, 'utf8');
                resp.header('Content-Type', 'text/html; charset=UTF-8');
                return resp.send(data.replace(data.substring(data.indexOf("<head>"), data.indexOf("</head>")), dd.seoManager((function () {
                    try {
                        var sPageURL = path.substring(path.indexOf('?') + 1), sURLVariables = sPageURL.split('&'), sParameterName = void 0, i = void 0;
                        var mapData = {};
                        for (i = 0; i < sURLVariables.length; i++) {
                            sParameterName = sURLVariables[i].split('=');
                            mapData[sParameterName[0]] = sParameterName[1];
                        }
                        return mapData;
                    }
                    catch (e) {
                        return {};
                    }
                })())));
            }
            else {
                return resp.sendFile(decodeURI((dd.path + path)));
            }
        });
    });
}
exports.setUP = setUP;
