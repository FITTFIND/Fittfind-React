import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Modal,
  Platform
} from 'react-native';
import { BACKGROUND_COLOR } from 'AppColors';
import { ImagePicker } from 'AppUtilities';
import { UPLOAD_SERVICE, USER_SERVICE } from 'AppServices';
import { EditView } from './editView';
import { ProfileView } from './profileView';
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
  }
});

export class Client extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    showSideBar: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      goalDescription: 'Lorem ipsum dolor sit amet, consectetur adipior ',
      lifeStyle: '- Intermitterntly active',
      trainEnvironment: '- Outdoors (in park), Gym',
      numberOfLines: 2,
      flagShowAllGoals: false,
      editMode: false,
      userName: 'Axelle Desales',
      avatarUrl: '',
      updating: false,
      fadeInValue: new Animated.Value(1),
      fadeOutValue: new Animated.Value(0)
    };
    this.showSideMenu = ::this.showSideMenu;
    this.showAll = ::this.showAll;
    this.changeImage = ::this.changeImage;
    this.onEdit = ::this.onEdit;
    this.changeName = ::this.changeName;
    this.onEditCancel = ::this.onEditCancel;
    this.onEditSave = ::this.onEditSave;
    this.currentUser = null;
    this.onPressChat = ::this.onPressChat;
    this.fadeOutEdit = ::this.fadeOutEdit;
    this.fadeInEdit = ::this.fadeInEdit;
    this.changeLifeStyle = ::this.changeLifeStyle;
    this.changeTrainEnvironment = ::this.changeTrainEnvironment;
    this.changeGoalDescription = ::this.changeGoalDescription;
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
    if (this.currentUser.avatarUrl !== '') {
      this.setState({ avatarUrl: this.currentUser.avatarUrl });
    } else {
      this.setState({ avatarUrl: '' });
    }
    this.setState({
      goalDescription: this.currentUser.client.goalDescription,
      lifeStyle: this.currentUser.client.lifeStyle,
      trainEnvironment: this.currentUser.client.trainEnvironment,
      userName: this.currentUser.name
    });
  }

  onEditSave() {
    const { feathers } = this.props;
    const { userName, goalDescription, lifeStyle, trainEnvironment } = this.state;
    const userService = feathers.service(USER_SERVICE);
    const isClient = this.currentUser.isClient;
    const _id = this.currentUser._id;
    const currentUser = {
      _id,
      name: userName,
      goalDescription,
      lifeStyle,
      trainEnvironment,
      isClient,
      shouldUpdate: true,
    };
    this.setState({ updating: true });
    userService.patch(_id, currentUser)
      .then(() => {
        // this.setState({ editMode: false });
        this.onEditCancel(true);
        this.setState({ updating: false });
        this.currentUser.name = userName;
        this.currentUser.client.goalDescription = goalDescription;
        this.currentUser.client.lifeStyle = lifeStyle;
        this.currentUser.client.trainEnvironment = trainEnvironment;
      })
      .catch((e) => {
        console.info('error upload', e);
        this.setState({ updating: false });
      });
  }

  onPressChat() {
    // alert('chat');
  }

  onEditCancel(isChanged = false) {
    const { fadeOutValue } = this.state;
    if (!isChanged) {
      this.setState({
        goalDescription: this.currentUser.client.goalDescription,
        lifeStyle: this.currentUser.client.lifeStyle,
        trainEnvironment: this.currentUser.client.trainEnvironment
      });
    }
    Animated.timing(fadeOutValue, {
      toValue: 0,
      duration: 150
    }).start(this.fadeOutEdit);
  }

  onEdit() {
    const { fadeInValue } = this.state;
    Animated.timing(fadeInValue, {
      toValue: 0,
      duration: 150
    }).start(this.fadeInEdit);
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

  changeName(userName) {
    this.setState({ userName });
  }

  showSideMenu() {
    this.props.showSideBar(true);
  }

  showAll() {
    this.setState({ flagShowAllGoals: true });
  }

  updateProfileImage(avatarUrl, avatarData) {
    const isClient = this.currentUser.isClient;
    const url = {
      avatarUrl,
      isClient,
      shouldUpdate: false
    };
    this.setState({ updating: true });
    this.props.feathers.service(USER_SERVICE).patch(this.currentUser._id, url)
      .then((result) => {
        console.info('successful edit', result);
        this.setState({ avatarUrl: avatarData, updating: false });
      })
      .catch((e) => {
        console.info('error update', e);
        this.setState({ updating: false });
      });
  }

  uploadImage(media) {
    const { feathers } = this.props;
    this.setState({ updating: true });
    feathers.service(UPLOAD_SERVICE).create({ media })
    .then((result) => {
      console.info('success upload', result);
      this.updateProfileImage(result.url, media);
      this.setState({ updating: false });
    })
    .catch((e) => {
      this.setState({ updating: false });
      console.info('error upload', e);
    });
  }

  changeImage() {
    ImagePicker.show()
    .then(({ source }) => {
      if (source) {
        this.uploadImage(source.uri);
      }
    })
    .catch(() => { });
  }

  changeGoalDescription(goalDescription) {
    this.setState({ goalDescription });
  }

  changeLifeStyle(lifeStyle) {
    this.setState({ lifeStyle });
  }

  changeTrainEnvironment(trainEnvironment) {
    this.setState({ trainEnvironment });
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

  renderEdit() {
    const {
      userName,
      avatarUrl,
      goalDescription,
      fadeOutValue,
      lifeStyle,
      trainEnvironment
    } = this.state;
    return (
      <EditView
        userName={userName}
        changeName={this.changeName}
        onEditCancel={this.onEditCancel}
        onEditSave={this.onEditSave}
        avatarUrl={avatarUrl}
        goalDescription={goalDescription}
        changeImage={this.changeImage}
        fadeOutValue={fadeOutValue}
        changeGoalDescription={this.changeGoalDescription}
        lifeStyle={lifeStyle}
        changeLifeStyle={this.changeLifeStyle}
        trainEnvironment={trainEnvironment}
        changeTrainEnvironment={this.changeTrainEnvironment}
      />
    );
  }

  renderProfileView() {
    const {
      userName,
      fadeInValue,
      avatarUrl,
      goalDescription,
      numberOfLines,
      flagShowAllGoals,
      lifeStyle,
      trainEnvironment
    } = this.state;
    return (
      <ProfileView
        userName={userName}
        fadeInValue={fadeInValue}
        showSideMenu={this.showSideMenu}
        onEdit={this.onEdit}
        avatarUrl={avatarUrl}
        onPressChat={this.onPressChat}
        goalDescription={goalDescription}
        numberOfLines={numberOfLines}
        flagShowAllGoals={flagShowAllGoals}
        showAll={this.showAll}
        lifeStyle={lifeStyle}
        trainEnvironment={trainEnvironment}
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
