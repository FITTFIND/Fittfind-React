import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ToggleButton } from 'AppComponents';
import { WHITE, BACKGROUND_COLOR } from 'AppColors';
import { Upcoming } from './upcoming';
import { History } from './history';
import { BOOK_ITEMS, MENU_ITEMS } from 'AppConstants';
import { BOOKING_SERVICE } from 'AppServices';
import { displayTime, calculateDistance } from 'AppUtilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  toggleContainer: {
    alignSelf: 'stretch',
    height: 40
  },
  contentContainer: {
    flex: 1
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const TAB_ITEMS = ['Upcoming', 'History'];

export class Schedule extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    setCurrentScene: PropTypes.func,
    showSideBar: PropTypes.func,
    feathers: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTab: 'Upcoming',
      bookUpcoming: [],
      bookHistory: [],
      isLoading: true,
    };
    this.onTabSelected = ::this.onTabSelected;
    this.onPress = ::this.onPress;
    this.currentUser = null;
  }

  componentDidMount() {
    console.info('Schedule~~~~~~');
    const { feathers } = this.props;
    this.currentUser = feathers.get('user');
    const bookingService = feathers.service(BOOKING_SERVICE);
    const query = {
      createdBy: this.currentUser._id
    };
    bookingService.find({ query })
    .then(res => {
      console.info('Booking Finding Result', res);
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
      ];
      const upcoming = [];
      const history = [];
      res.forEach((item) => {
        const name = item.bookingTrainer.name;
        const address = item.bookingTrainer.address;
        const avatar = item.bookingTrainer.avatarUrl;
        const distance = calculateDistance(this.currentUser.client.location.coordinates,
          item.bookingTrainer.trainer.location.coordinates);
        const trainHours = item.bookingHours;
        const date = new Date(item.bookingDate);
        const bookDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        const bookTime = displayTime(date);
        const payment = item.bookingTrainer.trainer.price;
        const currentDate = new Date();
        const itemList = {
          name,
          address,
          avatar,
          distance,
          bookDate,
          bookTime,
          trainHours,
          payment
        };
        if (currentDate.getTime() < date.getTime()) {
          upcoming.push(itemList);
        } else {
          history.push(itemList);
          console.info(itemList);
        }
      });
      this.setState({ bookUpcoming: upcoming, bookHistory: history, isLoading: false });
    })
    .catch(e => console.info('Error Finding Booking', e));
  }

  onPress() {
    this.props.navigator.resetTo('PersonalTrainerScene');
    this.props.setCurrentScene(MENU_ITEMS.indexOf('Personal trainer'));
    this.props.showSideBar(false);
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  renderSubComponent() {
    const { selectedTab, bookUpcoming, bookHistory } = this.state;
    switch (selectedTab) {
      case 'Upcoming':
        return (
          <Upcoming
            onPress={this.onPress}
            bookItems={bookUpcoming}
          />
        );
      case 'History':
        return (
          <History bookItems={bookHistory} />
        );
      default:
        break;
    }
    return null;
  }

  renderActivityIndicator() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="small" color="white" />
      </View>
    );
  }

  render() {
    const { selectedTab, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <ToggleButton
            options={TAB_ITEMS}
            onSelect={this.onTabSelected}
            value={selectedTab}
            selectedTextStyle={{ color: WHITE }}
          />
        </View>
        <View style={styles.contentContainer}>
          {isLoading ? this.renderActivityIndicator() : this.renderSubComponent()}
        </View>
      </View>
    );
  }
}
