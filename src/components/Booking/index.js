import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { BACKGROUND_COLOR, GRAY_COLOR, BORDER_COLOR, WHITE, BLUE } from 'AppColors';
import { NAVBAR_MARGIN_HORIZONTAL, WINDOW_WIDTH, MONTH_NAMES, MENU_ITEMS } from 'AppConstants';
import { LabelText } from 'AppFonts';
import Picker from 'react-native-picker';
import { BOOKING_SERVICE, STRIPE_CHARGE_SERVICE } from 'AppServices';
import { displayTime } from 'AppUtilities';
import RNCalendarEvents from 'react-native-calendar-events';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  trainerContainer: {
    height: 85,
    flexDirection: 'row',
    marginHorizontal: NAVBAR_MARGIN_HORIZONTAL,
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR
  },
  trainerInfoContainer: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  trainerImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  trainerImage: {
    width: 56,
    height: 56,
    borderRadius: 28
  },
  trainerDetailContainer: {
    flex: 3,
    borderRightColor: BORDER_COLOR,
    borderRightWidth: 1 / 2,
    height: 40,
    marginLeft: 10
  },
  trainerNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  labelWhiteText: {
    color: WHITE
  },
  trainerLocationContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5
  },
  pinContainer: {
    justifyContent: 'center',
    marginRight: 5
  },
  iconPin: {
    width: 12,
    height: 12,
    resizeMode: 'contain'
  },
  location: {
    justifyContent: 'flex-end'
  },
  labelText: {
    color: GRAY_COLOR
  },
  distanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateTimeContainer: {
    height: 180,
    width: WINDOW_WIDTH - 45,
    alignSelf: 'center'
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  timeContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  datePickerContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 45,
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR,
  },
  timePickerContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 45,
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR,
  },
  dateLabelContainer: {
    width: WINDOW_WIDTH / 3,
    alignSelf: 'center',
    marginTop: 10,
  },
  timeLabelContainer: {
    width: WINDOW_WIDTH / 3,
    marginTop: 10,
    alignSelf: 'center'
  },
  rightAlignText: {
    alignSelf: 'flex-end',
    color: GRAY_COLOR
  },
  bookHoursContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  hourLabelContainer: {
    width: WINDOW_WIDTH / 3,
    marginTop: 10,
    alignSelf: 'center'
  },
  hourTextInputContainer: {
    marginLeft: 16,
    backgroundColor: '#1e1e1e',
    width: 48,
    height: 32,
    marginTop: 10,
    alignSelf: 'center'
  },
  bookHourText: {
    flex: 1,
    paddingVertical: 0,
    height: 32,
    fontSize: 14,
    color: GRAY_COLOR,
    textAlign: 'center'
  },
  paymentContainer: {
    height: 120,
    width: WINDOW_WIDTH - 45,
    alignSelf: 'center',
  },
  methodContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  totalAmountContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  methodLabelContainer: {
    width: WINDOW_WIDTH / 3,
    marginTop: 10,
    alignSelf: 'center'
  },
  paymentMethodContainer: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row'
  },
  paymentIconContainer: {
    width: 45,
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  payment: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR,
  },
  amountLabelContainer: {
    width: WINDOW_WIDTH / 3,
    marginTop: 10,
    alignSelf: 'center'
  },
  amountContainer: {
    marginLeft: 16,
    marginTop: 10,
    height: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1 / 2,
    borderLeftColor: BORDER_COLOR,
    paddingLeft: 12
  },
  totalAmountLabel: {
    color: WHITE,
  },
  editPaymentIcon: {
    width: 19,
    height: 19,
    resizeMode: 'contain'
  },
  bookButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: BLUE
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  datePickerTouch: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  datePickerImg: {
    width: 12,
    height: 7,
    resizeMode: 'contain',
  },
  dateImgContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  visaPaymentIcon: {
    width: 20,
    height: 14,
    resizeMode: 'contain'
  },
  visaIconContainer: {
    width: 30,
    alignSelf: 'center',
    marginTop: 10
  },
  paymentTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10
  },

});

function createCalendarDates() {
  const calendarDates = [];
  for (let year = 1950; year < 2050; year++) {
    const month = [];
    for (let monthValue = 1; monthValue < 13; monthValue++) {
      const dates = [];
      for (let k = 1; k <= new Date(year, monthValue, 0).getDate(); k++) {
        dates.push(k);
      }
      month.push({ [MONTH_NAMES[monthValue - 1]]: dates });
    }
    calendarDates.push({ [year]: month });
  }
  return calendarDates;
}

