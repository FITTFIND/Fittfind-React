import React, { PropTypes } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { LabelText } from 'AppFonts';
import { WHITE, PRIMARY_TEXT, BORDER_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 20,
    backgroundColor: 'transparent'
  },
  row: {
    flexDirection: 'row'
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
    borderColor: BORDER_COLOR
  },
  input: {
    flex: 1,
    height: 35,
    color: WHITE,
    fontSize: 14,
    paddingVertical: 0
  },
});
export function Client({
  fullName,
  address,
  email,
  password,
  changeValue
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
            autoCorrect={false}
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
            autoCorrect={false}
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
            autoCapitalize="none"
            autoCorrect={false}
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
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={PRIMARY_TEXT}
            secureTextEntry={true}
            value={password}
          />
        </View>
      </View>
    </View>
  );
}
Client.propTypes = {
  fullName: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  changeValue: PropTypes.func.isRequired
};
