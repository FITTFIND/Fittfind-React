import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { Login } from 'AppComponents';
import { DARK_COLOR } from 'AppColors';
import { AlertMessage } from 'AppUtilities';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLOR
  }
});


export function LoginContainer({ feathers, routeSignup, routeLoginSuccess, signupSocialUser }) {
  const logUserIn = (result) => {
    const user = { token: result.token, data: { ...result.data } };
    if (result.data.isClient === undefined) {
      return signupSocialUser(user.data);
    }
    return routeLoginSuccess(user);
  };

  const handleLogin = (email, password) => {
    const data = {
      type: 'local',
      email,
      password
    };

    return feathers.authenticate(data)
      .then((res) => {
        logUserIn(res);
      })
      .catch(err => AlertMessage.fromRequest(err));
  };

  const authenticateToken = (token) => {
    feathers.set('token', '');
    console.info('authenticateToken', token);
    feathers.authenticate({ type: 'token', token })
      .then((result) => logUserIn(result))
      .catch((e) => {
        debugger;
        console.info(e);
        feathers.logout();
      });
  };

  return (
    <View style={styles.container}>
      <Login
        feathers={feathers}
        authenticateToken={authenticateToken}
        handleLogin = {handleLogin}
        routeSignup = {routeSignup}
      />
    </View>
  );
}

LoginContainer.propTypes = {
  feathers: PropTypes.object.isRequired,
  routeSignup: PropTypes.func.isRequired,
  routeLoginSuccess: PropTypes.func.isRequired,
  signupSocialUser: PropTypes.func,
};
