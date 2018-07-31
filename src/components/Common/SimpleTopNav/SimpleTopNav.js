import React, { PropTypes } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { GRAY, WHITE } from 'AppColors';
import { LabelText } from 'AppFonts';
import { NAVBAR_MARGIN_HORIZONTAL } from 'AppConstants';
// import Icon from 'react-native-vector-icons/MaterialIcons';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingLeft: 5,
    paddingRight: 5,
  },
  left: {
  },
  right: {
    // textAlign: 'right',
    // marginRight: NAVBAR_MARGIN_HORIZONTAL
  },
  imageContainer: {
    width: 10,
    resizeMode: 'contain',
    marginLeft: NAVBAR_MARGIN_HORIZONTAL
  },
  rightContainer: {
    width: 10,
    marginLeft: NAVBAR_MARGIN_HORIZONTAL
  }
});

const renderLeftSide = (label, action, sideFontSize, color) => (
  <TouchableOpacity onPress={action} >
    {
      typeof label === 'object' ? label :
        <LabelText style={[styles.left, { color }]} fontSize={sideFontSize}>
          {label}
        </LabelText>
    }
  </TouchableOpacity>
);

const renderCenter = (centerLabel, centerFontSize, color) => (
  <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
    {
      typeof centerLabel === 'object' ? centerLabel :
        <LabelText style={[styles.left, { color }]} fontSize={centerFontSize}>
          {centerLabel}
        </LabelText>
    }
  </View>
);
const renderRightSide = (label, action, sideFontSize, color) => {
  const TouchComponent = action ?  TouchableOpacity : TouchableWithoutFeedback;
  return (
    <TouchComponent onPress={action}>
      {
        typeof label === 'object' ? label :
          <LabelText style={[styles.right, { color }]} fontSize={sideFontSize}>
            {label}
          </LabelText>
      }
    </TouchComponent>
  );
}
export const SimpleTopNav = ({
  leftLabel,
  rightLabel,
  centerLabel,
  leftAction,
  rightAction,
  backgroundColor,
  sideFontSize,
  centerFontSize,
  color,
  wrapStyle,
}) => (
  <View style={[wrapStyle, styles.container, { backgroundColor }]}>
    {leftLabel ? renderLeftSide(leftLabel, leftAction, sideFontSize, color) : <View /> }
    {centerLabel ? renderCenter(centerLabel, centerFontSize, color) : <View /> }
    {rightLabel ? renderRightSide(rightLabel, rightAction, sideFontSize, color) : <View /> }
  </View>
);

SimpleTopNav.propTypes = {
  leftLabel: PropTypes.any,
  rightLabel: PropTypes.any,
  centerLabel: PropTypes.any,
  leftAction: PropTypes.func,
  rightAction: PropTypes.func,
  backgroundColor: PropTypes.string,
  sideFontSize: PropTypes.number,
  centerFontSize: PropTypes.number,
  color: PropTypes.string,
  sideWidth: PropTypes.number,
  wrapStyle: View.propTypes.style,
};

SimpleTopNav.defaultProps = {
  leftLabel: <Image source={require('img/icon_back.png')} style={styles.imageContainer} />,
  backgroundColor: GRAY,
  sideFontSize: 15,
  centerFontSize: 20,
  color: WHITE,
  sideWidth: 80,
  rightLabel: <View style={styles.rightContainer} />
};
