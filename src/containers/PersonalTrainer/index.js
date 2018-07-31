import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  PanResponder,
  Animated,
  Easing,
  Platform
} from 'react-native';
import {
  SimpleTopNav,
  Filter,
  PersonalTrainerANDROID,
  PersonalTrainerIOS
} from 'AppComponents';
import { NAVBAR_MARGIN_TOP, WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { connectFeathers } from 'AppConnectors';
import { DARK_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: NAVBAR_MARGIN_TOP,
    backgroundColor: DARK_COLOR,
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  navIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImage: {
    width: 20,
    resizeMode: 'contain',
  },
  menuRightItem: {
    height: 23,
    resizeMode: 'contain'
  },
  animatedContainer: {
    width: WINDOW_WIDTH * 2,
    position: 'absolute',
    left: 0,
    top: 0,
    height: WINDOW_HEIGHT
  },
  searchContainer: {
    width: WINDOW_WIDTH
  }
});

const leftNavbar = (
  <View style={styles.navIconContainer}>
    <Image source={require('img/icon_menu.png')} style={styles.menuImage} />
  </View>
);

class PersonalTrainerContainer extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    feathers: PropTypes.object,
    navigator: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      filterPosition: new Animated.Value(0),
      isShowingFilter: false,
      toDistance: 2.0,
      fromDistance: 0.5,
      isReadyFilter: false,
      price: 250,
      genderArray: [],
      speciality: 0
    };
    this.showMenu = ::this.showMenu;
    this.showFilter = ::this.showFilter;
    this.startAnimateBack = ::this.startAnimateBack;
    this.showBackAndFilter = ::this.showBackAndFilter;
    this.changeToDistnace = ::this.changeToDistnace;
    this.changeFromDistance = ::this.changeFromDistance;
    this.changeReadyFilter = ::this.changeReadyFilter;
    this.changePrice = ::this.changePrice;
    this.changeGenderArray = ::this.changeGenderArray;
    this.changeSpeciality = ::this.changeSpeciality;
    this.responder = PanResponder.create({
      onStartShouldSetResponderCapture: () => this.state.isShowingFilter,
      onStartShouldSetPanResponder: () => this.state.isShowingFilter,
      onPanResponderRelease: () => this.showFilter()
    });
    this.rightNavbar = (
      <TouchableOpacity onPress={this.showFilter}>
        <View style={styles.navIconContainer}>
          <Image source = {require('img/icon_filter.png')} style={styles.menuRightItem} />
        </View>
      </TouchableOpacity>
    );
  }

  changeSpeciality(speciality) {
    this.setState({ speciality });
  }

  changePrice(price) {
    this.setState({ price });
  }

  showFilter() {
    const { isShowingFilter } = this.state;
    if (!isShowingFilter) {
      this.startAnimate();
      this.props.disableSideBar(true);
      this.props.showSideBar(false);
    } else {
      this.startAnimateBack();
    }
    this.setState({ isShowingFilter: !isShowingFilter });
  }

  showMenu() {
    this.props.showSideBar(true);
  }

  startAnimateBack() {
    const { filterPosition } = this.state;
    Animated.timing(filterPosition, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear
    }).start();
    this.props.disableSideBar(false);
  }

  startAnimate() {
    const { filterPosition } = this.state;
    Animated.timing(filterPosition, {
      toValue: -WINDOW_WIDTH + 25,
      duration: 350,
      easing: Easing.linear
    }).start();
    this.props.disableSideBar(true);
  }
  showBackAndFilter(flag = false) {
    this.startAnimateBack();
    if (flag) {
      this.setState({ isReadyFilter: true, isShowingFilter: false });
    }
  }

  changeToDistnace(toDistance) {
    this.setState({ toDistance });
  }

  changeFromDistance(fromDistance) {
    this.setState({ fromDistance });
  }

  changeReadyFilter(isReadyFilter) {
    this.setState({ isReadyFilter });
  }

  changeGenderArray(genderArray) {
    this.setState({ genderArray });
  }

  renderPersonalTrainer() {
    const { feathers, navigator } = this.props;
    const {
      isShowingFilter,
      toDistance,
      fromDistance,
      isReadyFilter,
      price,
      genderArray,
      speciality
    } = this.state;
    if (Platform.OS === 'ios') {
      return (
        <PersonalTrainerIOS
          touchEnabled={!isShowingFilter}
          feathers={feathers}
          toDistance={toDistance}
          fromDistance={fromDistance}
          isReadyFilter={isReadyFilter}
          navigator={navigator}
          price={price}
          genderArray={genderArray}
          speciality={speciality}
          changeReadyFilter={this.changeReadyFilter}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <PersonalTrainerANDROID
          touchEnabled={!isShowingFilter}
          feathers={feathers}
          toDistance={toDistance}
          fromDistance={fromDistance}
          isReadyFilter={isReadyFilter}
          navigator={navigator}
          price={price}
          genderArray={genderArray}
          speciality={speciality}
          changeReadyFilter={this.changeReadyFilter}
        />
      );
    }
    return (<View />);
  }

  render() {
    const { filterPosition, isShowingFilter } = this.state;
    const panHandlers = !isShowingFilter ? {} : this.responder.panHandlers;
    return (
      <Animated.View style={[styles.animatedContainer, { left: filterPosition }]}>
        <View style={styles.container}>
          <View style={styles.searchContainer} { ...panHandlers}>
            <SimpleTopNav
              centerLabel="Personal Trainers"
              leftAction={this.showMenu}
              backgroundColor={DARK_COLOR}
              leftLabel={leftNavbar}
              rightLabel={this.rightNavbar}
              centerFontSize={16}
            />
            {this.renderPersonalTrainer()}
          </View>
          <Filter
            onBack={this.showBackAndFilter}
            changeToDistance={this.changeToDistnace}
            changeFromDistance={this.changeFromDistance}
            changePrice={this.changePrice}
            changeGenderArray={this.changeGenderArray}
            changeSpeciality={this.changeSpeciality}
          />
        </View>
      </Animated.View>
    );
  }
}
export default connectFeathers(PersonalTrainerContainer);
