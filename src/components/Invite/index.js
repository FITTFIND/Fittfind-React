import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ListView,
} from 'react-native';
import { SearchBar } from 'AppComponents';
import { LabelText } from 'AppFonts';
import { WHITE, BLUE, BORDER_COLOR, GRAY_COLOR, BACKGROUND_COLOR } from 'AppColors';
import { WINDOW_HEIGHT, NAVBAR_MARGIN_HORIZONTAL } from 'AppConstants';
// import CookieManager from 'react-native-cookies';
// import { AppInviteDialog } from 'react-native-fbsdk';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  searchbarContainer: {
    height: 35
  },
  inviteButton: {
    left: 0,
    right: 0,
    bottom: 0,
    height: WINDOW_HEIGHT / 14,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelWhite: {
    color: WHITE
  },
  imageInvite: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  inviteListContainer: {
    flex: 1,
  },
  inviteItemContainer: {
    flex: 1,
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
  labelWhiteText: {
    color: 'white'
  },
  labelText: {
    color: GRAY_COLOR
  },
  distanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export class Invite extends Component {
  static propTypes = {
    feathers: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      searchText: '',
      items: ['Aelx', 'James', 'Aelx', 'James', 'Aelx', 'James', 'Aelx', 'James'],
      // isRenderWebView: false,
      facebookInviteContent: {
        applinkUrl: 'https://fb.me/1647314452231644',
      }
    };
    this.currentUser = null;
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.changeSearchText = ::this.changeSearchText;
    this.onInviteAll = ::this.onInviteAll;
    this.renderInviteItem = ::this.renderInviteItem;
    // this.handleWebViewChange = ::this.handleWebViewChange;
    // this.flagLinkedin = false;
    // CookieManager.clearAll(() => {});
  }

  componentDidMount() {
    this.currentUser = this.props.feathers.get('user');
    // this.onLinkedinConnection('');
    // this.shareLink();
  }

  onInviteAll() {
    console.info('touch!');
  }

  // onLinkedinConnection(accessToken) {
  //   const { feathers } = this.props;
  //   const data = {
  //     accessToken
  //   };
  //   const linkedinService = feathers.service(FACEBOOK_SERVICE);
  //   linkedinService.create(data)
  //   .then(res => {
  //     console.info('res', res);
  //     this.setState({ isRenderWebView: false });
  //   })
  //   .catch(e => {
  //     console.info(e);
  //     this.setState({ isRenderWebView: false });
  //   });
  // }
  // shareLink() {
  //   const { facebookInviteContent } = this.state;
  //   AppInviteDialog.canShow(facebookInviteContent)
  //   .then(canShow => {
  //     if (canShow) {
  //       return AppInviteDialog.show(facebookInviteContent);
  //     }
  //     return null;
  //   })
  //   .then(result => {
  //     if (result.isCancelled) {
  //       console.info('Facebook invite Cancelled', result.isCancelled);
  //     } else {
  //       console.info('Share was successful with result: ', result);
  //     }
  //   })
  //   .catch(e => console.info('error facebook invite', e));
  // }

  changeSearchText(searchText) {
    this.setState({ searchText });
  }

  // handleWebViewChange(url) {
  //   if (url.url.indexOf('auth/success') > -1) {
  //     console.info(url.url);
  //     if (this.flagLinkedin === false) {
  //       this.flagLinkedin = true;
  //       let accessToken = '';
  //       if (Platform.OS === 'android') {
  //         CookieManager.get(url.url, (err, cookie) => {
  //           console.info(cookie['feathers-jwt'].value);
  //           accessToken = cookie['feathers-jwt'].value;
  //           this.onLinkedinConnection(accessToken);
  //         });
  //       } else {
  //         CookieManager.getAll((error, cookie) => {
  //           console.info(cookie['feathers-jwt'].value);
  //           accessToken = cookie['feathers-jwt'].value;
  //           this.onLinkedinConnection(accessToken);
  //         });
  //       }
  //     }
  //   } else if (url.url.indexOf('auth/failure') > -1) {
  //     this.setState({ isRenderWebView: false });
  //   }
  // }

  renderInviteItem(rowData) {
    return (
      <View style={styles.inviteItemContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.userImageContainer}>
            <Image
              source={ rowData.avatarUrl === '' ?
                require('img/temp_user_image.png') : require('img/temp_user_image.png')
                }
              style={styles.userImage}
            />
          </View>
          <View style={styles.userDetailContainer}>
            <LabelText style={styles.labelWhiteText} fontSize={13}>
              Alexander
            </LabelText>
            <LabelText style={[styles.labelText, { marginTop: 5 }]} fontSize={12}>
              +33323231234
            </LabelText>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <LabelText style={styles.labelWhiteText} fontSize={15}>
            INVITE
          </LabelText>
        </View>
      </View>
    );
  }

  renderInviteListView() {
    const { items } = this.state;
    const dataSource = this.dataSource.cloneWithRows(items);
    return (
      <View style={styles.inviteListContainer}>
        <ListView
          dataSource={dataSource}
          renderRow={this.renderInviteItem}
        />
      </View>
    );
  }

  // renderWebView() {
  //   const { isRenderWebView } = this.state;
  //   if (isRenderWebView) {
  //     return (
  //       <Modal
  //         animationType="slide"
  //         visible={isRenderWebView}
  //         onRequestClose={(res) => console.info('OnRequestClose', res) }
  //       >
  //         <WebView
  //           onNavigationStateChange={this.handleWebViewChange}
  //           source={{ uri: `${API_URL}/auth/linkedin` }}
  //         />
  //       </Modal>
  //     );
  //   }
  //   return (<View />);
  // }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchbarContainer}>
          <SearchBar
            placeholder = "Search"
            placeholderColor = "#8e8e93"
            onChangeText = {this.changeSearchText}
          />
        </View>
        {this.renderInviteListView()}
        <TouchableOpacity style={styles.inviteButton} onPress={this.onInviteAll}>
          <Image source={require('img/icon_invite.png')} style={styles.imageInvite} />
          <LabelText style={styles.labelWhite} fontSize={15}>
            {'   Invite all'}
          </LabelText>
        </TouchableOpacity>
      </View>
    );
  }
}
