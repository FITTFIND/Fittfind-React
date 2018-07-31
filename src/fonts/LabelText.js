import React, { PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { GRAY } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: GRAY,
    fontSize: 13,
    // fontFamily: 'Panton-Semibold',
  }
});

export function LabelText({ children, style, upperCase, fontSize, numberOfLines, ref }) {
  const label = upperCase ? children.toUpperCase() : children;
  return (
    <Text
      style={[styles.text, style, { fontSize }]} numberOfLines = {numberOfLines} ref={ref}
    >
      {label}
    </Text>
  );
}

LabelText.propTypes = {
  children: PropTypes.any.isRequired,
  style: PropTypes.any,
  upperCase: PropTypes.bool,
  fontSize: PropTypes.number.isRequired,
  numberOfLines: PropTypes.number.isRequired,
  ref: PropTypes.any
};

LabelText.defaultProps = {
  upperCase: false,
  fontSize: 13,
  numberOfLines: 1
};
