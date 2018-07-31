import React, { PropTypes } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    height: 35,
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  imageContainer: {
    width: 15,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  editContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: '#353535',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3
  }
});
export function SearchBar({
  placeholderColor,
  placeholder,
  onChangeText,
  searchIcon,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.editContainer}>
        {searchIcon}
        {placeholder &&
          <TextInput
            style={{ color: placeholderColor, marginLeft: 2, flex: 1, paddingVertical: 0 }}
            fontSize={13}
            underlineColorAndroid="transparent"
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            autoCorrect={false}
            clearButtonMode="while-editing"
            onChangeText={onChangeText}
          />
        }
      </View>
    </View>
  );
}

SearchBar.propTypes = {
  searchIcon: PropTypes.any,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  placeholderColor: PropTypes.string,
};

SearchBar.defaultProps = {
  searchIcon: <Image source={require('img/icon_search.png')} style={styles.imageContainer} />,
  foregroundColor: 'transparent',
  editable: false
};
