import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { WINDOW_WIDTH, NAVBAR_MARGIN_TOP, SPECIALITY_ITEMS } from 'AppConstants';
import { LabelText } from 'AppFonts';
import { WHITE, DARK_COLOR, BLUE, GRAY_COLOR, BACKGROUND_COLOR } from 'AppColors';
import { Slider, CheckBox, ModalPicker } from 'AppComponents';

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK_COLOR,
    width: WINDOW_WIDTH - 25,
    position: 'absolute',
    paddingTop: NAVBAR_MARGIN_TOP,
    left: WINDOW_WIDTH,
    top: 0,
    bottom: 0
  },
  headerContainer: {
    height: 40,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  labelTitle: {
    color: WHITE,
    marginLeft: WINDOW_WIDTH / 2 - 37
  },
  labelWhiteText: {
    flex: 1,
    color: WHITE,
  },
  distanceContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1 / 2,
    borderBottomColor: '#252525',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: BACKGROUND_COLOR
  },
  labelContainer: {
    width: 105,
    justifyContent: 'center'
  },
  labelText: {
    color: GRAY_COLOR
  },
  mileContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 32,
    alignItems: 'stretch',
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fromContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  toContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  subContainer2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 14,
    flex: 1,
    color: WHITE,
    padding: 0,
    alignSelf: 'stretch',
  },
  priceLabelContainer: {
    width: 65,
  },
  priceSliderContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  maxPriceContainer: {
    width: 30,
    height: 40,
    alignSelf: 'flex-end',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sliderContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 5
  },
  minPriceContainer: {
    width: 30,
    height: 40,
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  thumbStyle: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: GRAY_COLOR,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
  trackStyle: {
    height: 2,
    borderRadius: 2
  },
  subPriceLabelContainer: {
    flex: 1,
    alignItems: 'center'

  },
  subSliderContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  goalLabelContainer: {
    flex: 1,
  },
  goalDropListContainer: {
    flex: 1.5,
    marginRight: 30,
    paddingVertical: 10,
    flexDirection: 'row'
  },
  searchButtonContainer: {
    marginTop: 70,
    flex: 1,
  },
  searchButton: {
    flex: 1,
    height: 45,
    backgroundColor: BLUE,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 25
  },
  searchLabelText: {
    color: WHITE,
    alignSelf: 'center',
  },
  arrowContainer: {
    width: 15,
    resizeMode: 'contain',
  }
});

