const express = require("express");
const bodyParser = require("body-parser");
const request = require("request-promise");
const fxmlApi = require("./fxml/api");
const app = express();

const DEBUG_MODE = false;

app.use(express.static("public"));
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.set("view engine", "ejs");

// DATA HELPERS
var emptyRouteData = {
    routedata: {
        src_airport: "",
        dest_airport: "",
        simple_route: "",
        all_wpts: []
    }
};

var dummyRouteData = {
    routedata: {
        src_airport: "KSFO",
        dest_airport: "KRNO",
        simple_route: "TRUKN2 ORRCA HOBOA WALAR",
        all_wpts: [
            { name: "KSFO", type: "Origin Airport", latitude: 37.6188056, longitude: -122.3754167 },
            { name: "TYDYE", type: "Waypoint", latitude: 37.6893333, longitude: -122.2689444 },
            { name: "TRUKN", type: "Waypoint", latitude: 37.7175556, longitude: -122.2145833 },
            { name: "HYPEE", type: "Waypoint", latitude: 37.88025, longitude: -122.0674722 },
            { name: "ORRCA", type: "Waypoint", latitude: 38.4436667, longitude: -121.5516111 },
            { name: "HOBOA", type: "Reporting Point", latitude: 39.4043694, longitude: -120.3048917 },
            { name: "WALAR", type: "Reporting Point", latitude: 39.7613083, longitude: -119.76855 },
            { name: "KRNO", type: "Destination Airport", latitude: 39.4991111, longitude: -119.7681111 }
        ]
    }
};

// HOME PAGE
app.get("/", function(req, res) {
    res.render("index", emptyRouteData);
});

// APT ROUTE
app.get("/route", function(req, res) {
    res.render("index", emptyRouteData);
});

app.post("/route", function(req, res) {
    console.log(req.body);
    let sourceApt = req.body["srcApt"].toUpperCase();
    let destApt = req.body["destApt"].toUpperCase();
    let simpleRoute = "";
    let allWaypoints = [];

    if (DEBUG_MODE) {
        res.render("index", dummyRouteData);
    } else {
        // get simple route
        simpleRoutePromise = fxmlApi.routeBwApts(sourceApt, destApt);

        var onSimpleSuccess = function(result) {
            simpleRoute = result;

            allWaypointsPromise = fxmlApi.decodedRoute(sourceApt, destApt, simpleRoute);
            var onDecodeSuccess = function(result) {
                allWaypoints = result;
                res.render("index", {
                    routedata: {
                        src_airport: sourceApt,
                        dest_airport: destApt,
                        simple_route: simpleRoute,
                        all_wpts: allWaypoints
                    }
                });
            };
            var onDecodeErr = function(err) {
                console.log("Error fetching decoded route!");
                res.render("index", emptyRouteData);
            };
            allWaypointsPromise.then(onDecodeSuccess, onDecodeErr);
        };

        var onSimpleErr = function(err) {
            console.log("Error fetching routes!");
            res.render("index", emptyRouteData);
        };

        simpleRoutePromise.then(onSimpleSuccess, onSimpleErr);
    }
});

app.listen(20000, function() {
    console.log("Now running on port 20000");
});
