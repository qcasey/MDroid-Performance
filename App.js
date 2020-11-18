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

import {serverHost, user, pass} from './config.json';

// Config
global.SERVER_HOST = serverHost;
global.USER = user;
global.PASS = pass;

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
    var isVertical = height < width;

    var image = isVertical ? require('./assets/images/3-rotated.png') : require('./assets/images/1.png');
    var styles = StyleSheet.create({
      container: {
        backgroundColor: '#000',
        height: hp('100%'),
        width: wp('100%'),
        maxHeight: isVertical ? 650 : 3500,
        flexDirection: isVertical ? 'row' : 'column',
      },
      swiperContainer: {
        marginTop: 30,
      },
      imageContainer: {
        width: isVertical ? wp('30%') : wp('80%'),
        height: isVertical ? hp('80%') : hp('100%'),
        marginTop: isVertical ? hp('10%') : hp('5%'),
        marginLeft: isVertical ? 0 : wp('10%'),
        color: "#FFF",
        flexDirection: 'row',
        zIndex: 2
      },
      mainLeftImage: {
        height: hp('80%'),
        width: wp('20%'),
        marginLeft: isVertical ? wp('7.5%') : 0,
        flexDirection: 'column',
        resizeMode:'contain'
      },
      mainContainer: {
        width: isVertical ? wp('70%') : wp('100%'),
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

    console.log(JSON.stringify(this.props));
    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <StatusBar barStyle="dark-content" backgroundColor="#000000" translucent={true} />
    		<View style={styles.imageContainer}>
    			<Image style={styles.mainLeftImage} source={image} />
    		</View>
        <Swiper
          index={0}
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
