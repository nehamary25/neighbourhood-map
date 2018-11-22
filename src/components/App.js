import React, {Component} from 'react';
import MyLocationList from './MyLocationList';

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            'alllocations': [
                {
                    'name': "Nehru Stadium",
                    'type': "Stadium",
                    'latitude': 9.596595, 
                    'longitude': 76.526607 ,
                    'streetAddress': "Near Nagampadam Bridge, Central Road, Nagampadam, Kottayam, Kerala 686001, India"
                },
                {
                    'name': "Municipal Jubilee Park",
                    'type': "Park",
                    'latitude': 9.592999, 
                    'longitude': 76.528228,
                    'streetAddress': "Lal Bahadur Shastri Rd, Nagampadam, Kottayam, Kerala 686002"
                },
                {
                    'name': "Dhanya Remya Theater",
                    'type': "Movie Theater",
                    'latitude': 9.586935, 
                    'longitude': 76.521239,
                    'streetAddress': "SH 1, Kottayam, Kerala 686001"
                },
                {
                    'name': "CMS College Kottayam",
                    'type': "College",
                    'latitude': 9.596921, 
                    'longitude': 76.520621,
                    'streetAddress': "College Junction, C.M.S. College Road, Chungam, Kottayam, Kerala 686001"
                },
                {
                    'name': "Thirunakkara Mahadeva Temple",
                    'type': "Hindu Temple",
                    'latitude': 9.590941, 
                    'longitude': 76.518652,
                    'streetAddress': "Temple Rd, Thirunakara, Kottayam, Kerala 686001, India"
                },
                {
                    'name': "District Collectorate",
                    'type': "Government Office",
                    'latitude': 9.590877, 
                    'longitude': 76.533553,
                    'streetAddress': "Kottayam-Kumily Rd, Collectorate, Kottayam, Kerala 686001, India"
                },
                {
                    'name': "Lourdes Forane Church",
                    'type': "Catholic Church",
                    'latitude': 9.588338, 
                    'longitude': 76.533982,
                    'streetAddress': "Collectorate Junction, Collectorate, Kottayam, Kerala 686002, India"
                },
                {
                    'name': "St. Thomas Knanaya Catholic Church",
                    'type': "Church",
                    'latitude': 9.603483, 
                    'longitude': 76.516559,
                    'streetAddress': "Kottayam Medical College Bypass Rd, Malloossery, Kottayam, Kerala 686017, India"
                },
                {
                    'name': "State Bank of India",
                    'type': "Public Sector Bank",
                    'latitude': 9.579656, 
                    'longitude': 76.519477,
                    'streetAddress': "SH 1, Kodimatha, Kottayam, Kerala 686039, India"
                },
                {
                    'name': "Passport Seva Kendra",
                    'type': "Passport Office",
                    'latitude': 9.600770, 
                    'longitude': 76.530421,
                    'streetAddress': "4 Square Plaza, M C Road, Opposite Mahadeva Temple, Nagampadam, Kottayam, Kerala 686001, India"
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };

        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyB7dnczhHL_DhUqgf_5ENv_Sw4iZVoLGc0&callback=initMap')
    }

    /**
     * Initialise the map once the google map script is loaded
     */
    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: { lat: 9.591745, lng: 76.521966,},
            zoom: 15,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var alllocations = [];
        this.state.alllocations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            alllocations.push(location);
        });
        this.setState({
            'alllocations': alllocations
        });
    }

    
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    
    getMarkerInfo(marker) {
        var self = this;
        var clientId = "TPIDDHBKB2QFBWEV2MPDOFGUSWXCXGAA5IVOWEMN5ASR3UJW";
        var clientSecret = "4HB1ZZJBVXC3F0BREBPSGXYK0VZ5ALS4XRNJZSBP1JROG0DE";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        var verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                        var checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
                        var usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
                        var tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                        self.state.infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

   
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    
    render() {
        return (
            <div>
                <MyLocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;


function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}
