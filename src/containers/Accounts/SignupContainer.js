import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { Signup } from 'AppComponents';
import { DARK_COLOR } from 'AppColors';
import { connectFeathers } from 'AppConnectors';
import { NAVBAR_MARGIN_TOP } from 'AppConstants';
import { USER_SERVICE } from 'AppServices';
import { AlertMessage } from 'AppUtilities';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: NAVBAR_MARGIN_TOP,
    backgroundColor: DARK_COLOR,
  }
});

class SignupContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object.isRequired,
    routeBack: PropTypes.func.isRequired,
    routeSignupSuccess: PropTypes.func.isRequired,
    socialUser: PropTypes.object
  };

  static defaultProps = {
    socialUser: null
  };

  constructor(props, context) {
    super(props, context);
    this.handleSignup = ::this.handleSignup;
  }

  logUserIn(result) {
    const user = { token: result.token, data: { ...result.data } };
    return this.props.routeSignupSuccess(user);
  }

  handleLogin(email, password) {
    const data = {
      type: 'local',
      email,
      password,
    };

    return this.props.feathers.authenticate(data)
    .then((res) => {
      console.info('~~Login~~', res);
      this.logUserIn(res);
    })
    .catch(err => {
      AlertMessage.fromRequest(err);
      console.info('error sign_login', err);
    });
  }

  handleSignup(data) {
    const { feathers } = this.props;
    console.log('SignupContainer', data);
    const userService = feathers.service(USER_SERVICE);
    if (feathers.get('user') !== null) {
      const _id = feathers.get('user')._id;
      const dataTemp = {
        ...data,
        isAlreadyCreated: true,
        shouldUpdate: false
      };
      userService.patch(_id, dataTemp)
        .then((result) => {
          this.handleLogin(data.email, data.password);
          console.info('Success Signup Social User', result);
        })
        .catch(e => console.info('Error Signup Social User', e));
    } else {
      const dataTemp = {
        ...data,
        isAlreadyCreated: false
      };
      userService.create(dataTemp)
      .then((result) => {
        this.handleLogin(data.email, data.password);
        console.info('handleSignup success', result);
      })
      .catch((e) => {
        console.info('handleSignup error', e);
        AlertMessage.showMessage(e.message, '');
      });
    }
  }

  render() {
    const { routeBack, feathers, socialUser } = this.props;
    const user = feathers.get('user');
    return (
      <View style={styles.container}>
        <Signup
          handleSignup={this.handleSignup}
          routeBack={routeBack}
          user={user === null ? socialUser : user}
        />
      </View>
    );
  }
}
export default connectFeathers(SignupContainer);

