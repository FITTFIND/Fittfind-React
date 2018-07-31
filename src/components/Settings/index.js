import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, ListView, Image, TouchableOpacity } from 'react-native';
import { SETTINGS_ITEM, MENU_ITEMS } from 'AppConstants';
import { BACKGROUND_COLOR, BORDER_COLOR, WHITE } from 'AppColors';
import { LabelText } from 'AppFonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  settingsListContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 5

  },
  itemContainer: {
    flex: 1,
    height: 80,
    borderBottomWidth: 2 / 2,
    borderBottomColor: BORDER_COLOR,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    width: 50,
  },
  labelContainer: {
    flex: 1,
  },
  labelText: {
    color: WHITE
  },
  icon: {
    width: 20,
    resizeMode: 'contain'
  }
});

export class Settings extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    feathers: PropTypes.object.isRequired,
    setCurrentScene: PropTypes.func,
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      items: SETTINGS_ITEM
    };
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.renderSettingsItem = ::this.renderSettingsItem;
    this.onPress = ::this.onPress;
  }

  onPress(rowData) {
    switch (SETTINGS_ITEM.indexOf(rowData)) {
      case 0:
        this.props.navigator.push('InviteCategoryScene');
        break;
      case 1: // payment
        this.props.navigator.push('PaymentScene');
        break;
      case 2:
        alert('Help');
        break;
      case 3:
        alert('Terms of service');
        break;
      case 4:
        alert('Privacy policy');
        break;
      case 5: // log out
        this.props.setCurrentScene(MENU_ITEMS.indexOf('Profile'));
        this.props.feathers.logout();
        this.props.showSideBar(false);
        this.props.disableSideBar(true);
        this.props.navigator.resetTo('LoginScene');
        break;
      default:
        break;
    }
  }

  renderSettingsItem(rowData) {
    let imgSrc = null;
    let imgStyle = null;
    switch (SETTINGS_ITEM.indexOf(rowData)) {
      case 0:
        imgSrc = require('img/icon_invite.png');
        imgStyle = [styles.icon, { width: 28 }];
        break;
      case 1:
        imgSrc = require('img/icon_card.png');
        imgStyle = [styles.icon, { width: 28 }];
        break;
      case 2:
        imgSrc = require('img/icon_help.png');
        imgStyle = [styles.icon, { width: 26 }];
        break;
      case 3:
        imgSrc = require('img/icon_terms.png');
        imgStyle = [styles.icon, { width: 20 }];
        break;
      case 4:
        imgSrc = require('img/icon_policy.png');
        imgStyle = [styles.icon, { width: 21 }];
        break;
      case 5:
        imgSrc = require('img/icon_log_out.png');
        imgStyle = [styles.icon, { width: 25 }];
        break;
      default:
        break;
    }
    return (
      <TouchableOpacity onPress={() => this.onPress(rowData)}>
        <View style={styles.itemContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={imgSrc}
              style={imgStyle}
            />
          </View>
          <View style={styles.labelContainer}>
            <LabelText style={styles.labelText} fontSize={13}>
              {rowData}
            </LabelText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const dataSource = this.dataSource.cloneWithRows(this.state.items);
    return (
      <View style={styles.container}>
        <View style={styles.settingsListContainer}>
          <ListView
            dataSource={dataSource}
            renderRow={(rowData) => this.renderSettingsItem(rowData)}
            automaticallyAdjustContentInsets={false}
          />
        </View>
      </View>
    );
  }
}
