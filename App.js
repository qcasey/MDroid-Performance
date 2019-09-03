import React from 'react';
import {Dimensions, Text, StatusBar, StyleSheet, View, ScrollView, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import changeNavigationBarColor, {
  HideNavigationBar,
  ShowNavigationBar,
} from 'react-native-navigation-bar-color';
import Swiper from 'react-native-swiper';

// Screens
import SensorsScreen from './components/SensorsScreen.js';
import SystemScreen from './components/SystemScreen.js';
import DataScreen from './components/DataScreen.js';

import {serverHost} from './config.json';

// Config
global.SERVER_HOST = serverHost;

// Globals
global.buttonColorOn = "#FF5722";
global.buttonColorOff = "#000";
global.demoMode = false;

var {height, width} = Dimensions.get('window');

export default class App extends React.Component {

  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  render() {
    changeNavigationBarColor('#000000', false);

    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles;
    var image;

    if(height < width) {
      //
      // LANDSCAPE
      //
      image = require('./assets/images/3-rotated.png');
      styles = StyleSheet.create({
        container: {
        	backgroundColor: '#000',
          height: hp('100%'),
          width: wp('100%'),
          maxHeight: 650,
          flexDirection: 'row',
        },
        swiperContainer: {
          marginTop: 30,
        },
        imageContainer: {
          width: wp('30%'),
          height: hp('80%'),
        	marginTop: hp('15%'),
          color: "#FFF",
          flexDirection: 'row',
          zIndex: 2
        },
        mainLeftImage: {
        	height: hp('80%'),
          width: wp('20%'),
          marginLeft: wp('7.5%'),
        	flexDirection: 'column',
          resizeMode:'contain'
        },
        mainContainer: {
        	width: wp('70%'),
          height: hp('60%'),
        },
        viewBlocker: {
          backgroundColor: '#000000',
          width: wp('30%'),
          height: hp('100%'),
          left: 0,
          position: 'absolute'
        }
      });
    } else {
      //
      // PORTRAIT
      //
      image = require('./assets/images/1.png');
      styles = StyleSheet.create({
        container: {
          backgroundColor: '#000',
          height: hp('100%'),
          width: wp('100%'),
          flexDirection: 'column',
        },
        swiperContainer: {
          marginTop: 30
        },
        imageContainer: {
          width: wp('80%'),
          marginTop: hp('5%'),
          marginLeft: wp('10%'),
          color: "#FFF",
          flexDirection: 'row',
        },
        mainLeftImage: {
          width: wp('80%'),
          height: hp('20%'),
          flexDirection: 'column',
          resizeMode:'contain'
        },
        mainContainer: {
          width: wp('100%'),
          height: hp('60%'),
        }
      });
    }

    console.log(JSON.stringify(this.props));
    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <StatusBar barStyle="dark-content" backgroundColor="#000000" translucent={true} />
    		<View style={styles.imageContainer}>
    			<Image style={styles.mainLeftImage} source={image} />
    		</View>
        <Swiper
          index="0"
          style={styles.swiperContainer}
          showsPagination={true}
          dotColor='rgba(255,255,255,.2)'
          activeDotColor='rgba(255,255,255,1)'>
          <ScrollView removeClippedSubviews={true} style={styles.mainContainer}>
            <SensorsScreen />
          </ScrollView>
        </Swiper>
        <View style={styles.viewBlocker} />
      </View>
    );
  }
}
