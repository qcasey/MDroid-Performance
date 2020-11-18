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
import MQTT from 'sp-react-native-mqtt';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

export default class SensorScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
    clearTimeout(timeout);
  }

  createWebsocket() {

    let component = this;

    /* create mqtt client */
    MQTT.createClient({
      uri: global.SERVER_HOST,
      clientId: 'mdroid-performance',
      user: global.USER,
      pass: global.PASS,
      auth: true,
    }).then(function(client) {

      client.on('closed', function() {
        console.warn('mqtt.event.closed');
        client.reconnect();
      });

      client.on('error', function(msg) {
        console.warn('mqtt.event.error', msg);
        ToastAndroid.show('MQTT error: ' + msg, ToastAndroid.SHORT);
        client.reconnect();
      });

      client.on('message', function(msg) {
        const parsedTopic = (msg.topic.replace(`vehicle/session/`, "")).split('/');

        console.log(msg);

        switch(parsedTopic[0]) {
          case "RPM":
            let newRPM = Math.round(parseFloat(msg.data));
            component.setState({
              ...component.state,
              rpm: newRPM,
              torque: ((newRPM > 0) ? (Math.round(333*5252/newRPM)*100)/100 : 0)
            });
            if(component.chartName == "rpm") {
              component.appendRPM(component.state[component.chartName]);
            }
            break;
          case "SPEED":
            component.setState({
              ...component.state,
              speed: Math.round(parseFloat(msg.data)/1.609)
            });
            break;
          case "COOLANT_TEMP":
            component.setState({
              ...component.state,
              coolant: parseFloat(msg.data)
            });
            break;
          default:
            console.warn("Unhandled msg: ", msg);
            break;
        }   
      });

      client.on('connect', function() {
        console.log('connected');
        client.subscribe('vehicle/session/SPEED', 0);
        client.subscribe('vehicle/session/RPM', 0);
        client.subscribe('vehicle/session/COOLANT_TEMP', 0);

        component.setState({
          isConnected: true,
          connectingOverlayHidden: true,
        })
      });

      client.connect();
    }).catch(function(err){
      console.warn(err);
    });
  }

  appendRPM(rpm) {
    console.log(this.data);
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
      coolant: "N/A",
      toasted: 0
    };

    this.data = [0];
    this.chartName = "rpm";
    this.timeout = undefined;
  }
  
  _cycleChartData() {
    return;
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

        <TouchableOpacity onPress={() => this._cycleChartData()} style={[styles.container, styles.containerPadding, {flexDirection: 'column', paddingBottom: 15, paddingTop: 10}]}>
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
            <SensorBar barHeight={barHeight} title="Coolant" val={this.state.coolant} fill={(this.state.coolant == "N/A") ? "0" : 100*(this.state.coolant/135)} />
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
