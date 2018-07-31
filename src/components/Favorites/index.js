import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image, ListView, ActivityIndicator } from 'react-native';
import { NAVBAR_MARGIN_HORIZONTAL } from 'AppConstants';
import { BACKGROUND_COLOR, BORDER_COLOR, GRAY_COLOR } from 'AppColors';
import { LabelText } from 'AppFonts';
import { FAVORITE_SERVICE, USER_SERVICE } from 'AppServices';
import { calculateDistance } from 'AppUtilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
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
    justifyContent: 'flex-end'
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

export class Favorites extends Component {
  static propTypes = {
    feathers: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      items: [],
      selectedRow: 0,
      isLoading: true,
    };
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.renderFavoriteItem = ::this.renderFavoriteItem;
    this.currentUser = null;
    this.listItems = [];
  }

  componentDidMount() {
    this.currentUser = this.props.feathers.get('user');
    const favoriteService = this.props.feathers.service(FAVORITE_SERVICE);
    const userService = this.props.feathers.service(USER_SERVICE);
    const query = {
      createdBy: this.currentUser._id,
    };
    favoriteService.find({ query })
      .then(res => {
        if (res.length === 0) {
          this.setState({ items: [], isLoading: false });
        } else {
          if (res[0].favoriteUsers.length === 0) {
            this.setState({ items: [], isLoading: false });
          } else {
            const favoriteUserIds = res[0].favoriteUsers;
            const promise = favoriteUserIds.map((id, index) =>
              userService.get(favoriteUserIds[index])
              .then(user => {
                const item = {
                  id: user._id,
                  name: user.name,
                  avatarUrl: user.avatarUrl,
                  address: user.address,
                  distance: calculateDistance(
                    this.currentUser.isClient === true ?
                      this.currentUser.client.location.coordinates :
                      this.currentUser.trainer.location.coordinates,
                    user.isClient ?
                      user.client.location.coordinates :
                      user.trainer.location.coordinates
                  )
                };
                console.info('item', item);
                this.listItems.push(item);
              })
              .catch(e => console.info('error getting user', e))
            );
            Promise.all(promise)
              .then(() => {
                this.setState({ items: this.listItems, isLoading: false });
              })
              .catch(e => {
                console.info('error finding favorite', e);
                this.setState({ isLoading: false });
              });
          }
        }
      })
      .catch(e => {
        console.info('error finding favorite', e);
        this.setState({ isLoading: false });
      });
  }

  renderFavoriteItem(rowData) {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.userImageContainer}>
            <Image
              source={rowData.avatarUrl !== '' ?
               { uri: rowData.avatarUrl } : require('img/temp_user_image.png')}
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
                <LabelText style={styles.labelText} fontSize={13}>
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
            km
          </LabelText>
        </View>
      </View>
    );
  }

  renderActivityIndicator() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="small" color="white" />
      </View>
    );
  }

  renderListView() {
    const { items } = this.state;
    const dataSource = this.dataSource.cloneWithRows(items);
    if (items.length === 0) {
      return (<View style={styles.container} />);
    }
    return (
      <View style={styles.container}>
        <View style={styles.listViewContainer}>
          <ListView
            dataSource={dataSource}
            renderRow={(rowData) => this.renderFavoriteItem(rowData)}
          />
        </View>
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return this.renderActivityIndicator();
    }
    return this.renderListView();
  }
}
