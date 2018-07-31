import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ListView,
  TouchableHighlight,
  Platform
} from 'react-native';
import { BORDER_COLOR, BACKGROUND_COLOR, GRAY_COLOR } from 'AppColors';
import { LabelText } from 'AppFonts';
import { NAVBAR_MARGIN_HORIZONTAL, MENU_ITEMS } from 'AppConstants';
import { connectFeathers } from 'AppConnectors';
import FCM from 'react-native-fcm';
import { USER_SERVICE } from 'AppServices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    height: 60,
    marginTop: 50,
    marginLeft: NAVBAR_MARGIN_HORIZONTAL,
    marginRight: NAVBAR_MARGIN_HORIZONTAL + 10,
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR
  },
  userInfoContainer: {
    flex: 1.8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoutContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  labelText: {
    color: GRAY_COLOR
  },
  userImage: {
    width: 44,
    height: 44,
    alignSelf: 'stretch',
    borderRadius: 22
  },
  userImageContainer: {
    alignItems: 'center',
    marginRight: 10
  },
  userDetailContainer: {
    flex: 1,
    height: 40,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    borderRightColor: BORDER_COLOR,
    borderRightWidth: 1 / 2
  },
  userNameContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  userLocationContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  labelWhiteText: {
    color: 'white'
  },
  iconPin: {
    width: 13,
    height: 13,
    resizeMode: 'contain'
  },
  pinContainer: {
    justifyContent: 'center',
    marginRight: 5
  },
  location: {
    flex: 1,
    justifyContent: 'center'
  },
  menuItemContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 45,
    marginLeft: NAVBAR_MARGIN_HORIZONTAL,
    marginRight: NAVBAR_MARGIN_HORIZONTAL + 10,
  },
  menuItem: {
    marginTop: 10,
    backgroundColor: 'transparent',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: NAVBAR_MARGIN_HORIZONTAL,
  },
  menuSelectedItem: {
    marginTop: 10,
    backgroundColor: '#1e1e1e',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: NAVBAR_MARGIN_HORIZONTAL,
  }
});

