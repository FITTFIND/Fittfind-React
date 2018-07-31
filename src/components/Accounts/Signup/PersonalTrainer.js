import React, { PropTypes } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LabelText } from 'AppFonts';
import { WHITE, PRIMARY_TEXT, BORDER_COLOR } from 'AppColors';
import { DropdownList } from 'AppComponents';
import { SPECIALITY_ITEMS } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 20,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  formItemContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  labelItem: {
    color: PRIMARY_TEXT,
    backgroundColor: 'transparent'
  },
  inputItemContainer: {
    flex: 1.5,
    marginRight: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR,
  },
  inputDropDownContainer: {
    flex: 1.5,
    overflow: 'visible',
    marginRight: 30,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: 35,
    color: WHITE,
    fontSize: 14,
    paddingVertical: 0
  },
  labelWhiteText: {
    flex: 1,
    color: WHITE,
    lineHeight: 35,
  },
  arrowContainer: {
    width: 15,
    resizeMode: 'contain',
  }
});

export function PersonalTrainer({
  fullName,
  address,
  email,
  password,
  speciality,
  changeValue,
  showSpecialityPicker
}) {
  const fontSize = address.length > 20 ? 10.5 : 14;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.formItemContainer}>
          <LabelText style={styles.labelItem}>
            Full Name
          </LabelText>
        </View>
        <View style={styles.inputItemContainer}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Full Name"
            onChangeText={(value) => changeValue('fullName', value)}
            clearButtonMode="while-editing"
            placeholderTextColor={PRIMARY_TEXT}
            value={fullName}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.formItemContainer}>
          <LabelText style={styles.labelItem}>
            City, Country
          </LabelText>
        </View>
        <View style={styles.inputItemContainer}>
          <TextInput
            style={[styles.input, { fontSize }]}
            underlineColorAndroid="transparent"
            placeholder="Address"
            onChangeText={(value) => changeValue('address', value)}
            clearButtonMode="while-editing"
            placeholderTextColor={PRIMARY_TEXT}
            value={address}
            editable={false}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.formItemContainer}>
          <LabelText style={styles.labelItem}>
            Email
          </LabelText>
        </View>
        <View style={styles.inputItemContainer}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Email"
            onChangeText={(value) => changeValue('email', value)}
            clearButtonMode="while-editing"
            placeholderTextColor={PRIMARY_TEXT}
            value={email}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.formItemContainer}>
          <LabelText style={styles.labelItem}>
            Password
          </LabelText>
        </View>
        <View style={styles.inputItemContainer}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Password"
            onChangeText={(value) => changeValue('password', value)}
            clearButtonMode="while-editing"
            placeholderTextColor={PRIMARY_TEXT}
            secureTextEntry={true}
            value={password}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.formItemContainer}>
          <LabelText style={styles.labelItem}>
            Speciality
          </LabelText>
        </View>
        <TouchableOpacity onPress={showSpecialityPicker} style={styles.inputDropDownContainer}>
          <LabelText style={styles.labelWhiteText} fontSize={14}>
            {SPECIALITY_ITEMS[speciality]}
          </LabelText>
          <Image source={require('img/icon_arrow.png')} style={styles.arrowContainer} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
PersonalTrainer.propTypes = {
  fullName: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  speciality: PropTypes.number.isRequired,
  changeValue: PropTypes.func.isRequired,
  showSpecialityPicker: PropTypes.func.isRequired
};
