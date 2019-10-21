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
        fuel: ("FUEL_LEVEL" in sessionObject && "value" in sessionObject["FUEL_LEVEL"]) ? sessionObject["FUEL_LEVEL"]["value"] : this.state.fuel,
        mainVoltage: ("MAIN_VOLTAGE" in sessionObject && "value" in sessionObject["MAIN_VOLTAGE"]) ? sessionObject["MAIN_VOLTAGE"]["value"] : this.state.mainVoltage,
        auxVoltage: ("AUX_VOLTAGE" in sessionObject && "value" in sessionObject["AUX_VOLTAGE"]) ? sessionObject["AUX_VOLTAGE"]["value"] : this.state.auxVoltage,
        coolantTemp: ("COOLANT_TEMP" in sessionObject && "value" in sessionObject["COOLANT_TEMP"]) ? sessionObject["COOLANT_TEMP"]["value"] : this.state.coolantTemp,
        outsideTemp:  ("OUTSIDE_TEMP" in sessionObject && "value" in sessionObject["OUTSIDE_TEMP"]) ? sessionObject["OUTSIDE_TEMP"]["value"] : this.state.outsideTemp,
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
    
    if (global.demoMode) {
      this.state = {
        rpm: "3600",
        torque: "2000",
        speed: "32",
        fuel: 850,
        mainVoltage: "13.6",
        auxVoltage: "13.6",
        coolantTemp: "83",
        outsideTemp: "104",
        jaina: "Online",
        lucio: "Online",
        toasted: 0
      };
    } else {
      this.createWebsocket();
      this.state = {
        rpm: "N/A",
        torque: "N/A",
        speed: "N/A",
        fuel: "N/A",
        mainVoltage: "N/A",
        auxVoltage: "N/A",
        coolantTemp: "N/A",
        outsideTemp: "N/A",
        toasted: 0
      };
    }
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
    var barHeight;
    var styles = reloadStyles();

    if(height < width) {
      barHeight = 50;
    } else {
      barHeight = 30;
    }

		return (
        <View>
    			<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
    				<Text style={styles.mainTitleText}>Performance</Text>
    			</View>
    			<View style={[styles.largeContainer]}>
    				<View style={[styles.container, styles.containerPadding, styles.colContainer]}>
    					<SensorBar barHeight={barHeight} title="RPM" align="Right" val={this.state.rpm} fill={(this.state.rpm == "N/A") ? "0" : 100*(this.state.rpm/8500)} />
    					<SensorBar barHeight={barHeight} title="Torque" align="Right" val={this.state.torque} fill={(this.state.torque == "N/A") ? "0" : 100*(this.state.torque/7000)} />
    					<SensorBar barHeight={barHeight} title="Speed" align="Right" val={this.state.speed} fill={(this.state.speed == "N/A") ? "0" : 100*(this.state.speed/135)} />
    				</View>
    				<View style={[styles.container, styles.containerPadding, styles.colContainer]}>
    					<SensorBar barHeight={barHeight} title="Fuel" align="Left" val={(this.state.fuel == "N/A") ? "N/A" : Math.round(100*this.state.fuel/7000)+"%"} fill={(this.state.fuel == "N/A") ? "0" : 100*(this.state.fuel/7000)} />
    					<SensorBar barHeight={barHeight} title={height < width ? "Main Voltage" : "Main Volt."} align="Left" val={(this.state.mainVoltage == "N/A") ? "N/A" : this.state.mainVoltage+"V"} fill={(this.state.mainVoltage == "N/A") ? "0" : 100*(this.state.mainVoltage/13.6)} />
    					<SensorBar barHeight={barHeight} title={height < width ? "Aux Voltage" : "Aux Volt."} align="Left" val={(this.state.auxVoltage == "N/A") ? "N/A" : this.state.auxVoltage+"V"} fill={(this.state.auxVoltage == "N/A") ? "0" : 100*(this.state.auxVoltage/13.6)} />
    				</View>
    			</View>
    			<View style={[styles.container, styles.containerPadding, styles.alignTop]}>
    				<View style={[styles.container, styles.containerPaddingRight, styles.colContainer, styles.alignTop]}>
    					<Text style={styles.auxText}>Outside Temp: {(this.state.outsideTemp == "N/A") ? "N/A" : Math.round(this.CToF(this.state.outsideTemp))+"F"}</Text>
    					<Text style={styles.auxText}>Coolant Temp: {(this.state.outsideTemp == "N/A") ? "N/A" : this.state.coolantTemp+"C"}</Text>
    				</View>
    			</View>
        </View>
		);
  	}
}