export class Menu extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeScene: PropTypes.any.isRequired,
    showSideBar: PropTypes.func.isRequired,
    disable: PropTypes.func.isRequired,
    setCurrentScene: PropTypes.func.isRequired,
    currentScene: PropTypes.any.isRequired,
    isOpen: React.PropTypes.bool,
  };

  static defaultProps = {
    isOpen: false
  };

  constructor(props, constructor) {
    super(props, constructor);
    this.state = {
      items: MENU_ITEMS,
    };
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.logOut = ::this.logOut;
    this.renderMenuItem = ::this.renderMenuItem;
    this.setStyle = ::this.setStyle;
    this.onProfile = ::this.onProfile;
    this.currentUser = null;
  }
  //
  // componentDidMount() {
  //   this.currentUser = this.props.feathers.get('user');
  //   debugger;
  // }

  componentWillReceiveProps(props) {
    // if (props.isOpen && this.currentUser === null) {
    //   this.currentUser = this.props.feathers.get('user');
    // }
    this.currentUser = this.props.feathers.get('user');
  }

  onProfile() {
    this.props.setCurrentScene(MENU_ITEMS.indexOf('Profile'));
    this.props.routeScene('Profile');
    this.currentUser = this.props.feathers.get('user');
    if (this.currentUser.isClient) {
      this.props.routeScene('ClientScene');
    } else {
      this.props.routeScene('TrainerScene');
    }
    this.props.showSideBar(false);
  }

  setStyle(rowData) {
    this.props.setCurrentScene(MENU_ITEMS.indexOf(rowData));
    this.setState({
      items: [...MENU_ITEMS],
    });
    this.currentUser = this.props.feathers.get('user');
    switch (rowData) {
      case 'Favorites':
        this.props.routeScene('FavoritesScene');
        break;
      case 'Profile':
        if (this.currentUser.isClient !== undefined) {
          if (this.currentUser.isClient) {
            this.props.routeScene('ClientScene');
          } else {
            this.props.routeScene('TrainerScene');
          }
        }
        break;
      case 'Messages':
        this.props.routeScene('MessagesScene');
        break;
      case 'Personal trainer':
        this.props.routeScene('PersonalTrainerScene');
        break;
      case 'Settings':
        this.props.routeScene('SettingsScene');
        break;
      case 'Schedule':
        this.props.routeScene('ScheduleScene');
        break;
      default:
        break;
    }
    this.props.showSideBar(false);
    this.props.disable(true);
  }

  logOut() {
    FCM.getFCMToken().then(token => {
      if (token === null || token === undefined) {
        this.props.setCurrentScene(MENU_ITEMS.indexOf('Profile'));
        this.currentUser = null;
        this.props.feathers.logout();
        this.props.showSideBar(false);
        this.props.disable(true);
        this.props.routeScene('LoginScene');
      } else {
        this.removeFCMToken(token);
      }
    });
  }

  removeFCMToken(token) {
    const userService = this.props.feathers.service(USER_SERVICE);
    let fcmTokens = this.currentUser.androidDeviceToken;
    if (Platform.OS === 'ios') {
      fcmTokens = this.currentUser.iPhoneDeviceToken;
    }
    if (fcmTokens === undefined) {
      fcmTokens = [];
    }
    const index = fcmTokens.indexOf(token);
    if (index !== -1) {
      let data = {};
      fcmTokens.splice(index, 1);
      data = {
        androidDeviceToken: fcmTokens
      };
      if (Platform.OS === 'ios') {
        data = {
          iPhoneDeviceToken: fcmTokens
        };
      }
      userService.patch(this.currentUser._id, data)
      .then(res => {
        console.info('Success Remove Token', res);
        this.props.setCurrentScene(MENU_ITEMS.indexOf('Profile'));
        this.currentUser = null;
        this.props.feathers.logout();
        this.props.showSideBar(false);
        this.props.disable(true);
        this.props.routeScene('LoginScene');
      })
      .catch(e => {
        console.info('error Remove fcmTokens', e);
      });
    }
  }

  renderMenuItem(rowData) {
    let menuContainerStyle = styles.menuItem;
    let menuItemStyle = styles.labelText;
    if (this.props.currentScene === MENU_ITEMS.indexOf(rowData)) {
      menuContainerStyle = styles.menuSelectedItem;
      menuItemStyle = styles.labelWhiteText;
    }
    // console.log(this.props.currentScene);
    return (
      <TouchableHighlight onPress={() => this.setStyle(rowData)} underlayColor="transparent">
        <View style={menuContainerStyle}>
          <LabelText style={menuItemStyle} fontSize={16}>
            {rowData}
          </LabelText>
        </View>
      </TouchableHighlight>
    );
  }

  renderHeaderView() {
    if (this.currentUser === null) {
      return (<View />);
    }
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.userInfoContainer} onPress={this.onProfile}>
          <View style={styles.userImageContainer}>
            <Image
              source={this.currentUser.avatarUrl === '' ?
               require('img/temp_user_image.png') :
                { uri: this.currentUser.avatarUrl }}
              style={styles.userImage}
            />
          </View>
          <View style={styles.userDetailContainer}>
            <View style={styles.userNameContainer}>
              <LabelText style={styles.labelWhiteText} fontSize={15}>
                {this.currentUser.name}
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
                <LabelText
                  style={styles.labelText}
                  fontSize={this.currentUser.address.length > 13 ? 10 : 15}
                >
                  {this.currentUser.address}
                </LabelText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={this.logOut}>
            <LabelText style={styles.labelText} fontSize={15}>
              Log out
            </LabelText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const dataSource = this.dataSource.cloneWithRows(this.state.items);
    return (
      <View style={styles.container}>
        {this.renderHeaderView()}
        <View style={styles.menuItemContainer}>
          <ListView
            dataSource={dataSource}
            renderRow={(rowData) => this.renderMenuItem(rowData)}
            automaticallyAdjustContentInsets={false}
          />
        </View>
      </View>
    );
  }
}
export default connectFeathers(Menu);
