import React, { Component, PropTypes } from 'react';
import { StatusBar } from 'react-native';
import { SideMenu, Notification } from 'AppComponents';
import { Router } from './routing';
import { connectFeathers } from 'AppConnectors';
import { NOTIFICATION_SERVICE, THREAD_SERVICE, USER_SERVICE } from 'AppServices';
import { updateActiveTime } from 'AppUtilities';
import { MENU_ITEMS } from 'AppConstants';
import FCM from 'react-native-fcm';

class _MainPage extends Component {
  static propTypes = {
    navigator: PropTypes.string.isRequired,
    sidebar: PropTypes.any,
    showSideBar: PropTypes.func,
    disableSideBar: PropTypes.func,
    setCurrentScene: PropTypes.func,
    feathers: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      newNotification: null,
      isSent: false,
      type: '',
    };
    this.navigator = null;
    this.routingScene = ::this.routingScene;
    this.showSideBar = ::this.showSideBar;
    this.disableSideBar = ::this.disableSideBar;
    this.setCurrentScene = ::this.setCurrentScene;
    this.returnToInitState = ::this.returnToInitState;
    this.onPressNotification = ::this.onPressNotification;
    this.checkIfChatScene = ::this.checkIfChatScene;
    this.isChatScene = false;
    this.currentUser = null;
    this.isTouched = false;
  }

  componentDidMount() {
    const { feathers } = this.props;
    const notificationService = feathers.service(NOTIFICATION_SERVICE);
    notificationService.on('created', notification => this.showPushNotification(notification));
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
      console.info('FCMToken', token);
      // store fcm token in your server
    });
    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
      // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
      if (notif.local_notification) {
        // this is a local notification
      }
      if (notif.opened_from_tray) {
        console.info('notification', notif);
        // app is open/resumed because user clicked banner
      }
    });
    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
      console.info('refreshToken', token);
      // fcm token may not be available on first load, catch it here
    });
  }

  componentWillUnmount() {
    // prevent leaking
    this.refreshUnsubscribe();
    this.notificationUnsubscribe();
  }

  onPressNotification() {
    if (!this.isTouched) {
      const { newNotification } = this.state;
      const { feathers } = this.props;
      const threadService = feathers.service(THREAD_SERVICE);
      this.isTouched = true;
      threadService.get(newNotification.threadId).
      then(thread => {
        const activeTime = updateActiveTime(thread.activeTime, this.currentUser._id);
        threadService.patch(newNotification.threadId, { activeTime })
        .then(() => {
          this.routingRef.routeChatScene({
            otherUser: newNotification.createdBy, threadId: newNotification.threadId
          });
        })
        .catch(e => {
          console.info('error updating active time', e);
        });
      })
      .catch(e => {
        console.info('error finding thread', e);
      });
    }
  }

  setCurrentScene(value) {
    this.props.setCurrentScene(value);
  }

  showPushNotification(notification) {
    this.currentUser = this.props.feathers.get('user');
    console.info('push notification~~~~~~', notification);
    if (this.currentUser !== null) {
      if (this.currentUser._id === notification.receiverId) {
        if (notification.type === 'message') {
          const { feathers } = this.props;
          const userService = feathers.service(USER_SERVICE);
          userService.get(notification.senderId)
            .then(createdBy => {
              const newNotification = {
                ...notification,
                createdBy
              };
              this.setState({
                newNotification,
                isSent: true,
                type: notification.type,
              });
            })
            .catch(e => console.info('error getting sender', e));
        } else {
          this.setState({
            newNotification: notification,
            isSent: true,
            type: notification.type,
          });
        }
      }
    }
  }

  showSideBar(value) {
    this.props.showSideBar(value);
  }

  disableSideBar(value) {
    this.props.disableSideBar(value);
  }

  routingScene(sceneName) {
    this.routingRef.routingScene(sceneName);
  }

  returnToInitState() {
    this.isTouched = false;
    this.setState({ newNotification: null, isSent: false });
  }

  checkIfChatScene(isChatScene) {
    this.isChatScene = isChatScene;
  }

  render() {
    const { sidebar } = this.props;
    const { newNotification, isSent, type } = this.state;
    // console.info('sidebar', sidebar);
    // console.info('isChatScene!@~', this.isChatScene);
    const touchable = this.isChatScene || sidebar.currentScene === MENU_ITEMS.indexOf('Messages');
    return (
      <SideMenu
        isOpen={sidebar.showSidebar}
        disable={sidebar.disableSidebar}
        routeScene={this.routingScene}
        setCurrentScene={this.setCurrentScene}
        currentScene={sidebar.currentScene}
        showSideBar={this.showSideBar}
        disableSideBar={this.disableSideBar}
      >
        <StatusBar
          hidden={isSent}
          animated={true}
        />
        <Router
          ref={(ref) => this.routingRef = ref}
          checkIfChatScene={this.checkIfChatScene}
        />
        <Notification
          type={type}
          content={newNotification}
          isSent={isSent}
          returnToInitState={this.returnToInitState}
          onPress={this.onPressNotification}
          touchable={!touchable}
        />
      </SideMenu>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
const MainPage = sideBarContainer(_MainPage);
export default connectFeathers(MainPage);