function createTime() {
  const time = [];
  for (let hour = 0; hour <= 11; hour++) {
    const minute = [];
    for (let minuteValue = 0; minuteValue < 60; minuteValue++) {
      const minuteKey = `${minuteValue < 10 ? '0' : ''}${minuteValue}`;
      minute.push({ [minuteKey]: ['AM', 'PM'] });
    }
    const hourKey = `${hour < 10 ? '0' : ''}${hour}`;
    time.push({ [hourKey]: minute });
  }
  return time;
}

export class Booking extends Component {
  static propTypes= {
    navigator: PropTypes.object,
    setCurrentScene: PropTypes.func,
    trainer: PropTypes.object,
    feathers: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      bookingHours: 2,
      bookingDate: new Date(),
      isShowDatePicker: false,
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      isShowTimePicker: false
    };
    this.changeBookHour = ::this.changeBookHour;
    this.showDatePicker = ::this.showDatePicker;
    this.setDate = ::this.setDate;
    this.showTimePicker = ::this.showTimePicker;
    this.onTimePickerConfirm = ::this.onTimePickerConfirm;
    this.onTimePickerCancel = ::this.onTimePickerCancel;
    this.onDatePickerConfirm = ::this.onDatePickerConfirm;
    this.onDatePickerCancel = ::this.onDatePickerCancel;
    this.editPayment = ::this.editPayment;
    this.onBookTrainer = ::this.onBookTrainer;
    console.info('Trainer12~~~~', props.trainer);
    this.currentUser = null;
  }

  componentDidMount() {
    this.currentUser = this.props.feathers.get('user');
    console.info('Booking~CurrentUser~~~', this.currentUser);
    // CurrencyUtils.initialize();
  }

  onTimePickerConfirm(pickedValue) {
    const { bookingDate } = this.state;
    this.setState({ isShowTimePicker: false });
    console.log('date', pickedValue);
    const tempDate = bookingDate;
    if (pickedValue[2] === 'AM') {
      tempDate.setHours(pickedValue[0]);
      tempDate.setMinutes(pickedValue[1]);
    } else if (pickedValue[2] === 'PM') {
      tempDate.setHours(parseInt(pickedValue[0], 10) + 12);
      tempDate.setMinutes(pickedValue[1]);
    }
    this.setState({ bookingDate: tempDate });
  }

  onTimePickerCancel() {
    this.setState({ isShowTimePicker: false });
  }

  onDatePickerConfirm(pickedValue) {
    this.setState({ isShowDatePicker: false });
    this.setDate(pickedValue);
  }

  onDatePickerCancel() {
    this.setState({ isShowDatePicker: false });
  }

  onBookTrainer() {
    const { feathers, setCurrentScene, navigator, trainer } = this.props;
    const { bookingDate, bookingHours } = this.state;
    this.currentUser = feathers.get('user');
    if (trainer.payment === null) {
      Alert.alert('Sorry', `The trainer hasn't registered his financial account yet`);
    } else if (this.currentUser.payment === null) {
      Alert.alert('Sorry', `Please register your financial account`);
    } else {
      // //////////////////////////////
      const trainerId = trainer._id;
      const bookingService = feathers.service(BOOKING_SERVICE);
      const data = {
        bookingDate,
        bookingHours,
        trainerId
      };
      console.info('currentUser', this.currentUser);
      const bookingEndDate = new Date();
      const miliTime = bookingDate.getTime() + bookingHours * 3600000;
      bookingEndDate.setTime(miliTime);
      const strBookingDate = bookingDate.toISOString();
      const strBookingEndDate = bookingEndDate.toISOString();
      bookingService.create(data)
      .then((res) => {
        console.info('Booking Result', res);
        const stripeChargeService = feathers.service(STRIPE_CHARGE_SERVICE);
        const sender = {
          _id: this.currentUser._id,
          name: this.currentUser.name,
          payment: this.currentUser.payment,
          androidDeviceToken: this.currentUser.androidDeviceToken,
          iPhoneDeviceToken: this.currentUser.iPhoneDeviceToken
        };
        const receiver = {
          _id: trainer._id,
          name: trainer.name,
          payment: trainer.payment,
          androidDeviceToken: trainer.androidDeviceToken,
          iPhoneDeviceToken: trainer.iPhoneDeviceToken
        };
        const amount = bookingHours * trainer.trainer.price * 100;
        // amount = Math.trunc(CurrencyUtils.convertCurrency(amount, 'USD', 'POUND'));
        const chargeData = {
          sender,
          receiver,
          amount,
          currency: 'gbp',
          customer: this.currentUser.payment.customerId
        };
        stripeChargeService.create(chargeData)
          .then(result => {
            console.info('successfully charged', result);
            setCurrentScene(MENU_ITEMS.indexOf('Schedule'));
            RNCalendarEvents.authorizeEventStore()
            .then(status => {
              if (status === 'authorized') {
                RNCalendarEvents.saveEvent('Booking', {
                  // location: 'location',
                  notes: 'notes',
                  startDate: strBookingDate,
                  endDate: strBookingEndDate
                })
                .then(resultId => {
                  console.info('CalendarId', resultId);
                  navigator.resetTo('ScheduleScene');
                })
                .catch(error => {
                  console.info(error);
                  // handle error
                });
              }
            })
            .catch(error => {
              console.info('error', error);
            });
          })
          .catch(e => {
            console.info('error charge', e);
          });
      })
      .catch(e => console.info('Error Booking', e));
    }
  }

  setDate(pickedValue) {
    const { bookingDate } = this.state;
    const tempDate = bookingDate;
    tempDate.setDate(pickedValue[2]);
    tempDate.setFullYear(pickedValue[0]);
    tempDate.setMonth(MONTH_NAMES.indexOf(pickedValue[1]));
    this.setState({ bookingDate: tempDate });
  }

  editPayment() {
    this.props.navigator.push('PaymentScene');
  }

  changeBookHour(bookingHours) {
    this.setState({ bookingHours });
  }

  showHours(date, type) {
    if (type === 'hour') {
      let currentHour = date.getHours();
      currentHour = currentHour % 12;
      if (currentHour) {
        currentHour =
          date.getHours() % 12 < 10 && date.getHours() !== 0 ? `0${currentHour}` : currentHour;
      } else {
        currentHour = '00';
      }
      return currentHour;
    } else if (type === 'minute') {
      let currentMinute = date.getMinutes();
      currentMinute = currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`;
      return currentMinute;
    }
    return '';
  }

  showDatePicker() {
    const { isShowTimePicker, isShowDatePicker, bookingDate } = this.state;
    if (isShowTimePicker) {
      this.setState({ isShowTimePicker: false });
    }
    if (!isShowDatePicker) {
      Picker.init({
        pickerData: createCalendarDates(),
        selectedValue: [
          `${bookingDate.getFullYear()}`,
          `${MONTH_NAMES[bookingDate.getMonth()]}`,
          `${bookingDate.getDate()}`],
        onPickerConfirm: (pickedValue) => this.onDatePickerConfirm(pickedValue),
        onPickerCancel: () => this.onDatePickerCancel(),
        pickerConfirmBtnColor: [255, 255, 255, 255],
        pickerCancelBtnColor: [255, 255, 255, 255],
        pickerBg: [0, 0, 0, 255],
        pickerToolBarBg: [0, 0, 0, 255],
        borderTopColor: [255, 250, 0, 255],
        pickerConfirmBtnText: 'Done',
        pickerCancelBtnText: 'Cancel',
        pickerTitleText: ''
      });
      Picker.show();
      this.setState({ isShowDatePicker: true });
    }
  }

  showTimePicker() {
    const { isShowTimePicker, isShowDatePicker, bookingDate } = this.state;
    if (isShowDatePicker) {
      this.setState({ isShowDatePicker: false });
    }
    if (!isShowTimePicker) {
      Picker.init({
        pickerData: createTime(),
        selectedValue: [
          `${this.showHours(bookingDate, 'hour')}`,
          `${this.showHours(bookingDate, 'minute')}`,
          `${bookingDate.getHours() >= 12 ? 'PM' : 'AM'}`],
        onPickerConfirm: (pickedValue) => this.onTimePickerConfirm(pickedValue),
        onPickerCancel: () => this.onTimePickerCancel(),
        pickerConfirmBtnColor: [255, 255, 255, 255],
        pickerCancelBtnColor: [255, 255, 255, 255],
        pickerBg: [0, 0, 0, 255],
        pickerToolBarBg: [0, 0, 0, 255],
        borderTopColor: [255, 250, 0, 255],
        pickerConfirmBtnText: 'Done',
        pickerCancelBtnText: 'Cancel',
        pickerTitleText: ''
      });
      Picker.show();
      this.setState({ isShowTimePicker: true });
    }
  }

  renderTrainerInfo() {
    const { trainer } = this.props;
    return (
      <View style={styles.trainerContainer}>
        <View style={styles.trainerInfoContainer}>
          <View style={styles.trainerImageContainer}>
            <Image
              source={ trainer.avatarUrl === '' ?
               require('img/temp_trainer_image.png') : { uri: trainer.avatarUrl }
                }
              style={styles.trainerImage}
            />
          </View>
          <View style={styles.trainerDetailContainer}>
            <View style={styles.trainerNameContainer}>
              <LabelText style={styles.labelWhiteText} fontSize={13}>
                {trainer.name}
              </LabelText>
            </View>
            <View style={styles.trainerLocationContainer}>
              <View style={styles.pinContainer}>
                <Image
                  source={require('img/icon_pin.png')}
                  style={styles.iconPin}
                />
              </View>
              <View style={styles.location}>
                <LabelText
                  style={styles.labelText}
                  fontSize={trainer.address.length > 25 ? 10 : 13}
                >
                  {trainer.address}
                </LabelText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <LabelText style={styles.labelWhiteText} fontSize={15}>
            {trainer.distance}
          </LabelText>
          <LabelText style={[styles.labelText, { marginTop: 5 }]} fontSize={13}>
            Km
          </LabelText>
        </View>
      </View>
    );
  }

  renderDateAndTime() {
    const { bookingHours, bookingDate } = this.state;
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    return (
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateContainer}>
          <View style={styles.dateLabelContainer}>
            <LabelText style={styles.rightAlignText} fontSize={13}>
              Select date
            </LabelText>
          </View>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={styles.datePickerTouch} onPress={() => this.showDatePicker()}>
              <LabelText style={styles.labelText} fontSize={13}>
                {`${bookingDate.getDate()} ${monthNames[bookingDate.getMonth()]} ${bookingDate.getFullYear()}`}
              </LabelText>
              <View style={styles.dateImgContainer}>
                <Image source={require('img/icon_arrow.png')} style={styles.datePickerImg} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.timeLabelContainer}>
            <LabelText style={styles.rightAlignText} fontSize={13}>
              Select time
            </LabelText>
          </View>
          <View style={styles.timePickerContainer}>
            <TouchableOpacity style={styles.datePickerTouch} onPress={() => this.showTimePicker()}>
              <LabelText style={styles.labelText} fontSize={13}>
                {displayTime(bookingDate)}
              </LabelText>
              <View style={styles.dateImgContainer}>
                <Image source={require('img/icon_arrow.png')} style={styles.datePickerImg} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bookHoursContainer}>
          <View style={styles.hourLabelContainer}>
            <LabelText style={styles.rightAlignText} fontSize={13}>
              Hours
            </LabelText>
          </View>
          <View style={styles.hourTextInputContainer}>
            <TextInput
              style={styles.bookHourText}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              placeholderTextColor={GRAY_COLOR}
              onChangeText={this.changeBookHour}
              maxLength={2}
              keyboardType="numeric"
              value={bookingHours.toString()}
            />
          </View>
        </View>
      </View>
    );
  }
  renderPayment() {
    const { bookingHours } = this.state;
    const { trainer } = this.props;
    return (
      <View style={styles.paymentContainer}>
        <View style={styles.methodContainer}>
          <View style={styles.methodLabelContainer}>
            <LabelText style={styles.rightAlignText} fontSize={13}>
              Payment method
            </LabelText>
          </View>
          <View style={styles.paymentMethodContainer}>
            <View style={styles.payment}>
              <View style={styles.visaIconContainer}>
                <Image source={require('img/icon_visa.png')} style={styles.visaPaymentIcon} />
              </View>
              <View style={styles.paymentTextContainer}>
                <LabelText style={styles.labelText} fontSize={10}>
                  1234 **** **** 1234
                </LabelText>
              </View>
            </View>
            <View style={styles.paymentIconContainer}>
              <TouchableOpacity onPress={() => this.editPayment()}>
                <Image
                  source={require('img/icon_edit_payment.png')}
                  style={styles.editPaymentIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.totalAmountContainer}>
          <View style={styles.amountLabelContainer}>
            <LabelText style={styles.rightAlignText} fontSize={13}>
              Total Amount
            </LabelText>
          </View>
          <View style={styles.amountContainer}>
            <LabelText style={styles.totalAmountLabel} fontSize={13}>
              {`£${bookingHours * trainer.trainer.price}`}
            </LabelText>
          </View>
        </View>
      </View>
    );
  }
  renderBookButton() {
    return (
      <TouchableOpacity style={styles.bookButtonContainer} onPress={() => this.onBookTrainer()}>
        <View style={styles.subContainer}>
          <LabelText style={styles.labelWhiteText} fontSize={15}>
            Book Trainer
          </LabelText>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderTrainerInfo()}
        {this.renderDateAndTime()}
        {this.renderPayment()}
        {this.renderBookButton() }
      </View>
    );
  }
}
