import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, ListView } from 'react-native';
import { NOTIFICATION_SERVICE } from 'AppServices';
import { LabelText } from 'AppFonts';
import { displayDate } from 'AppUtilities';
import { RefreshListView } from 'AppComponents';
import { BACKGROUND_COLOR, BORDER_COLOR, GRAY_COLOR } from 'AppColors';
import { NAVBAR_MARGIN_HORIZONTAL } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  listViewContainer: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  userInfoContainer: {
    height: 85,
    flex: 4,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: NAVBAR_MARGIN_HORIZONTAL,
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR
  },
  userImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userDetailContainer: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userImage: {
    width: 56,
    height: 56,
    borderRadius: 28
  },
  userLocationContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 7,
    alignItems: 'flex-start'
  },
  userNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  labelWhiteText: {
    color: 'white',
    backgroundColor: 'transparent'
  },
  labelText: {
    color: GRAY_COLOR
  },
  aboveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  updatedContainer: {
    justifyContent: 'center'
  },
  messageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start'
  },
  messageFileType: {
    width: 13,
    height: 13
  },
  msgFileTypeContainer: {
    flexDirection: 'row'
  },
  labelFileTypeContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center'
  },
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export class Notification extends Component {
  static propTypes = {
    feathers: PropTypes.object,
    navigator: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      items: [],
      isLoading: true,
      isRefreshing: false,
    };
    this.currentUser = null;
    this.notificationListItem = null;
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.renderNotificationItem = ::this.renderNotificationItem;
    this._onRefresh = ::this._onRefresh;
    this._onInfinite = ::this._onInfinite;
  }

  componentDidMount() {
    const { feathers } = this.props;
    this.currentUser = feathers.get('user');
    this.getListItems(this.currentUser._id);
  }

  async getListItems(receiverId) {
    const { feathers } = this.props;
    const notificationService = feathers.service(NOTIFICATION_SERVICE);
    try {
      const query = {
        receiverId
      };
      const result = await notificationService.find({ query });
      this.notificationListItem = result.map((item) => {
        const sender = {
          id: item.senderId,
          name: item.senderBy.name,
          avatarUrl: item.senderBy.avatarUrl,
          isClient: item.senderBy.isClient,
        };
        const message = {
          ...item.message
        };
        return {
          sender,
          message,
          type: item.type,
          createdAt: new Date(item.createdAt)
        };
      });
      this.setState({ isLoading: false, items: this.notificationListItem });
    } catch (e) {
      console.info('error finding notification', e);
    }
  }

  async refreshNotification() {
    const { feathers } = this.props;
    const notificationService = feathers.service(NOTIFICATION_SERVICE);
    try {
      const query = {
        receiverId: this.currentUser._id,
      };
      const result = await notificationService.find({ query });
      this.notificationListItem = result.map((item) => {
        const sender = {
          id: item.senderId,
          name: item.senderBy.name,
          avatarUrl: item.senderBy.avatarUrl,
          isClient: item.senderBy.isClient,
        };
        const message = {
          ...item.message
        };
        return {
          sender,
          message,
          type: item.type,
          createdAt: new Date(item.createdAt)
        };
      });
      this.setState({ isRefreshing: false, items: this.notificationListItem });
    } catch (e) {
      console.info('error~~', e);
    }
  }

  _onRefresh() {
    this.setState({ isRefreshing: true });
    this.refreshNotification();
  }

  _onInfinite() {
    this._onRefresh();
  }

  renderNotificationItem(rowData) {
    let avatarUrl = null;
    if (rowData.sender.avatarUrl !== '') {
      avatarUrl = { uri: rowData.sender.avatarUrl };
    } else {
      if (rowData.sender.isClient) {
        avatarUrl = require('img/temp_user_image.png');
      } else {
        avatarUrl = require('img/temp_trainer_image.png');
      }
    }
    return (
      <View style={styles.userInfoContainer}>
        <View style={styles.userImageContainer}>
          <Image
            source={avatarUrl}
            style={styles.userImage}
          />
        </View>
        <View style={styles.userDetailContainer}>
          <View style={styles.aboveContainer}>
            <View style={styles.userNameContainer}>
              <LabelText style={styles.labelWhiteText} fontSize={13}>
                {rowData.sender.name}
              </LabelText>
            </View>
            <View style={styles.updatedContainer}>
              <LabelText style={styles.labelText} fontSize={11}>
                {displayDate(rowData.createdAt)}
              </LabelText>
            </View>
          </View>
          {this.renderNotificationContent(rowData)}
        </View>
      </View>
    );
  }

  renderNotificationContent(rowData) {
    return (
      <View style={styles.userLocationContainer}>
        <View style={styles.messageContainer}>
          {rowData.message.type === 'text' ?
            this.renderNotification(rowData.message.content) :
            this.renderImageNotification(rowData.message.name)}
        </View>
      </View>
    );
  }

  renderNotification(data) {
    return (
      <LabelText style={styles.labelText} fontSize={12}>
        {data}
      </LabelText>
    );
  }

  renderImageNotification(rowData) {
    return (
      <View style={styles.msgFileTypeContainer}>
        <Image
          source={require('img/icon_message_filetype.png')}
          style={styles.messageFileType}
        />
        <View style={styles.labelFileTypeContainer}>
          <LabelText style={styles.labelText} fontSize={12}>
            {rowData}
          </LabelText>
        </View>
      </View>
    );
  }

  renderActivityIndicator() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="small" color="white" />
      </View>
    );
  }

  renderNotificationListView() {
    const { items, isRefreshing } = this.state;
    if (items.length !== 0) {
      const dataSource = this.dataSource.cloneWithRows(items);
      return (
        <View style={styles.container}>
          <View style={styles.listViewContainer}>
            <RefreshListView
              dataSource={dataSource}
              renderRow={this.renderNotificationItem}
              refreshing={isRefreshing}
              onRefresh={this._onRefresh}
              onInfinite={this._onInfinite}
              loadedAllData={() => false}
            />
          </View>
        </View>
      );
    }
    return (<View style={styles.container} />);
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return this.renderActivityIndicator();
    }
    return this.renderNotificationListView();
  }
}
