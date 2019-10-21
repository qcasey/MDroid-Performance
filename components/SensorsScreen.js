import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import SensorBar from './SensorBar';
import styles from '../assets/screenStyles.js';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
let timeout;

export default class SensorScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
    clearTimeout(timeout);
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
      timeout = setInterval(() => {
        this.ws.send('OK'); // send a message
      }, 100);
    };

    this.ws.onmessage = (e) => {
      // a message was received
      //console.log(e.data);
      var sessionObject = JSON.parse(e.data)
      this.setState({
        rpm: ("RPM" in sessionObject && "value" in sessionObject["RPM"]) ? Math.round(sessionObject["RPM"]["value"]) : this.state.rpm,
        speed: ("SPEED" in sessionObject && "value" in sessionObject["SPEED"]) ? Math.round(sessionObject["SPEED"]["value"]/1.609) : this.state.speed,
        torque: ("RPM" in sessionObject && "value" in sessionObject["RPM"]) ? ((sessionObject["RPM"]["value"] > 0) ? (Math.round(333*5252/sessionObject["RPM"]["value"])*100)/100 : 0) : this.state.torque, // holy ternary batman, avoid divide by 0
        coolantTemp: ("COOLANT_TEMP" in sessionObject && "value" in sessionObject["COOLANT_TEMP"]) ? sessionObject["COOLANT_TEMP"]["value"] : this.state.coolantTemp,
      });

      if(this.state[this.chartName] != "N/A") {
        this.appendRPM(this.state[this.chartName]);
      }
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

  appendRPM(rpm) {
    this.data.push(rpm);
    if(this.data.length > 70) {
      this.data.shift();
    }
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

    this.data = [0];
    this.chartName = "rpm";
  }
  
  _cycleChartData() {
    if(this.chartName == "rpm") {
      this.chartName = "speed";
    } else if(this.chartName == "speed") {
      this.chartName = "torque";
    } else if(this.chartName == "torque") {
      this.chartName = "coolant";
    } else if(this.chartName == "coolant") {
      this.chartName = "rpm";
    } else {
      this.chartName = "rpm";
    }

    // Reset data
    this.data = [0];
    this.setState({toasted: 0});
    console.log(this.chartName);
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

        <TouchableOpacity onPress={() => this._cycleChartData()} style={[styles.container, styles.containerPadding, {flexDirection: 'column', paddingBottom: 25, paddingTop: 25}]}>
          <Text style={{color: "#FFF"}}>{this.chartName.toUpperCase()}</Text>
          <LineChart
            data={{
              datasets: [
                {
                  data: this.data
                }
              ]
            }}
            withInnerLines={false}
            fromZero={true}
            withShadow={true}
            withOuterLines={false}
            width={wp('62%')} // from react-native
            height={240}
            chartConfig={{
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "1",
                strokeWidth: "2",
                stroke: "#ff5722"
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </TouchableOpacity>

        <View style={[styles.largeContainer]}>
          <View style={[styles.container, styles.containerPadding, styles.colContainer]}>
            <SensorBar barHeight={barHeight} title="Speed" val={this.state.speed} fill={(this.state.speed == "N/A") ? "0" : 100*(this.state.speed/135)} />
            <SensorBar barHeight={barHeight} title="Coolant" val={this.state.coolantTemp} fill={(this.state.coolantTemp == "N/A") ? "0" : 100*(this.state.coolantTemp/135)} />
          </View>
          <View style={[styles.container, styles.containerPadding, styles.colContainer]}>
            <SensorBar barHeight={barHeight} title="RPM" val={this.state.rpm} fill={(this.state.rpm == "N/A") ? "0" : 100*(this.state.rpm/8500)} />
            <SensorBar barHeight={barHeight} title="Torque" val={this.state.torque} fill={(this.state.torque == "N/A") ? "0" : 100*(this.state.torque/7000)} />
          </View>
        </View>
      </View>
		);
  	}
}
