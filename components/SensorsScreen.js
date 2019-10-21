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
import SensorBar from './SensorBar';
import styles from '../assets/screenStyles.js';

export default class SensorScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  createWebsocket() {
    this.ws = new WebSocket('ws://'+global.SERVER_HOST+'/session/socket');

    // Initiate communication
    this.ws.onopen = () => {
      // connection opened
      this.ws.send('OK'); // send a message
      if(this.state.toasted) {
        ToastAndroid.show("Reconnected to data server.", ToastAndroid.SHORT);
        this.setState({toasted: 0}); // reset error message
      }
    };

    this.ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
      var sessionObject = JSON.parse(e.data)
      this.setState({
        rpm: ("RPM" in sessionObject && "value" in sessionObject["RPM"]) ? Math.round(sessionObject["RPM"]["value"]) : this.state.rpm,
        speed: ("SPEED" in sessionObject && "value" in sessionObject["SPEED"]) ? Math.round(sessionObject["SPEED"]["value"]/1.609) : this.state.speed,
        torque: ("RPM" in sessionObject && "value" in sessionObject["RPM"]) ? ((sessionObject["RPM"]["value"] > 0) ? (Math.round(333*5252/sessionObject["RPM"]["value"])*100)/100 : 0) : this.state.torque, // holy ternary batman, avoid divide by 0
        coolantTemp: ("COOLANT_TEMP" in sessionObject && "value" in sessionObject["COOLANT_TEMP"]) ? sessionObject["COOLANT_TEMP"]["value"] : this.state.coolantTemp,
      });

      // Ask for another update
      setTimeout(() => {
        this.ws.send('OK'); // send a message
      }, 50);
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
      console.log(e.reason);
      if(!this.state.toasted) {
        this.setState({toasted: 1});
        ToastAndroid.show("Failed to fetch sensor data: "+e.message, ToastAndroid.SHORT);
      }
      this.ws.close();
    };

    this.ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
      ToastAndroid.show("Websocket closed: "+e.message, ToastAndroid.SHORT);

      // Try reconnecting
      setTimeout(() => {
        this.createWebsocket();
      }, 15000);
    };
  }

	constructor(props) {
		super(props);
    
    this.createWebsocket();
    this.state = {
      rpm: "N/A",
      torque: "N/A",
      speed: "N/A",
      coolantTemp: "N/A",
      toasted: 0
    };
	}

	// Kilometers to miles
	kmToMi(km) {
		return km*0.621371;
	}

	// Convert celsius to fahrenheit
	CToF(C) {
		return (C*1.8)+32;
	}

  render() {

    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var barHeight = (height < width) ? 50 : 30;
    var styles = reloadStyles();

		return (
      <View>
        <View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
          <Text style={styles.mainTitleText}>Performance</Text>
        </View>
        <View style={[styles.largeContainer]}>
          <View style={[styles.container, styles.containerPadding, styles.colContainer]}>
            <SensorBar barHeight={barHeight} title="Speed" align="Right" val={this.state.speed} fill={(this.state.speed == "N/A") ? "0" : 100*(this.state.speed/135)} />
            <SensorBar barHeight={barHeight} title="Coolant" align="Right" val={this.state.coolantTemp} fill={(this.state.coolantTemp == "N/A") ? "0" : 100*(this.state.coolantTemp/135)} />
          </View>
          <View style={[styles.container, styles.containerPadding, styles.colContainer]}>
            <SensorBar barHeight={barHeight} title="RPM" align="Right" val={this.state.rpm} fill={(this.state.rpm == "N/A") ? "0" : 100*(this.state.rpm/8500)} />
            <SensorBar barHeight={barHeight} title="Torque" align="Right" val={this.state.torque} fill={(this.state.torque == "N/A") ? "0" : 100*(this.state.torque/7000)} />
          </View>
        </View>
      </View>
		);
  	}
}
