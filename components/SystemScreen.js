import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Dimensions
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import styles from '../assets/screenStyles.js';
import ButtonGroup from './ButtonGroup.js';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MAP_STYLE = [
{
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#212121"
    }
  ]
},
{
  "elementType": "labels.icon",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#212121"
    }
  ]
},
{
  "featureType": "administrative",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "featureType": "administrative.country",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#9e9e9e"
    }
  ]
},
{
  "featureType": "administrative.land_parcel",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "administrative.locality",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#bdbdbd"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#181818"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#616161"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#1b1b1b"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#2c2c2c"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#8a8a8a"
    }
  ]
},
{
  "featureType": "road.arterial",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#373737"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#3c3c3c"
    }
  ]
},
{
  "featureType": "road.highway.controlled_access",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#4e4e4e"
    }
  ]
},
{
  "featureType": "road.local",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#616161"
    }
  ]
},
{
  "featureType": "transit",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#000000"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#3d3d3d"
    }
  ]
}
]
const LATITUDE = 33.584246;
const LONGITUDE = -117.106500;
const LATITUDE_DELTA = 0.0092;
const LONGITUDE_DELTA = 0.0021;

export default class SystemScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

	constructor(props) {
		super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      }
    };
	}

	// Sends a GET request to fetch control data
	sendCommand(command) {
		try {
			componentHandler = this;
			return fetch("http://"+global.SERVER_HOST+"/pybus/"+command)
			.then(function(response) {
				return response.json();
			})
			.then(function(sessionObject) {
        console.log(sessionObject);
			}).catch((error) => {
				console.log(error);
				ToastAndroid.show("Failed to send command.", ToastAndroid.SHORT);
			});
		}
		catch (error) {
			console.log(error);
			ToastAndroid.show("Failed to send command.", ToastAndroid.SHORT);
		}
	}

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles();

		return (
        <View>
    			<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
    				<Text style={styles.mainTitleText}>System</Text>
    			</View>
    			<View style={[styles.largeContainer, styles.colContainer]}>

          <View pointerEvents="auto">
            <MapView
              provider={PROVIDER_GOOGLE}
              initialRegion={this.state.region}
              customMapStyle={MAP_STYLE}
              style={styles.map}>
               <Marker coordinate={this.state.region} />
              </MapView>
            </View>

    			</View>
        </View>
		);
  	}
}
