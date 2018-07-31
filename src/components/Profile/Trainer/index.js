import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Platform
} from 'react-native';
import FormData from 'FormData';
import { BACKGROUND_COLOR, DARK_COLOR, PRIMARY_TEXT } from 'AppColors';
import { ProfileView } from './profileView';
import { EditView } from './editView';
import { USER_SERVICE, UPLOAD_SERVICE, UPLOAD_VIDEO_SERVICE } from 'AppServices';
import { ImagePicker, VideoPicker } from 'AppUtilities';
import { WINDOW_HEIGHT } from 'AppConstants';
import { LabelText } from 'AppFonts';
import { API_URL } from 'AppConfig';
import FCM from 'react-native-fcm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editContainer: {
    flex: 1,
  },
  dialogMenuContainer: {
    marginTop: WINDOW_HEIGHT / 2 - 60,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  dialogMenu: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: 200,
    height: 40,
    backgroundColor: DARK_COLOR,
  },
  labelText: {
    color: PRIMARY_TEXT
  }
});

export class Trainer extends Component {
  static propTypes= {
    feathers: PropTypes.object.isRequired,
    showSideBar: PropTypes.func,
    navigator: PropTypes.object
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      avatarUrl: '',
      bioDescription: 'Lorem ipsum dolr sit amet',
      flagShowAllGoals: false,
      price: 125,
      imageItems: ['https://s3-us-west-1.amazonaws.com/fitfind/i/image1.png',
        'https://s3-us-west-1.amazonaws.com/fitfind/i/image2.png',
      ],
      updating: false,
      fadeInValue: new Animated.Value(1),
      fadeOutValue: new Animated.Value(0),
      editMode: false,
      name: 'Alexandra Nivar',
      numberOfLines: 2,
      showMediaDialog: false,
      isUploadAvatar: false,
      isUploadVideo: false,
      auditionVideoUrl: '',
    };
    this.showMenu = ::this.showMenu;
    this.showAll = ::this.showAll;
    this.goChatScene = ::this.goChatScene;
    this.setBook = ::this.setBook;
    this.onEdit = ::this.onEdit;
    this.fadeInEdit = ::this.fadeInEdit;
    this.onEditCancel = ::this.onEditCancel;
    this.onEditSave = ::this.onEditSave;
    this.fadeOutEdit = ::this.fadeOutEdit;
    this.changeUserName = ::this.changeUserName;
    this.changeBioDescription = ::this.changeBioDescription;
    this.changePrice = ::this.changePrice;
    this.changeImage = ::this.changeImage;
    this.uploadPhoto = ::this.uploadPhoto;
    this.closeMediaDialog = ::this.closeMediaDialog;
    this.showVideoUploadDialog = ::this.showVideoUploadDialog;
    this.showAudioUploadDialog = ::this.showAudioUploadDialog;
    this.currentUser = null;
    this.selectedMediaType = '';
  }

  componentWillMount() {
    this.currentUser = this.props.feathers.get('user');
    FCM.getFCMToken().then(token => {
      console.info('FCMToken', token);
      if (token === null || token === undefined) {
        console.info('Null Token');
      } else {
        this.saveFCMToken(token);
      }
    });
    console.info('Trainer', this.currentUser);
    if (this.currentUser.avatarUrl !== '') {
      this.setState({ avatarUrl: this.currentUser.avatarUrl });
    } else {
      this.setState({ avatarUrl: '' });
    }
    this.setState({
      bioDescription: this.currentUser.trainer.bioDescription,
      price: this.currentUser.trainer.price,
      name: this.currentUser.name,
      imageItems: this.currentUser.trainer.imageItems
    });
  }

  onEditSave() {
    const { feathers } = this.props;
    const { bioDescription, price, name, imageItems, auditionVideoUrl } = this.state;
    const userService = feathers.service(USER_SERVICE);
    const isClient = this.currentUser.isClient;
    const _id = this.currentUser._id;
    const currentUser = {
      _id,
      name,
      price,
      bioDescription,
      imageItems,
      isClient,
      auditionVideoUrl,
      shouldUpdate: true,
    };
    this.setState({ updating: true });
    userService.patch(_id, currentUser)
      .then(() => {
        this.onEditCancel(true);
        this.setState({ updating: false });
        this.currentUser.name = name;
        this.currentUser.trainer.bioDescription = bioDescription;
        this.currentUser.trainer.price = price;
        this.currentUser.trainer.imageItems = imageItems;
      })
      .catch((e) => {
        console.info('error EditSave', e);
        this.setState({ updating: false });
      });
    this.onEditCancel(true);
  }

  onEditCancel(isChanged = false) {
    const { fadeOutValue } = this.state;
    if (!isChanged) {
      this.setState({
        bioDescription: this.currentUser.trainer.bioDescription,
        price: this.currentUser.trainer.price,
        imageItems: this.currentUser.trainer.imageItems,
        name: this.currentUser.name
      });
    }
    Animated.timing(fadeOutValue, {
      toValue: 0,
      duration: 150
    }).start(() => this.fadeOutEdit());
  }

  onEdit() {
    const { fadeInValue } = this.state;
    Animated.timing(fadeInValue, {
      toValue: 0,
      duration: 150
    }).start(this.fadeInEdit);
  }

  setBook() {
    this.props.navigator.push('BookingScene');
  }

  updateFCMTokens(fcmTokens) {
    const userService = this.props.feathers.service(USER_SERVICE);
    let data = {};
    data = {
      androidDeviceToken: fcmTokens
    };
    if (Platform.OS === 'ios') {
      data = {
        iPhoneDeviceToken: fcmTokens
      };
    }
    this.setState({ updating: true });
    userService.patch(this.currentUser._id, data)
      .then(res => {
        console.info('Success Updating', res);
        this.setState({ updating: false });
      })
      .catch(e => {
        console.info('error updating fcmTokens', e);
        this.setState({ updating: false });
      });
  }

  saveFCMToken(token) {
    let fcmTokens = this.currentUser.androidDeviceToken;
    if (Platform.OS === 'ios') {
      fcmTokens = this.currentUser.iPhoneDeviceToken;
    }
    if (fcmTokens === undefined) {
      fcmTokens = [];
    }
    if (fcmTokens.indexOf(token) === -1) {
      fcmTokens.push(token);
      this.updateFCMTokens(fcmTokens);
    }
  }

  updateProfileImage(avatarUrl, avatarData) {
    const isClient = this.currentUser.isClient;
    const url = {
      avatarUrl,
      isClient,
      shouldUpdate: false
    };
    this.setState({ updating: true });
    const userService = this.props.feathers.service(USER_SERVICE);
    userService.patch(this.currentUser._id, url)
    .then((result) => {
      console.info('successful edit', result);
      this.setState({ avatarUrl: avatarData, updating: false });
    })
    .catch((e) => {
      console.info('error update', e);
      this.setState({ updating: false });
    });
  }

  uploadImage(media, type = 'avatar') {
    const { feathers } = this.props;
    const { imageItems, auditionVideoUrl } = this.state;
    if (type === 'gallery') {
      this.setState({ updating: true });
      feathers.service(UPLOAD_SERVICE).create({ media })
      .then((result) => {
        console.info('success upload', result);
        this.setState({ updating: false, imageItems: [...imageItems, result.url] });
      })
      .catch((e) => {
        this.setState({ updating: false });
        console.info('error upload', e);
      });
    } else if (type === 'video') {
      this.setState({ updating: true });
      const formData = new FormData();
      formData.append('uri', { uri: media, type: 'video/mp4', name: 'drop' });
      const config = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      };
      fetch(`${API_URL}/${UPLOAD_VIDEO_SERVICE}`, config)
        .then((response) => {
          console.info('success', response);
          return response.json();
        })
        .then(result => {
          console.info('result', result);
          this.setState({ auditionVideoUrl: result.url, updating: false });
        })
        .catch(e => {
          this.setState({ updating: false });
          console.log('err', e);
        });
    } else {
      this.setState({ updating: true });
      feathers.service(UPLOAD_SERVICE).create({ media })
      .then((result) => {
        this.updateProfileImage(result.url, media);
        this.setState({ updating: false });
      })
      .catch((e) => {
        this.setState({ updating: false });
        console.info('error upload', e);
      });
    }
  }

  changeImage() {
    // ImagePicker.show()
    // .then(({ source }) => {
    //   if (source) {
    //     debugger;
    //     this.uploadImage(source.uri);
    //   }
    // })
    // .catch(() => { });
    this.setState({ showMediaDialog: true });
  }

  changeUserName(name) {
    this.setState({ name });
  }

  changeBioDescription(bioDescription) {
    this.setState({ bioDescription });
  }

  changePrice(price) {
    if (price === '') {
      this.setState({ price: 0 });
    } else {
      this.setState({ price: parseInt(price, 10) });
    }
  }

  fadeOutEdit() {
    this.setState({ editMode: false });
    const { fadeInValue } = this.state;
    Animated.timing(fadeInValue, {
      toValue: 1,
      duration: 150
    }).start();
  }

  fadeInEdit() {
    this.setState({ editMode: true });
    const { fadeOutValue } = this.state;
    Animated.timing(fadeOutValue, {
      toValue: 1,
      duration: 150
    }).start();
  }

  showMenu() {
    this.props.showSideBar(true);
  }

  showAll() {
    this.setState({ flagShowAllGoals: true });
  }

  goChatScene() {
    this.props.navigator.push('ChatScene');
  }

  uploadPhoto() {
    ImagePicker.show()
    .then(({ source }) => {
      if (source) {
        this.uploadImage(source.uri, 'gallery');
      }
    })
    .catch(() => { });
  }

  closeMediaDialog() {
    this.setState({ showMediaDialog: false });
    this.selectedMediaType = '';
  }

  showVideoUploadDialog() {
    // this.setState({ showMediaDialog: false }, () => {
    // });
    this.selectedMediaType = 'video';
    VideoPicker.show()
    .then(({ source }) => {
      if (source) {
        this.uploadImage(source.uri, 'video');
      }
    })
    .catch(() => { });
  }

  showAudioUploadDialog() {
    this.selectedMediaType = 'audio';
    ImagePicker.show()
    .then(({ source }) => {
      if (source) {
        this.uploadImage(source.uri);
      }
    })
    .catch(() => { });
  }

  renderMediaDialog() {
    const { showMediaDialog } = this.state;
    return (
      <Modal
        animationType="slide"
        visible={showMediaDialog}
        transparent={true}
        onRequestClose={(res) => console.info('OnRequestClose', res) }
      >
        <View style={styles.dialogMenuContainer}>
          <TouchableOpacity
            style={[styles.dialogMenu, { borderBottomWidth: 0.5, borderTopRightRadius: 5, borderTopLeftRadius: 5 }]}
            onPress={this.showAudioUploadDialog}
          >
            <LabelText style={styles.labelText} fontSize={15}>
              Upload Avatar Image
            </LabelText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogMenu, { borderBottomWidth: 0.5 }]}
            onPress={this.showVideoUploadDialog}
          >
            <LabelText style={styles.labelText} fontSize={15}>
              Upload Audition Video
            </LabelText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogMenu, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}
            onPress={this.closeMediaDialog}
          >
            <LabelText style={styles.labelText} fontSize={15}>
              Cancel
            </LabelText>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  renderEdit() {
    const {
      name,
      fadeOutValue,
      price,
      imageItems,
      flagShowAllGoals,
      numberOfLines,
      bioDescription,
      avatarUrl,
      showMediaDialog,
    } = this.state;
    const _imageItems = [...imageItems, ''];
    return (
      <View style={styles.editContainer}>
        <EditView
          name={name}
          fadeOutValue={fadeOutValue}
          price={price.toString()}
          imageItems={_imageItems}
          flagShowAllGoals={flagShowAllGoals}
          numberOfLines={numberOfLines}
          bioDescription={bioDescription}
          showAll={this.showAll}
          onEditSave={this.onEditSave}
          onEditCancel={this.onEditCancel}
          changeName={this.changeUserName}
          changeBioDescription={this.changeBioDescription}
          changePrice={this.changePrice}
          changeImage={this.changeImage}
          avatarUrl={avatarUrl}
          uploadPhoto={this.uploadPhoto}
        />
        {showMediaDialog && this.renderMediaDialog()}
      </View>
    );
  }

  renderActivityIndicator() {
    const { updating } = this.state;
    if (updating) {
      return (
        <Modal
          animationType="none"
          visible={updating}
          onRequestClose={(res) => console.info('OnRequestClose', res) }
          transparent={true}
        >
          <View style={styles.indicatorContainer}>
            <ActivityIndicator size="small" color="white" />
          </View>
        </Modal>
      );
    }
    return null;
  }

  renderProfileView() {
    const {
      name,
      fadeInValue,
      price,
      imageItems,
      flagShowAllGoals,
      numberOfLines,
      bioDescription,
      avatarUrl
    } = this.state;
    return (
      <ProfileView
        name={name}
        fadeInValue={fadeInValue}
        showMenu={this.showMenu}
        onEdit={this.onEdit}
        price={price}
        imageItems={imageItems}
        flagShowAllGoals={flagShowAllGoals}
        numberOfLines={numberOfLines}
        bioDescription={bioDescription}
        showAll={this.showAll}
        avatarUrl={avatarUrl}
      />
    );
  }

  render() {
    const { editMode } = this.state;
    return (
      <View style={styles.container}>
        {editMode ? this.renderEdit() : this.renderProfileView()}
        {this.renderActivityIndicator()}
      </View>
    );
  }
}
