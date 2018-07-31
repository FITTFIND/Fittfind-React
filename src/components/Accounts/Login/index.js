import React, { Component, PropTypes } from 'react';
import {
  Platform, View, Image, TextInput, TouchableOpacity, StyleSheet, WebView, Modal
} from 'react-native';
import CookieManager from 'react-native-cookies';
import { WINDOW_WIDTH } from 'AppConstants';
import { PRIMARY_TEXT, WHITE, BACKGROUND_COLOR, BORDER_COLOR, DARK_COLOR } from 'AppColors';
import { LabelText } from 'AppFonts';
import { API_URL } from 'AppConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  dimBackground: {
    backgroundColor: '#242424',
    opacity: 0.9
  },
  logo_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  },
  row: {
    flexDirection: 'row'
  },
  formItemContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  inputItemContainer: {
    flex: 1.5,
    marginRight: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR
  },
  input: {
    flex: 1,
    height: 30,
    color: WHITE,
    paddingVertical: 0
  },
  signUpContainer: {
    marginTop: 20,
    alignSelf: 'stretch',
    height: 35,
    backgroundColor: DARK_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orContainer: {
    marginTop: 5,
    alignSelf: 'stretch',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  facebookBackground: {
    backgroundColor: '#3c5193',
    width: 100,
    height: 20,
    borderWidth: 20,
    borderRadius: 20,
    borderColor: '#3c5193',
    alignItems: 'center',
    justifyContent: 'center'
  },
  linkedInBackground: {
    backgroundColor: '#14a2dc',
    width: 100,
    height: 20,
    borderWidth: 20,
    borderRadius: 20,
    borderColor: '#14a2dc',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export class Login extends Component {
  static propTypes = {
    routeSignup: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired,
    authenticateToken: PropTypes.func.isRequired,
    feathers: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      email: '',
      password: '',
      webViewVisible: false,
      authUrl: '',
    };

    this.changeUsername = ::this.changeUsername;
    this.changePassword = ::this.changePassword;
    this.handleSubmit = ::this.handleSubmit;
    this.doFacebookLogin = ::this.doFacebookLogin;
    this.doLinkedinLogin = ::this.doLinkedinLogin;
    this.handleWebViewChange = ::this.handleWebViewChange;
    this.props.feathers.set('token', '');
    CookieManager.clearAll(() => {});
  }

  changeUsername(email) {
    this.setState({ email });
  }

  changePassword(password) {
    this.setState({ password });
  }

  handleSubmit() {
    const { email, password } = this.state;
    const { handleLogin } = this.props;
    handleLogin(email, password);
  }

  doFacebookLogin() {
    this.setState({ webViewVisible: true, authUrl: `${API_URL}/auth/facebook` });
  }

  doLinkedinLogin() {
    this.setState({ webViewVisible: true, authUrl: `${API_URL}/auth/linkedin` });
  }

  handleWebViewChange(url) {
    if (url.url.indexOf('auth/success') > -1) {
      if (Platform.OS === 'android') {
        CookieManager.get(url.url, (err, cookie) => {
          this.props.authenticateToken(cookie['feathers-jwt']);
        });
      } else {
        CookieManager.getAll((error, cookie) => {
          this.props.authenticateToken(cookie['feathers-jwt'].value);
        });
      }
      this.setState({ webViewVisible: false });
    } else if (url.url.indexOf('auth/failure') > -1) {
      this.setState({ webViewVisible: false });
    }
  }

  renderWebView() {
    const { webViewVisible } = this.state;
    if (webViewVisible) {
      return (
        <Modal
          animationType="slide"
          visible={webViewVisible}
          onRequestClose={(res) => console.info('OnRequestClose', res) }
        >
          <WebView
            onNavigationStateChange={this.handleWebViewChange}
            source={{ uri: this.state.authUrl }}
          />
        </Modal>
      );
    }
    return (<View />);
  }

  render() {
    const { username, password } = this.state;
    const { routeSignup } = this.props;
    const height = WINDOW_WIDTH / 1.17;
    return (
      <View style={styles.container}>
        <View style={[styles.logoContainer, { width: WINDOW_WIDTH, height }]}>
          <Image
            source={require('img/app_back_image1.png')}
            style={{ width: WINDOW_WIDTH }}
            resizeMode="contain"
          />
          <View style={[styles.dimBackground, styles.logo_container]} />
          <View style={styles.logo_container}>
            <Image
              source={require('img/icon_app_logo.png')}
              style={{ width: 119, height: 60 }}
            />
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={styles.formItemContainer}>
              <LabelText style={{ color: PRIMARY_TEXT, backgroundColor: 'transparent' }}>
                Username
              </LabelText>
            </View>
            <View style={styles.inputItemContainer}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="username"
                onChangeText={this.changeUsername}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                placeholderTextColor={PRIMARY_TEXT}
                value={username}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.formItemContainer}>
              <LabelText style={{ color: PRIMARY_TEXT, backgroundColor: 'transparent' }}>
                Password
              </LabelText>
            </View>
            <View style={styles.inputItemContainer}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="password"
                onChangeText={this.changePassword}
                clearButtonMode="while-editing"
                placeholderTextColor={PRIMARY_TEXT}
                secureTextEntry={true}
                value={password}
              />
            </View>
          </View>
          <View style={[styles.row, styles.signUpContainer]}>
            <TouchableOpacity onPress={this.handleSubmit}>
              <LabelText style={{ color: WHITE }} fontSize={15}>Sign In</LabelText>
            </TouchableOpacity>
          </View>
          <View style={[styles.row, styles.orContainer]}>
            <LabelText style={{ color: PRIMARY_TEXT }} fontSize={15}>Or</LabelText>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, marginHorizontal: 5, alignItems: 'flex-end' }}>
              <TouchableOpacity style={styles.facebookBackground} onPress={this.doFacebookLogin}>
                <LabelText style={{ color: WHITE, fontWeight: 'bold' }} fontSize={20}>
                  f
                </LabelText>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <TouchableOpacity style={styles.linkedInBackground} onPress={this.doLinkedinLogin}>
                <LabelText style={{ color: WHITE, fontWeight: 'bold' }} fontSize={20}>
                  in
                </LabelText>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.row, styles.orContainer, { marginTop: 15 }]} >
            <LabelText style={{ color: PRIMARY_TEXT, marginLeft: 10 }} fontSize={15}>
              Don't have an account?
            </LabelText>
            <TouchableOpacity onPress={routeSignup}>
              <LabelText style={{ color: WHITE, marginLeft: 10 }} fontSize={15}>
                Register
              </LabelText>
            </TouchableOpacity>
          </View>
        </View>
        {this.renderWebView()}
      </View>
    );
  }
}
