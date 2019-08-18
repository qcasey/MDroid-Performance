import React from 'react';
import {
	StyleSheet,
	Text,
	View,
  Button,
  Dimensions
  } from 'react-native';

import styles from '../assets/screenStyles.js';

export default class ButtonGroup extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

      buttonCount = this.props.buttons.length;

      // Setup buttons
      buttonOneTitle = this.props.buttons[0];
      buttonOneFunction = this.props.buttonFunctions[0];
      buttonTwoTitle = buttonCount > 1 ? this.props.buttons[1] : "N/A";
      buttonTwoFunction = buttonCount > 1 ? this.props.buttonFunctions[1] : "N/A";
      buttonThreeTitle = buttonCount > 2 ? this.props.buttons[2] : "N/A";
      buttonThreeFunction = buttonCount > 2 ? this.props.buttonFunctions[2] : "N/A";

      customStyles = StyleSheet.create({
        buttonOne: {
          display: 'flex',
          flex: 1,
          marginLeft: !this.props.status ? 15 : 0,
          marginRight: !this.props.status ? 15 : 0
        },
        buttonTwo: {
        	display: buttonCount < 2 ? "none" : "flex",
          flex: 1,
          marginLeft: !this.props.status ? 15 : 0,
          marginRight: !this.props.status ? 15 : 0
        },
        buttonThree: {
        	display: buttonCount < 3 ? "none" : "flex",
          flex: 1,
          marginLeft: !this.props.status ? 15 : 0,
          marginRight: !this.props.status ? 15 : 0
        }
      });

			return (
        <View style={[styles.container, styles.rowContainer]}>
          <View style={[styles.container, styles.containerPadding, styles.colContainer]}>
            <Text style={styles.secondaryTitleText}>{this.props.title}</Text>
            <View style={styles.buttonsWrapper}>
              <View style={styles.buttonsContainer, customStyles.buttonOne}>
                <Button
                    style={[styles.button]}
                    onPress={buttonOneFunction}
                    title={buttonOneTitle}
                    color={!this.props.status || this.props.status == buttonOneTitle.toUpperCase() ? global.buttonColorOn : global.buttonColorOff}
                  />
              </View>
              <View style={styles.buttonsContainer, customStyles.buttonTwo}>
                <Button
                    style={[styles.button]}
                    onPress={buttonTwoFunction}
                    title={buttonTwoTitle}
                    color={!this.props.status || this.props.status == buttonTwoTitle.toUpperCase() ? global.buttonColorOn : global.buttonColorOff}
                  />
              </View>
              <View style={styles.buttonsContainer, customStyles.buttonThree}>
                <Button
                    style={[styles.button]}
                    onPress={buttonThreeFunction}
                    title={buttonThreeTitle}
                    color={!this.props.status || this.props.status == buttonThreeTitle.toUpperCase() ? global.buttonColorOn : global.buttonColorOff}
                  />
              </View>
            </View>
          </View>
        </View>
			);
	}
}
