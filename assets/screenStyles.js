import { StyleSheet, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

reloadStyles = function() {
  // Responsive styling
  var {height, width} = Dimensions.get('window');
  var styles;

  if(height < width) {
    styles = StyleSheet.create({
      mainContainer: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingTop: 20
      },
      container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff',
        fontFamily: "orbitron-medium",
      },
      containerPadding: {
        paddingLeft: 30,
        paddingRight: 30
      },
      containerPaddingLeft: {
        paddingLeft: 30
      },
      containerPaddingRight: {
        paddingRight: 30
      },
      alignTop: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      largeContainer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff',
        fontFamily: "orbitron-medium",
      },
      titleContainer: {
        flex: 1,
        paddingBottom: 20
      },
      colContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      },
      buttonsWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 40
      },
      buttonsContainer: {
        flex: 1
      },
      secondaryTitleText: {
        color: '#fff',
        fontFamily: "orbitron-medium",
        textAlign: 'left',
        fontSize: 16,
        marginBottom: 20,
      },
      mainTitleText: {
        fontSize: 40,
        color: '#FF5722',
        fontFamily: "orbitron-medium",
        textAlign: 'center'
      },
      auxText: {
        color: '#fff',
        fontFamily: "orbitron-medium",
        textAlign: 'left',
        fontSize: 20,
        marginBottom: 20,
      },
      map: {
        width: wp("60%"),
        height: hp("50%"),
        marginLeft: wp("5%"),
        marginBottom: hp("5%")
      }
    });
  } else {
    styles = StyleSheet.create({
      mainContainer: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingTop: 0
      },
      container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff',
        fontFamily: "orbitron-medium",
      },
      containerPadding: {
        paddingLeft: 15,
        paddingRight: 15
      },
      containerPaddingLeft: {
        paddingLeft: 30
      },
      containerPaddingRight: {
        paddingRight: 30
      },
      alignTop: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      largeContainer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff',
        fontFamily: "orbitron-medium",
      },
      titleContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 20,
        justifyContent: "center"
      },
      colContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      },
      rowContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
      },
      mainTitleText: {
        fontSize: wp('7%'),
        color: '#FF5722',
        fontFamily: "orbitron-medium",
        textAlign: 'center',
        marginBottom: 25
      },
      buttonsWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 40
      },
      buttonsContainer: {
        flex: 1
      },
      secondaryTitleText: {
        color: '#fff',
        fontFamily: "orbitron-medium",
        textAlign: 'left',
        fontSize: wp('5%'),
        marginBottom: 20
      },
      auxText: {
        color: '#fff',
        fontFamily: "orbitron-medium",
        textAlign: 'left',
        fontSize: 14,
        marginBottom: 20,
      },
      map: {
        width: wp("100%"),
        height: hp("30%"),
        marginBottom: hp("5%")
      }
    });
  }
  return styles;
}

var styles = reloadStyles();
export default styles;
