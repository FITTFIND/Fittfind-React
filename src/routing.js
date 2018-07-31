import React, { Component, PropTypes } from 'react';
import { Navigator, StyleSheet, StatusBar, Platform } from 'react-native';
import { DARK_COLOR } from 'AppColors';
import {
  LoginScene,
  SignupScene,
  ClientScene,
  TrainerScene,
  SplashScene,
  FavoritesScene,
  MessagesScene,
  PersonalTrainerScene,
  TrainerProfileScene,
  ChatScene,
  BookingScene,
  PaymentScene,
  SettingsScene,
  ScheduleScene,
  InviteScene,
  InviteCategoryScene
} from 'AppScenes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class Router extends Component {
  static propTypes = {
    checkIfChatScene: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.renderScene = ::this.renderScene;
    this.navigationRef = null;
  }
  componentDidMount() {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
      StatusBar.setHidden(false);
    } else {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      if (Platform.Version >= 21) {
        StatusBar.setHidden(false);
      } else {
        StatusBar.setHidden(true);
      }
    }
  }

  routingScene(sceneName) {
    switch (sceneName) {
      case 'LoginScene':
        this.navigationRef.resetTo(sceneName);
        break;
      case 'FavoritesScene':
        this.navigationRef.resetTo(sceneName);
        break;
      case 'ClientScene':
        this.navigationRef.resetTo(sceneName);
        break;
      case 'MessagesScene':
        this.navigationRef.resetTo(sceneName);
        break;
      case 'PersonalTrainerScene':
        this.navigationRef.resetTo(sceneName);
        break;
      case 'SettingsScene':
        this.navigationRef.resetTo(sceneName);
        break;
      case 'ScheduleScene':
        this.navigationRef.replace(sceneName);
        break;
      case 'TrainerScene':
        this.navigationRef.resetTo(sceneName);
        break;
      default:
        break;
    }
  }

  routeChatScene(passProps) {
    this.navigationRef.push({ name: 'ChatScene', passProps });
  }

  renderScene(route, navigator) {
    const currentRoute = typeof route === 'string' ? { name: route } : route;
    if (currentRoute.name === 'ChatScene') {
      this.props.checkIfChatScene(true);
    } else {
      this.props.checkIfChatScene(false);
    }
    switch (currentRoute.name) {
      case 'LoginScene':
        return (
          <LoginScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'SignupScene':
        return (
          <SignupScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'ClientScene':
        return (
          <ClientScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'TrainerScene':
        return (
          <TrainerScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'SplashScene':
        return (
          <SplashScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'FavoritesScene':
        return (
          <FavoritesScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'MessagesScene':
        return (
          <MessagesScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'PersonalTrainerScene':
        return (
          <PersonalTrainerScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'TrainerProfileScene':
        return (
          <TrainerProfileScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'ChatScene':
        return (
          <ChatScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'BookingScene':
        return (
          <BookingScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'PaymentScene':
        return (
          <PaymentScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'SettingsScene':
        return (
          <SettingsScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'ScheduleScene':
        return (
          <ScheduleScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'InviteScene':
        return (
          <InviteScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      case 'InviteCategoryScene':
        return (
          <InviteCategoryScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
      default:
        return (
          <LoginScene
            navigator={navigator}
            {...route.passProps}
            onBack={() => navigator.pop()}
          />
        );
    }
  }
  renderConfig(route, routeStack) {
    const fadeAnimation = Navigator.SceneConfigs.FadeAndroid;
    const pushFromRight = Navigator.SceneConfigs.PushFromRight;
    pushFromRight.springFriction = 35;
    pushFromRight.gestures.disabled = true;
    fadeAnimation.springFriction = 35;
    const currentRoute = typeof route === 'string' ? { name: route } : route;
    switch (currentRoute.name) {
      case 'LoginScene':
        return fadeAnimation;
      case 'SignupScene':
        return pushFromRight;
      case 'ClientScene':
        return pushFromRight;
      case 'TrainerScene':
        return pushFromRight;
      case 'SplashScene':
        return fadeAnimation;
      case 'FavoritesScene':
        return pushFromRight;
      case 'MessagesScene':
        return pushFromRight;
      case 'PersonalTrainerScene':
        return fadeAnimation;
      case 'TrainerProfileScene':
        return {
          ...pushFromRight,
          gestures: {}
        };
      case 'ChatScene':
        return fadeAnimation;
      case 'BookingScene':
        return {
          ...pushFromRight,
          gestures: {}
        };
      case 'PaymentScene':
        return {
          ...pushFromRight,
          gestures: {}
        };
      case 'SettingsScene':
        return pushFromRight;
      case 'ScheduleScene':
        return pushFromRight;
      case 'InviteScene':
        return {
          ...pushFromRight,
          gestures: {}
        };
      case 'InviteCategoryScene':
        return {
          ...pushFromRight,
          gestures: {}
        };
      default:
        return pushFromRight;
    }
  }

  render() {
    return (
      <Navigator
        sceneStyle={styles.container}
        initialRoute={{ name: 'SplashScene' }}
        renderScene={this.renderScene}
        configureScene={this.renderConfig}
        style={{ backgroundColor: DARK_COLOR }}
        ref={(ref) => this.navigationRef = ref}
      />
    );
  }
}
