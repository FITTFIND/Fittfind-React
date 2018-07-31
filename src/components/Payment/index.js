import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { BACKGROUND_COLOR, GRAY_COLOR, BORDER_COLOR, BLUE, WHITE } from 'AppColors';
import { LabelText } from 'AppFonts';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import CountryPicker from 'react-native-country-picker-modal';
import { STRIPE_TOKEN_SERVICE } from 'AppServices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  cardContainer: {
    height: 60,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    width: WINDOW_WIDTH / 3,
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 15,
  },
  labelText: {
    color: GRAY_COLOR
  },
  cardInputContainer: {
    width: WINDOW_WIDTH / 2,
    paddingHorizontal: 5,
    marginLeft: 15,
    marginTop: 15,
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderBottomWidth: 2 / 2,
    borderBottomColor: BORDER_COLOR,
  },
  cardNum: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    color: GRAY_COLOR,
    textAlign: 'center',
  },
  subContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expireMonthCon: {
    width: 50,
    alignSelf: 'flex-end',
    borderBottomWidth: 2 / 2,
    borderBottomColor: BORDER_COLOR,
  },
  expireLabel: {
    flex: 1,
    fontSize: 15,
    height: 20,
    paddingVertical: 0,
    color: GRAY_COLOR,
    textAlign: 'center',
  },
  expireInputContainer: {
    width: WINDOW_WIDTH / 2,
    marginLeft: 15,
    marginTop: 15,
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  expireYearContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  yearContainer: {
    width: 90,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  yearInputContainer: {
    flex: 1,
    alignSelf: 'stretch',
    borderBottomWidth: 2 / 2,
    borderBottomColor: BORDER_COLOR,
    marginLeft: 15
  },
  labelYearText: {
    color: GRAY_COLOR,
  },
  yearLabelContainer: {
    width: 20,
    alignSelf: 'center',
  },
  cvcInputContainer: {
    width: 50,
    alignSelf: 'stretch',
    borderBottomWidth: 2 / 2,
    borderBottomColor: BORDER_COLOR,
    marginLeft: 15,
    marginTop: 15
  },
  countryPickerContainer: {
    width: WINDOW_WIDTH / 2,
    paddingHorizontal: 5,
    marginLeft: 15,
    marginTop: 15,
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderBottomWidth: 2 / 2,
    borderBottomColor: BORDER_COLOR,
    alignItems: 'center'
  },
  saveContainer: {
    marginTop: 45,
    width: WINDOW_WIDTH / 2,
    height: WINDOW_HEIGHT / 14,
    backgroundColor: BLUE,
    alignSelf: 'center',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelWhiteText: {
    color: WHITE
  },
  touchContainer: {
    flex: 1,
    alignSelf: 'stretch',

  },
  iconCheck: {
    width: 17,
    height: 12,
    resizeMode: 'contain',
    marginLeft: 12
  },
  saveSubCon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});

export class Payment extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      cardNum: '4242 4242 4242 4242',
      cca2: 'US',
      country: 'United States',
      buttonTitle: 'Save Changes',
      expireMonth: '12',
      expireYear: '2020',
      cardCVC: '123',
      isTouched: false,
    };
    this.changeCardNum = ::this.changeCardNum;
    this.changeCountry = ::this.changeCountry;
    this.changeFieldValue = ::this.changeFieldValue;
    this.pressSaveChange = ::this.pressSaveChange;
    this.prevCardNum = '';
    this.currentUser = null;
  }

  changeCountry(value) {
    this.setState({ country: value.name, cca2: value.cca2 });
  }

  changeCardNum(cardNumString) {
    let cardNum = cardNumString;
    let cardNumTemp = cardNum.split(' ').join('');
    const prevNumTemp = this.prevCardNum.split(' ').join('');
    let index = 0;
    if (cardNumTemp !== prevNumTemp) {
      cardNum = '';
      for (let i = 0; i < cardNumTemp.length; i++) {
        if (i % 4 === 3 && i !== 15) {
          cardNum = `${cardNum}${cardNumTemp[i]} `;
        } else {
          cardNum = `${cardNum}${cardNumTemp[i]}`;
        }
      }
    } else {
      for (index = 0; index < cardNumString.length; index++) {
        if (cardNumString[index] !== this.prevCardNum[index]) {
          cardNumTemp = cardNumString.substr(0, index - 1) + cardNumString.substr(index);
          cardNumTemp = cardNumTemp.split(' ').join('');
          break;
        }
        if (index === cardNumString.length - 1) {
          cardNumTemp = cardNumString.substr(0, cardNumString.length - 1);
          cardNumTemp = cardNumTemp.split(' ').join('');
        }
      }
      cardNum = '';
      for (let i = 0; i < cardNumTemp.length; i++) {
        if (i % 4 === 3 && i !== 15) {
          cardNum = `${cardNum}${cardNumTemp[i]} `;
        } else {
          cardNum = `${cardNum}${cardNumTemp[i]}`;
        }
      }
    }
    this.setState({ cardNum });
    this.prevCardNum = cardNum;
  }

  showCheckIcon() {
    return (
      <Image source={require('img/icon_check.png')} style={styles.iconCheck} />
    );
  }

  pressSaveChange() {
    this.setState({ isTouched: true });
    const { feathers } = this.props;
    const { expireMonth, expireYear, cardCVC, cardNum, buttonTitle, cca2 } = this.state;
    if (buttonTitle !== 'Done') {
      this.currentUser = feathers.get('user');
      const tokenService = feathers.service(STRIPE_TOKEN_SERVICE);
      const card = {
        number: cardNum,
        exp_month: expireMonth,
        exp_year: expireYear,
        cvc: cardCVC,
        userId: this.currentUser._id,
        country: cca2,
        email: this.currentUser.email,
      };
      tokenService.create({ card })
      .then(result => {
        console.info('currentUser', this.currentUser);
        this.currentUser.payment = result.updatedUser.payment;
        console.info('updatedUser', this.currentUser);
        feathers.set('user', this.currentUser);
        this.setState({ buttonTitle: 'Done' });
      })
      .catch(e => console.info('error creating stripe token', e));
    }
  }

  changeFieldValue(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  renderExpireContainer() {
    const { expireMonth, expireYear } = this.state;
    return (
      <View style={styles.subContainer}>
        <View style={styles.labelContainer}>
          <LabelText style={styles.labelText} fontSize={15}>
            MM
          </LabelText>
        </View>
        <View style={styles.expireInputContainer}>
          <View style={styles.expireMonthCon}>
            <TextInput
              ref= "card"
              style={styles.expireLabel}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              placeholderTextColor={GRAY_COLOR}
              onChangeText={(text) => this.changeFieldValue('expireMonth', text)}
              maxLength={2}
              keyboardType="numeric"
              value={expireMonth}
            />
          </View>
          <View style={styles.expireYearContainer}>
            <View style={styles.yearContainer}>
              <View style={styles.yearLabelContainer}>
                <LabelText style={styles.labelYearText} fontSize={15}>
                  YY
                </LabelText>
              </View>
              <View style={styles.yearInputContainer}>
                <TextInput
                  ref= "card"
                  style={styles.expireLabel}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  placeholderTextColor={GRAY_COLOR}
                  onChangeText={(text) => this.changeFieldValue('expireYear', text)}
                  maxLength={4}
                  keyboardType="numeric"
                  value={expireYear}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderCVC() {
    const { cardCVC } = this.state;
    return (
      <View style={styles.subContainer}>
        <View style={styles.labelContainer}>
          <LabelText style={styles.labelText} fontSize={15}>
            CVC
          </LabelText>
        </View>
        <View style={styles.cvcInputContainer}>
          <TextInput
            ref= "card"
            style={styles.expireLabel}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            placeholderTextColor={GRAY_COLOR}
            onChangeText={(text) => this.changeFieldValue('cardCVC', text)}
            maxLength={3}
            keyboardType="numeric"
            value={cardCVC}
          />
        </View>
      </View>
    );
  }

  renderCardNumber() {
    const { cardNum } = this.state;
    return (
      <View style={styles.cardContainer}>
        <View style={styles.labelContainer}>
          <LabelText style={styles.labelText} fontSize={15}>
            Card Number
          </LabelText>
        </View>
        <View style={styles.cardInputContainer}>
          <TextInput
            ref= "card"
            style={styles.cardNum}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            placeholderTextColor={GRAY_COLOR}
            onChangeText={(text) => this.changeCardNum(text)}
            maxLength={19}
            keyboardType="numeric"
            value={cardNum}
          />
        </View>
      </View>
    );
  }

  renderCountry() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.labelContainer}>
          <LabelText style={styles.labelText} fontSize={15}>
            Country
          </LabelText>
        </View>
        <View style={styles.countryPickerContainer}>
          <CountryPicker
            onChange={this.changeCountry}
            cca2={this.state.cca2}
            translation="eng"
            closeable={true}
          />
        </View>
      </View>
    );
  }

  renderSave() {
    const { buttonTitle, isTouched } = this.state;
    const ComponentView = isTouched ? View : TouchableOpacity;
    return (
        <View style={styles.saveContainer}>
          <ComponentView style={styles.touchContainer} onPress={this.pressSaveChange}>
            <View style={styles.saveSubCon}>
              <LabelText style={styles.labelWhiteText} fontSize={15}>
                {buttonTitle}
              </LabelText>
              {buttonTitle === 'Done' ? this.showCheckIcon() : <View />}
              </View>
          </ComponentView>
        </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCardNumber()}
        {this.renderExpireContainer()}
        {this.renderCVC()}
        {this.renderCountry()}
        {this.renderSave()}
      </View>
    );
  }
}
