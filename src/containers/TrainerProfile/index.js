import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { TrainerProfile } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class TrainerProfileContainer extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    otherUser: PropTypes.object,
    feathers: PropTypes.object.isRequired,
    disableSideBar: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  render() {
    const {
      navigator,
      otherUser,
      feathers,
      disableSideBar
    } = this.props;
    return (
      <View style={styles.container}>
        <TrainerProfile
          navigator={navigator}
          otherUser={otherUser}
          feathers={feathers}
          disableSideBar={disableSideBar}
        />
      </View>
    );
  }
}
export default connectFeathers(TrainerProfileContainer);
