import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WHITE } from 'AppColors';

import styles from './styles';

export const DisconnectedError = () => (
  <View style={styles.disconnectedContainer}>
    <Text style={[styles.disconnectedText, styles.disconnectedTitle]}>An error occurred.</Text>
    <Text style={styles.disconnectedText}>
      Please check your internet connection and try again.
    </Text>
  </View>
);

export class StaticMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['top', 'bottom']).isRequired,
    distanceFromBorder: PropTypes.number,
  };

  static defaultProps = {
    distanceFromBorder: 50,
  };

  constructor(props, context) {
    super(props, context);

    const { direction, distanceFromBorder } = this.props;
    this.styles = StyleSheet.create({
      container: {
        position: 'absolute',
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        [direction]: distanceFromBorder,
        left: 0,
        right: 0,
        marginHorizontal: 20,
      },
      text: {
        color: WHITE,
        textAlign: 'center',
        paddingVertical: 5,
      },
    });
  }

  render() {
    const { message } = this.props;
    return (
      <View style={[this.styles.container]}>
        <Text style={this.styles.text}>{message}</Text>
      </View>
    );
  }
}
