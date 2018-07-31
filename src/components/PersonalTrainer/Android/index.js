import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  RefreshControl
} from 'react-native';
import { BACKGROUND_COLOR, GRAY_COLOR, BORDER_COLOR } from 'AppColors';
import { SearchBar } from 'AppComponents';
import { LabelText } from 'AppFonts';
import { NAVBAR_MARGIN_HORIZONTAL } from 'AppConstants';
import { TRAINER_SERVICE, CLIENT_SERVICE } from 'AppServices';
import { calculateDistance } from 'AppUtilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  searchbarContainer: {
    height: 35
  },
  listViewContainer: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  listItemContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 85,
    flexDirection: 'row',
    marginHorizontal: NAVBAR_MARGIN_HORIZONTAL,
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR
  },
  userInfoContainer: {
    flex: 4,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  distanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userImageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  userDetailContainer: {
    flex: 3,
    borderRightColor: BORDER_COLOR,
    borderRightWidth: 1 / 2,
    height: 40,
    marginLeft: 10
  },
  userImage: {
    width: 56,
    height: 56,
    borderRadius: 28
  },
  userLocationContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5
  },
  userNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  labelWhiteText: {
    color: 'white'
  },
  iconPin: {
    width: 12,
    height: 12,
    resizeMode: 'contain'
  },
  pinContainer: {
    justifyContent: 'center',
    marginRight: 5
  },
  labelText: {
    color: GRAY_COLOR
  },
  location: {
    justifyContent: 'center'
  },
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export class PersonalTrainerANDROID extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    touchEnabled: PropTypes.bool,
    feathers: PropTypes.object,
    toDistance: PropTypes.number,
    fromDistance: PropTypes.number,
    isReadyFilter: PropTypes.bool,
    changeReadyFilter: PropTypes.func,
    price: PropTypes.number,
    genderArray: PropTypes.array,
    speciality: PropTypes.number,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      searchText: '',
      items: [],
      selectedRow: 0,
      loading: true,
      $skip: 0,
      isRefreshing: false,
      listHeight: 200,
      footerY: 0,
    };
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.changeSearchText = ::this.changeSearchText;
    this.renderSearchItem = ::this.renderSearchItem;
    this.showSelectedTrainer = ::this.showSelectedTrainer;
    this._onRefresh = ::this._onRefresh;
    this._onInfinite = ::this._onInfinite;
    this.handleScroll = ::this.handleScroll;
    this.onLayout = ::this.onLayout;
    this.renderFooter = ::this.renderFooter;
    this.trainerArrays = null;
    this.currentUser = null;
    this.$skip = 0;
    this.query = null;
  }

  componentDidMount() {
    const { feathers } = this.props;
    this.currentUser = feathers.get('user');
    const trainerService = feathers.service(TRAINER_SERVICE);
    trainerService.find()
    .then((trainerArrays) => {
      console.info('result', trainerArrays);
      this.$skip = this.$skip + trainerArrays.limit;
      this.trainerArrays = trainerArrays.data.map((trainer) => ({
        ...trainer.createdBy,
        distance: calculateDistance(this.currentUser.isClient === true ?
          this.currentUser.client.location.coordinates :
          this.currentUser.trainer.location.coordinates, trainer.location.coordinates)
      }));
      this.setState({ items: this.trainerArrays, loading: false });
    })
    .catch((err) => {
      this.setState({ loading: false });
      console.info('error', err);
    });
    // }
    // else {
    //   const clientService = feathers.service(CLIENT_SERVICE);
    //   const query = { name: { $ne: this.currentUser.name } };
    //   clientService.find({ query })
    //   .then((clientArrays) => {
    //     console.info('result', clientArrays);
    //     this.trainerArrays = clientArrays.map((client) => ({
    //       ...client.createdBy,
    //       distance: calculateDistance(
    //         this.currentUser.trainer.location, client.location)
    //     }));
    //     this.setState({ items: this.trainerArrays, loading: false });
    //   })
    //   .catch((err) => {
    //     this.setState({ loading: false });
    //     console.info('error', err);
    //   });
    // }
  }

  componentWillReceiveProps(props) {
    if (props.isReadyFilter) {
      this.props.changeReadyFilter(false);
      this.filterTrainers();
    }
  }

  onLayout(event) {
    const layout = event.nativeEvent.layout;
    this.setState({ listHeight: layout.height });
  }

  handleScroll(event) {
    const { nativeEvent } = event;
    const y = nativeEvent.layoutMeasurement.height
      + nativeEvent.contentOffset.y + nativeEvent.contentInset.top;
    if (y >= nativeEvent.contentSize.height) {
      this._onInfinite();
    }
  }

  _onInfinite() {
    const { feathers } = this.props;
    const trainerService = feathers.service(TRAINER_SERVICE);
    let query = {
      $skip: this.$skip
    };
    if (this.query !== null) {
      query = {
        ...this.query,
        ...query
      };
    }
    this.setState({ isRefreshing: true });
    trainerService.find({ query })
    .then((trainerArrays) => {
      console.info('result', trainerArrays);
      this.$skip = this.$skip + trainerArrays.limit;
      const updatedTrainerArrays = trainerArrays.data.map((trainer) => ({
        ...trainer.createdBy,
        distance: calculateDistance(this.currentUser.isClient === true ?
          this.currentUser.client.location.coordinates :
          this.currentUser.trainer.location.coordinates, trainer.location.coordinates)
      }));
      this.trainerArrays = this.trainerArrays.concat(updatedTrainerArrays);
      this.setState({ items: this.trainerArrays, isRefreshing: false });
    })
    .catch((err) => {
      this.setState({ isRefreshing: true });
      console.info('error', err);
    });
  }

  _onRefresh() {
    const { feathers } = this.props;
    const trainerService = feathers.service(TRAINER_SERVICE);
    let query = {
      paginate: {
        default: this.$skip + 10,
        max: this.$skip + 10
      }
    };
    if (this.query !== null) {
      query = {
        ...this.query,
        ...query,
      };
    }
    this.setState({ isRefreshing: true });
    trainerService.find({ query })
    .then((trainerArrays) => {
      const updatedTrainerArrays = trainerArrays.data.map((trainer) => ({
        ...trainer.createdBy,
        distance: calculateDistance(this.currentUser.isClient === true ?
          this.currentUser.client.location.coordinates :
          this.currentUser.trainer.location.coordinates, trainer.location.coordinates)
      }));
      this.trainerArrays = this.trainerArrays.concat(updatedTrainerArrays);
      this.setState({ items: this.trainerArrays, isRefreshing: false });
    })
    .catch((err) => {
      this.setState({ isRefreshing: false });
      console.info('error', err);
    });
  }

  filterTrainers() {
    const { feathers, fromDistance, toDistance, price, genderArray, speciality } = this.props;
    const userService = feathers.service(TRAINER_SERVICE);
    const currentLocation = this.currentUser.client.location;
    console.info('CurrentLocation~~~~~~~', currentLocation);
    let query = {
      price: { $gte: price },
      speciality,
      location:
      { $near:
      {
        $geometry: { type: 'Point',
          coordinates: [currentLocation.coordinates[0], currentLocation.coordinates[1]]
        },
        $minDistance: fromDistance * 1000,
        $maxDistance: toDistance * 1000
      }
      }
    };
    if (genderArray.length === 1) {
      query = {
        ...query,
        gender: { $et: genderArray[0] }
      };
    }
    this.query = query;
    this.$skip = 0;
    this.setState({ loading: true });
    userService.find({ query })
    .then((trainerArrays) => {
      this.$skip = this.$skip + trainerArrays.limit;
      this.trainerArrays = trainerArrays;
      this.trainerArrays = trainerArrays.data.map((trainer) => ({
        ...trainer.createdBy,
        distance: calculateDistance(this.currentUser.client.location.coordinates,
          trainer.location.coordinates)
      }));
      console.info('Trainer~~~', this.trainerArrays);
      this.setState({ items: this.trainerArrays, loading: false });
    })
    .catch((err) => {
      this.setState({ loading: false });
      console.info('error', err);
    });
  }

  changeSearchText(searchText) {
    const items = this.trainerArrays.filter((data) => data.name.indexOf(searchText) > -1);
    this.setState({ items });
  }

  showSelectedTrainer(rowData) {
    console.info('ROWDATA~~~~~~', rowData);
    this.props.navigator.push({
      name: 'TrainerProfileScene',
      passProps: { otherUser: rowData }
    });
  }

  renderFooter() {
    return (
      <View onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        this.setState({ footerY: layout.y });
      }}
      />
    );
  }

  renderTouchUnableItem(rowData) {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.userImageContainer}>
            <Image
              source={ rowData.avatarUrl === '' ?
                require('img/temp_user_image.png') : { uri: rowData.avatarUrl }
                }
              style={styles.userImage}
            />
          </View>
          <View style={styles.userDetailContainer}>
            <View style={styles.userNameContainer}>
              <LabelText style={styles.labelWhiteText} fontSize={13}>
                {rowData.name}
              </LabelText>
            </View>
            <View style={styles.userLocationContainer}>
              <View style={styles.pinContainer}>
                <Image
                  source={require('img/icon_pin.png')}
                  style={styles.iconPin}
                />
              </View>
              <View style={styles.location}>
                <LabelText style={styles.labelText} fontSize={rowData.address.length > 25 ? 9 : 12}>
                  {rowData.address}
                </LabelText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <LabelText style={styles.labelWhiteText} fontSize={15}>
            {rowData.distance}
          </LabelText>
          <LabelText style={[styles.labelText, { marginTop: 5 }]} fontSize={13}>
            Km
          </LabelText>
        </View>
      </View>
    );
  }

  renderSearchItem(rowData) {
    const ComponentView = this.props.touchEnabled ? TouchableOpacity : View;
    return (
      <ComponentView onPress={() => this.showSelectedTrainer(rowData)}>
        {this.renderTouchUnableItem(rowData)}
      </ComponentView>
    );
  }

  renderView() {
    const { items } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.searchbarContainer}>
          <SearchBar
            placeholder = "Search"
            placeholderColor = "#8e8e93"
            onChangeText = {this.changeSearchText}
          />
        </View>
        <View style={styles.listViewContainer}>
          {items.length > 0 && this.renderRefreshListView() }
        </View>
      </View>
    );
  }

  renderRefreshControl() {
    const { isRefreshing } = this.state;
    return (
      <RefreshControl
        onRefresh={this._onRefresh}
        refreshing={isRefreshing}
      />
    );
  }

  renderRefreshListView() {
    const { items } = this.state;
    const dataSource = this.dataSource.cloneWithRows(items);
    if (Platform.OS === 'android') {
      return (
        <ListView
          onLayout={this.onLayout}
          dataSource={dataSource}
          renderRow = {(rowData) => this.renderSearchItem(rowData)}
          renderFooter={this.renderFooter}
          refreshControl={this.renderRefreshControl()}
          onScroll={this.handleScroll}
        />
      );
    }
    return (<View />);
  }

  renderActivityIndicator() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          size="small"
          color="white"
        />
      </View>
    );
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return this.renderActivityIndicator();
    }
    return this.renderView();
  }
}
