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

export default class DataScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

	constructor(props) {
		super(props);

    this.state = {
      log: "Not connected to logging server."
    };
	}

  // Sends a GET request to fetch settings data
	_refreshSettingsData() {
		try {
			componentHandler = this;
			return fetch("http://"+global.SERVER_HOST+"/status")
			.then(function(response) {
				return response.json();
			})
			.then(function(sessionObject) {
        console.log(sessionObject);
				componentHandler.setState({
					log: ("log" in sessionObject) ? sessionObject["log"] : "",
				});
			}).catch((error) => {
				console.log(error);
				if(!this.state.toasted) {
					this.setState({toasted: 1});
					ToastAndroid.show("Failed to fetch data dump.", ToastAndroid.SHORT);
				}
			});
		}
		catch (error) {
			console.log(error);
			if(!this.state.toasted) {
				this.setState({toasted: 1});
				ToastAndroid.show("Failed to fetch data dump.", ToastAndroid.SHORT);
			}
		}
	}

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles();

		return (
        <View>
    			<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
    				<Text style={styles.mainTitleText}>Data Dump</Text>
    			</View>
    			<View style={[styles.largeContainer, styles.colContainer]}>
              <Text>{this.state.log}</Text>
          </View>
        </View>
		);
  	}
}
