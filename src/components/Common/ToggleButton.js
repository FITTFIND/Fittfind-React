import React, { PropTypes } from 'react';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import { WHITE, PRIMARY_TEXT, BORDER_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  track: {
    flex: 1,
    flexDirection: 'row'
  },
  option: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1 / 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderColor: BORDER_COLOR
  },
  optionText: {
    color: PRIMARY_TEXT,
    // fontWeight: 'bold'
  },
  selectedOptionText: {
    color: WHITE
  }
});

const getSelectedStyle = (options, value, selectedStyles, selectedStyle) => {
  const idx = options.indexOf(value);
  if (selectedStyle) {
    return selectedStyle;
  } else if (selectedStyles && selectedStyles[idx]) {
    return selectedStyles[idx];
  }
  return null;
};

const getSelectedTextStyle = (selectedTextStyle) => {
  if (selectedTextStyle) {
    return selectedTextStyle;
  }
  return styles.selectedOptionText;
};

const renderOptions = (options, value, onSelect, textStyle,
                       selectedStyles, selectedStyle, selectedTextStyle) => (
  options.map((option, index) => {
    const styleSelected = option === value ?
      getSelectedStyle(options, value, selectedStyles, selectedStyle) : null;
    const styleSelectedText = option === value ?
      getSelectedTextStyle(selectedTextStyle) : null;
    const borderStyle = index === 1 ? { borderRightWidth: 0 } : null;
    return (
      <TouchableHighlight
        style={[styles.option, styleSelected, borderStyle]}
        onPress={() => onSelect(option)}
        key={option}
      >
        <Text
          style={[styles.optionText, textStyle, styleSelectedText]}
          fontSize={15}
        >{option}</Text>
      </TouchableHighlight>
    );
  })
);

export function ToggleButton({
  style,
  trackStyle,
  options,
  value,
  onSelect,
  textStyle,
  selectedStyles,
  selectedStyle,
  selectedTextStyle
}) {
  return (
    <View style={[styles.track, style]}>
      {renderOptions(options, value, onSelect, textStyle,
        selectedStyles, selectedStyle, selectedTextStyle)}
    </View>
  );
}

ToggleButton.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  selectedStyles: PropTypes.array,
  trackStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  selectedStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  selectedTextStyle: PropTypes.object
};
