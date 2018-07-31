import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, ListView, TouchableOpacity } from 'react-native';
import { LabelText } from 'AppFonts';
import { WHITE, BACKGROUND_COLOR, BORDER_COLOR } from 'AppColors';
import { AppInviteDialog } from 'react-native-fbsdk';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  listViewContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  listViewItem: {
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 2 / 2,
    borderBottomColor: BORDER_COLOR,
  },
  labelWhite: {
    color: WHITE
  },
});

export class InviteCategory extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      items: ['Facebook', 'Linkedin'],
      facebookInviteContent: {
        applinkUrl: 'https://fb.me/1647314452231644',
      }
    };
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.renderListViewItem = ::this.renderListViewItem;
  }
  onPress(item) {
    if (item === 'Facebook') {
      this.shareLink();
    } else {
      this.props.navigator.push('InviteScene');
    }
  }
  shareLink() {
    const { facebookInviteContent } = this.state;
    AppInviteDialog.canShow(facebookInviteContent)
    .then(canShow => {
      if (canShow) {
        return AppInviteDialog.show(facebookInviteContent);
      }
      return null;
    })
    .then(result => {
      if (result.isCancelled) {
        console.info('Facebook invite Cancelled', result.isCancelled);
      } else {
        console.info('Share was successful with result: ', result);
      }
    })
    .catch(e => console.info('error facebook invite', e));
  }
  renderListViewItem(item) {
    return (
      <TouchableOpacity style={styles.listViewItem} onPress={() => this.onPress(item)}>
        <LabelText style={styles.labelWhite} fontSize={15}>
          {item}
        </LabelText>
      </TouchableOpacity>
    );
  }
  render() {
    const { items } = this.state;
    const dataSource = this.dataSource.cloneWithRows(items);
    return (
      <View style={styles.container}>
        <View style={styles.listViewContainer}>
          <ListView
            dataSource={dataSource}
            renderRow={this.renderListViewItem}
          />
        </View>
      </View>
    );
  }
}
