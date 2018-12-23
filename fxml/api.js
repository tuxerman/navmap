const request = require("request-promise");

const flightAwareUserName = "USERNAME";
const flightAwareApiKey = "API_KEY";

const fxmlUrl = "http://flightxml.flightaware.com/json/FlightXML2/";
const fxmlRoutesAptUrl = "http://flightxml.flightaware.com/json/FlightXML2/RoutesBetweenAirports";
const fxmlDecodedRouteUrl = "http://flightxml.flightaware.com/json/FlightXML2/DecodeRoute";

// NPM CACHE for local, non-prod use.
// WARNING: Check Flightaware API terms of use before attempting to use in production!
var Cache = require("sync-disk-cache");
var simpleRouteCache = new Cache("simple-route-cach-001");
var decodedRouteCache = new Cache("decoded-route-cache-001");

// Functions
const routeBwApts = function simpleRouteBetweenAirports(sourceApt, destApt) {
    return new Promise(function(resolve, reject) {
        // Check cache
        var cacheKey = `[${sourceApt}]::[${destApt}]`;
        if (simpleRouteCache.has(cacheKey)) {
            console.log(`Key '${cacheKey}' was found in simpleRouteCache!`);
            resolve(simpleRouteCache.get(cacheKey).value);
        } else {
            // If cache miss, make API call
            reqOptions = {
                method: "GET",
                qs: { origin: sourceApt, destination: destApt },
                url: fxmlRoutesAptUrl,
                auth: { user: flightAwareUserName, password: flightAwareApiKey }
            };
            request(reqOptions, function(err, response, body) {
                if (err) {
                    console.log("Error calling simple route API" + err);
                    reject(err);
                } else {
                    try {
                        simpleRoute = JSON.parse(body)["RoutesBetweenAirportsResult"]["data"][0][
                            "route"
                        ];
                        simpleRouteCache.set(cacheKey, `${simpleRoute}`);
                        resolve(simpleRoute);
                    } catch (err) {
                        console.log("TypeError inside simpleRoute API");
                        reject(err);
                    }
                }
            });
        }
    });
};

const decodedRoute = function decodedRouteBetweenAirports(sourceApt, destApt, simpleRoute) {
    return new Promise(function(resolve, reject) {
        // Check cache
        cacheKey = `[${sourceApt}]::[${destApt}]::[${simpleRoute}]`;
        if (decodedRouteCache.has(cacheKey)) {
            console.log(`Key '${cacheKey}' was found in decodedRouteCache!`);
            resolve(JSON.parse(decodedRouteCache.get(cacheKey).value));
        } else {
            // Else make API call
            decodeReqOptions = {
                method: "GET",
                qs: { origin: sourceApt, destination: destApt, route: simpleRoute },
                url: fxmlDecodedRouteUrl,
                auth: { user: flightAwareUserName, password: flightAwareApiKey }
            };
            request(decodeReqOptions, function(err, response, body) {
                if (err) {
                    console.log("Error calling decode route API" + err);
                    reject(err);
                } else {
                    try {
                        allWaypoints = JSON.parse(body)["DecodeRouteResult"]["data"];
                        decodedRouteCache.set(cacheKey, JSON.stringify(allWaypoints));
                        resolve(allWaypoints);
                    } catch (err) {
                        reject(err);
                    }
                }
            });
        }
    });
};

module.exports.decodedRoute = decodedRoute;
module.exports.routeBwApts = routeBwApts;
