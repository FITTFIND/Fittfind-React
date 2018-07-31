import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, WHITE } from 'AppColors';
import { ToggleButton } from 'AppComponents';
import { Message } from './message';
import { Notification } from './notification';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  toggleContainer: {
    alignSelf: 'stretch',
    height: 40
  },
});

const TAB_ITEMS = ['Message', 'Notification'];

export class Messages extends Component {
  static propTypes = {
    feathers: PropTypes.object,
    navigator: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTab: 'Message'
    };
    this.onTabSelected = ::this.onTabSelected;
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  renderSubComponent() {
    const { feathers, navigator } = this.props;
    const { selectedTab } = this.state;
    switch (selectedTab) {
      case 'Message':
        return (
          <Message
            feathers={feathers}
            navigator={navigator}
          />
        );
      case 'Notification':
        return (
          <Notification
            feathers={feathers}
            navigator={navigator}
          />
        );
      default:
        return (<View />);
    }
  }

  render() {
    const { selectedTab } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <ToggleButton
            options={TAB_ITEMS}
            onSelect={this.onTabSelected}
            value={selectedTab}
            selectedTextStyle={{ color: WHITE }}
          />
        </View>
        {this.renderSubComponent()}
      </View>
    );
  }
}
