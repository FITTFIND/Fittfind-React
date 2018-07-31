import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, ListView, Image } from 'react-native';
import { LabelText } from 'AppFonts';
import { WHITE, BORDER_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scheduleContainer: {
    flex: 1,
  },
  labelWhiteText: {
    color: WHITE
  },
  labelText: {
    color: '#777777'
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

export class History extends Component {
  static propTypes = {
    bookItems: PropTypes.any
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
    this.renderHistoryItem = ::this.renderHistoryItem;
  }

  renderHistoryItem(rowData) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.trainerInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={rowData.avatar !== '' ?
               { uri: rowData.avatar } : require('img/temp_trainer_image.png')}
              style={styles.avatar}
            />
          </View>
          <View style={styles.trainerDetailContainer}>
            <View style={styles.trainerNameContainer}>
              <LabelText style={styles.labelWhiteText} fontSize={13}>
                {rowData.name}
              </LabelText>
            </View>
            <View style={styles.trainerLocationContainer}>
              <Image source={require('img/icon_pin.png')} style={styles.pinIcon} />
              <LabelText style={styles.labelText} fontSize={13}>
                {rowData.address}
              </LabelText>
            </View>
          </View>
          <View style={styles.trainerDistanceContainer}>
            <LabelText style={styles.labelWhiteText} fontSize={13}>
              {rowData.distance}
            </LabelText>
            <LabelText style={styles.labelText} fontSize={13}>
              km
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
          renderRow={this.renderHistoryItem}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }

  render() {
    const { bookItems } = this.props;
    return (
      <View style={styles.container}>
        {bookItems.length === 0 ? <View /> : this.renderSchedule()}
      </View>
    );
  }
}