export class Filter extends Component {
  static propTypes = {
    onBack: PropTypes.func,
    changeToDistance: PropTypes.func,
    changeFromDistance: PropTypes.func,
    changePrice: PropTypes.func,
    changeGenderArray: PropTypes.func,
    changeSpeciality: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      fromDistance: 0.5,
      toDistance: 2.0,
      price: 250,
      maleGender: false,
      femaleGender: false,
      noneGender: false,
      genderArray: [],
      goal: 0,
      goalValue: 'Muscle gain',
      isShowGoalPicker: false,
    };
    this.changeStartMile = ::this.changeStartMile;
    this.changeToMile = ::this.changeToMile;
    this.changePrice = ::this.changePrice;
    this.setMale = ::this.setMale;
    this.setFemale = ::this.setFemale;
    this.setNone = ::this.setNone;
    this.setGoal = ::this.setGoal;
    this.search = ::this.search;
    this.isShowGoalPicker = ::this.isShowGoalPicker;
    this.showGoalPicker = ::this.showGoalPicker;
  }

  setMale(bool) {
    const { genderArray } = this.state;
    if (bool) {
      genderArray.push('Male');
      const genderAry = genderArray.concat();
      this.setState({ genderArray: genderAry, maleGender: bool, noneGender: false });
    } else {
      const index = genderArray.indexOf('Male');
      if (index > -1) {
        genderArray.splice(index, 1);
        const genderAry = genderArray.concat();
        this.setState({ genderArray: genderAry, maleGender: bool });
      }
    }
    this.props.changeGenderArray(genderArray);
  }

  setFemale(bool) {
    const { genderArray } = this.state;
    if (bool) {
      genderArray.push('Female');
      const genderAry = genderArray.concat();
      this.setState({ genderArray: genderAry, femaleGender: bool, noneGender: false });
    } else {
      const index = genderArray.indexOf('Female');
      if (index > -1) {
        genderArray.splice(index, 1);
        const genderAry = genderArray.concat();
        this.setState({ genderArray: genderAry, femaleGender: bool });
      }
    }
    this.props.changeGenderArray(genderArray);
  }

  setNone(bool) { // this may be an issue need to be fixed in the future.
    const { genderArray } = this.state;
    if (bool) {
      this.setState({
        genderArray: [],
        maleGender: false,
        femaleGender: false,
        noneGender: true
      });
    } else {
      const index = genderArray.indexOf('None');
      if (index > -1) {
        genderArray.splice(index, 1);
        const genderAry = genderArray.concat();
        this.setState({ genderArray: genderAry, noneGender: false });
      }
    }
    this.props.changeGenderArray(genderArray);
  }

  setGoal(value) {
    this.setState({ goal: value.key, goalValue: SPECIALITY_ITEMS[value.key] });
    this.props.changeSpeciality(value.key);
  }

  changeStartMile(fromDistance) {
    this.setState({ fromDistance: parseFloat(fromDistance) });
    this.props.changeFromDistance(parseFloat(fromDistance));
  }

  changeToMile(toDistance) {
    this.setState({ toDistance: parseFloat(toDistance) });
    this.props.changeToDistance(parseFloat(toDistance));
  }

  changePrice(price) {
    this.setState({ price });
    this.props.changePrice(price);
  }

  search() {
    this.props.onBack(true);
  }

  isShowGoalPicker(isHideGoalPicker) {
    this.setState({ isShowGoalPicker: !isHideGoalPicker });
  }

  showGoalPicker() {
    const { isShowGoalPicker } = this.state;
    if (isShowGoalPicker) {
      this.setState({ isShowGoalPicker: false });
    } else {
      this.setState({ isShowGoalPicker: true });
    }
  }

  renderDistance() {
    const { fromDistance, toDistance } = this.state;
    return (
      <View style={styles.distanceContainer}>
        <View style={styles.labelContainer}>
          <LabelText style={styles.labelText} fontSize={15.5}>
            Distance
          </LabelText>
        </View>
        <View style={styles.mileContainer}>
          <View style={styles.fromContainer}>
            <TextInput
              style={styles.inputText}
              underlineColorAndroid="transparent"
              onChangeText={this.changeStartMile}
              keyboardType="numeric"
              number={fromDistance}
              placeholder = "0.5"
              placeholderTextColor = {WHITE}
              textAlign = "center"
            />
          </View>
          <View style={styles.subContainer2}>
            <LabelText style={styles.labelText} fontSize={15.5}>
              To
            </LabelText>
          </View>
          <View style={styles.toContainer}>
            <TextInput
              style={styles.inputText}
              underlineColorAndroid="transparent"
              onChangeText={this.changeToMile}
              keyboardType="numeric"
              number = {toDistance}
              textAlign = "center"
              placeholder = "2.0"
              placeholderTextColor = {WHITE}
            />
          </View>
          <View style={styles.subContainer}>
            <LabelText style={styles.labelText} fontSize={15.5}>
              Km
            </LabelText>
          </View>
        </View>
      </View>
    );
  }

  renderPrice() {
    const { price } = this.state;
    return (
      <View style={styles.distanceContainer}>
        <View style={styles.priceLabelContainer}>
          <LabelText style={styles.labelText} fontSize={15.5}>
            Price
          </LabelText>
        </View>
        <View style={styles.priceSliderContainer}>
          <View style={styles.minPriceContainer}>
            <LabelText style={styles.labelText} fontSize={10}>
              £ 0
            </LabelText>
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.subPriceLabelContainer}>
              <LabelText style={styles.labelWhiteText} fontSize={10}>
                £ {parseInt(price, 10)}
              </LabelText>
            </View>
            <View style={styles.subSliderContainer}>
              <Slider
                trackStyle={styles.trackStyle}
                maximumValue={500}
                minimumTrackTintColor={"#065791"}
                maximumTrackTintColor={"#065791"}
                minimumValue={0}
                onValueChange={this.changePrice}
                thumbStyle={styles.thumbStyle}
                value={250}
              />
            </View>

          </View>
          <View style={styles.maxPriceContainer}>
            <LabelText style={styles.labelText} fontSize={10}>
              £ 500
            </LabelText>
          </View>
        </View>
      </View>
    );
  }

  renderGender() {
    const { maleGender, femaleGender, noneGender } = this.state;
    return (
      <View style={styles.distanceContainer}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <CheckBox label="Male" onChange={this.setMale} checked={maleGender} />
        </View>
        <View style={{ flex: 1.5 }}>
          <CheckBox
            label="Female"
            onChange={this.setFemale}
            checked={femaleGender}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CheckBox
            label="None"
            onChange={this.setNone}
            checked={noneGender}
          />
        </View>
      </View>
    );
  }

  renderGoals() {
    const { goalValue } = this.state;
    return (
      <View style={styles.distanceContainer}>
        <View style={styles.goalLabelContainer}>
          <LabelText style={styles.labelText} fontSize={15.5}>
            Goals
          </LabelText>
        </View>
        <TouchableOpacity style={styles.goalDropListContainer} onPress={this.showGoalPicker}>
          <LabelText style={styles.labelWhiteText} fontSize={15.5}>
            {goalValue}
          </LabelText>
          <Image source={require('img/icon_arrow.png')} style={styles.arrowContainer} />
        </TouchableOpacity>
      </View>
    );
  }

  renderGoalPicker() {
    let index = 0;
    const data = [
      { key: index++, label: 'Muscle gain' },
      { key: index++, label: 'Weight loss' },
      { key: index, label: 'Toning' }
    ];
    return (
      <ModalPicker
        data={data}
        initValue="Select something yummy!"
        onChange={this.setGoal}
        isClosed={this.isShowGoalPicker}
      />
    );
  }

  render() {
    const { isShowGoalPicker } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <LabelText style={styles.labelTitle} fontSize={16}>
            Filters
          </LabelText>
        </View>
        <View style={styles.contentContainer}>
          {this.renderDistance()}
          {this.renderPrice()}
          {this.renderGender()}
          {this.renderGoals()}
          <View style={styles.searchButtonContainer}>
            <TouchableOpacity onPress={this.search}>
              <View style={styles.searchButton}>
                <LabelText style={styles.searchLabelText} fontSize={16}>
                  Search
                </LabelText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {isShowGoalPicker && this.renderGoalPicker()}
      </View>
    );
  }
}
