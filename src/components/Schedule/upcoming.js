import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, TouchableOpacity, ListView, Image } from 'react-native';
import { LabelText } from 'AppFonts';
import { WHITE, BLUE, BORDER_COLOR } from 'AppColors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  scheduleContainer: {
    flex: 1,
  },
  labelBigContainer: {
    alignSelf: 'center'
  },
  labelSmallContainer: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  labelWhiteText: {
    color: WHITE
  },
  labelText: {
    color: '#777777'
  },
  findButtonContainer: {
    backgroundColor: BLUE,
    width: WINDOW_WIDTH - 100,
    height: WINDOW_HEIGHT / 14,
    alignSelf: 'center',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContainer: {
    height: 135,
    marginHorizontal: 15,
    justifyContent: 'center',
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR
  },
  trainerInfoContainer: {
    height: 55,
    alignSelf: 'stretch',
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    width: 54,
    height: 54,
  },
  bookDataContainer: {
    marginTop: 15,
    height: 30,
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  avatar: {
    width: 54,
    height: 54,
    resizeMode: 'stretch',
    borderRadius: 27
  },
  trainerDetailContainer: {
    flex: 1,
    height: 50,
    marginLeft: 16,
    justifyContent: 'center',
    borderRightWidth: 1 / 2,
    borderRightColor: BORDER_COLOR
  },
  trainerDistanceContainer: {
    width: 65,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trainerNameContainer: {
  },
  trainerLocationContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  pinIcon: {
    height: 13,
    width: 8,
    marginRight: 10,
  },
  bookDateContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  priceContainer: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export class Upcoming extends Component {
  static propTypes = {
    bookItems: PropTypes.any,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    bookItems: []
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      items: this.props.bookItems
    };
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.onPress = ::this.onPress;
    this.renderUpcomingItem = ::this.renderUpcomingItem;
  }

  componentWillReceiveProps(props) {
    if (this.props.bookItems.length === 0 && this.props.bookItems !== props.bookItems) {
      this.setState({ items: props.bookItems });
    }
  }

  onPress() {
    this.props.onPress();
  }

  renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.labelBigContainer}>
          <LabelText style={styles.labelWhiteText} fontSize={25}>
            So what are you waiting for?
          </LabelText>
        </View>
        <View style={styles.labelSmallContainer}>
          <LabelText style={styles.labelText} fontSize={18}>
            Book a personal trainer
          </LabelText>
        </View>
        <TouchableOpacity onPress={this.onPress}>
          <View style={styles.findButtonContainer}>
            <LabelText style={styles.labelWhiteText} fontSize={17}>
              Find
            </LabelText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderUpcomingItem(rowData) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.trainerInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: rowData.avatar }} style={styles.avatar} />
          </View>
          <View style={styles.trainerDetailContainer}>
            <View style={styles.trainerNameContainer}>
              <LabelText style={styles.labelWhiteText} fontSize={13}>
                {rowData.name}
              </LabelText>
            </View>
            <View style={styles.trainerLocationContainer}>
              <Image source={require('img/icon_pin.png')} style={styles.pinIcon} />
              <LabelText style={styles.labelText} fontSize={rowData.address.length > 25 ? 9 : 13}>
                {rowData.address}
              </LabelText>
            </View>
          </View>
          <View style={styles.trainerDistanceContainer}>
            <LabelText style={styles.labelWhiteText} fontSize={13}>
              {rowData.distance}
            </LabelText>
            <LabelText style={styles.labelText} fontSize={13}>
              Km
            </LabelText>
          </View>
        </View>
        <View style={styles.bookDataContainer}>
          <View style={styles.bookDateContainer}>
            <LabelText style={styles.labelText} fontSize={13}>
              {rowData.bookDate}
            </LabelText>
            <LabelText style={styles.labelText} fontSize={13}>
              {rowData.bookTime}
            </LabelText>
            <LabelText style={styles.labelText} fontSize={13}>
              {rowData.trainHours} Hours
            </LabelText>
          </View>
          <View style={styles.priceContainer}>
            <LabelText style={styles.labelWhiteText} fontSize={15}>
              £{rowData.payment}
            </LabelText>
          </View>
        </View>
      </View>
    );
  }

  renderSchedule() {
    const { items } = this.state;
    const dataSource = this.dataSource.cloneWithRows(items);
    return (
      <View style={styles.scheduleContainer}>
        <ListView
          dataSource = {dataSource}
          renderRow={this.renderUpcomingItem}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }

  render() {
    const { items } = this.state;
    return (
      <View style={styles.container}>
        {items.length === 0 ? this.renderEmpty() : this.renderSchedule()}
      </View>
    );
  }
}
