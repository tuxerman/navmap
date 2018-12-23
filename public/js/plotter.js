Plotter = (function() {
    var settings = {};

    return {
        init: function(routedata) {
            settings.sourceApt = routedata.src_airport;
            settings.destinationApt = routedata.dest_airport;
            settings.simpleRoute = routedata.simple_route;
            settings.points = routedata.all_wpts;

            settings.isInitState = !(settings.sourceApt) && !(settings.destinationApt);
            settings.map = null;
            $('#simple-route-txt').val('hbuhbvlisjandls');
            this.bindUIActions();
        },

        addFlightPath: function(gmap, points) {
            var linePath = [];
            var latlngbounds = new google.maps.LatLngBounds();

            var markerIcon = {
                path: 'M-24-48h48v48h-48z',
                fillColor: '#FED931',
                strokeColor: '#000',
                fillOpacity: 1,
                anchor: new google.maps.Point(0,0),
                strokeWeight: 2,
                scale: 0.25
            }

            points.forEach(function(waypoint, i) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(waypoint.latitude, waypoint.longitude),
                    title: `${waypoint.name} (${waypoint.type})`,
                    icon: markerIcon,
                    animation: google.maps.Animation.DROP,
                });

                // Add marker and record position for path
                marker.setMap(gmap);
                linePath.push(marker.getPosition());
                latlngbounds.extend(marker.getPosition());
            });

            var polyline = new google.maps.Polyline({
                strokeColor: "#34495e",
                strokeOpacity: 0.75, // opacity of line
                strokeWeight: 5
            });
            polyline.setPath(linePath);
            polyline.setMap(gmap);
            gmap.fitBounds(latlngbounds);
        },

        initMap: function() {
            settings.map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 37.681193,
                    lng: -122.280972
                },
                zoom: 10,
                mapTypeControl: false,
                streetViewControl: false,
                styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#000000"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#f2f2f2"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#e9e9e9"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#deebd8"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "gamma": "0.00"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "gamma": "0.00"
                        },
                        {
                            "saturation": "-58"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "gamma": "0.00"
                        },
                        {
                            "color": "#000000"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ff0000"
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ff0000"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ff0000"
                        },
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ff0000"
                        },
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#c5d4df"
                        },
                        {
                            "visibility": "on"
                        },
                        {
                            "lightness": "-25"
                        },
                        {
                            "saturation": "5"
                        },
                        {
                            "gamma": "4.56"
                        }
                    ]
                }
                ]   
            });
            if (!(settings.isInitState))
                this.addFlightPath(settings.map, settings.points);
        },

        bindUIActions: function() {
            settings.srcAptBox = $('#src-apt-txt');
            settings.destAptBox = $('#dest-apt-txt');
            settings.simpleRouteBox = $('#simple-route-txt');
            settings.srcAptBox.val(settings.sourceApt);
            settings.destAptBox.val(settings.destinationApt);
            settings.simpleRouteBox.val(settings.simpleRoute);
        },
    }
})();