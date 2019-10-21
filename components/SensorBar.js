import React from 'react';
import {
	StyleSheet,
	Text,
	View,
  Dimensions
  } from 'react-native';

export default class SensorsBar extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var isVertical = height < width;

		var styles = StyleSheet.create({
		barTextContainer: {
			flexDirection: 'row',
			flex: 1,
			paddingBottom: 5,
			alignContent:"space-between",
		},
		barText: {
			fontSize: isVertical ? 20 : 16,
			color: '#fff',
			fontFamily: "orbitron-medium",
			flex: 2,
		},
		barTextValue: {
			fontSize: isVertical ? 20 : 16,
			color: '#fff',
			fontFamily: "orbitron-medium",
			flex: 1,
			textAlign: "right",
		},
		barOuterContainer: {
			flexDirection:"row",
		},
		barBorder: {
			borderColor: "#FF5722",
			borderWidth: 2,
			borderRightWidth: 0,
		}
		});


		this.state = { status: this.props.status };

		// Get lengths
		redlineLength = 15;
		fillPercent = (this.props.fill > 100) ? "100%" : Math.round(this.props.fill)+"%"; // correct any extreme values

		return (
			<View style={{flexDirection: 'row', flex: 1, paddingBottom: 20}}>
				<View style={{flexDirection: 'column', flex: 1}}>
					<View style={styles.barTextContainer}>
						<Text style={styles.barText}>{this.props.title}</Text>
						<Text style={styles.barTextValue}>{this.props.val}</Text>
					</View>
					<View style={[styles.barOuterContainer, {height: Number.parseInt(this.props.barHeight, 10)}]}>
						<View style={[styles.barBorder, {width: 100-redlineLength+"%"}]}><View style={{height: Number.parseInt(this.props.barHeight, 10)-4, width: fillPercent, backgroundColor: "#FF5722"}}></View></View>
						<View style={{ height: Number.parseInt(this.props.barHeight, 10), width: redlineLength+"%",  backgroundColor: "#FB334C"}}></View>
					</View>
				</View>
			</View>
		);
	}
}
