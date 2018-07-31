import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';
import { NAVBAR_MARGIN_HORIZONTAL } from 'AppConstants';
import { BACKGROUND_COLOR, BORDER_COLOR, GRAY_COLOR, BLUE } from 'AppColors';
import { LabelText } from 'AppFonts';
import { THREAD_SERVICE } from 'AppServices';
import { displayDate } from 'AppUtilities';
import { RefreshListView } from 'AppComponents';

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
  unReadCount: {
    width: 50
  },
  labelUnRead: {
    backgroundColor: BLUE,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    width: 21,
    height: 21,
    borderRadius: 10.5,
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

export class Message extends Component {
  static propTypes = {
    feathers: PropTypes.object,
    navigator: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      items: [],
      selectedRow: 0,
      isLoading: true,
      isRefreshing: false,
    };
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.renderMessageItem = ::this.renderMessageItem;
    this.renderUnReadCount = ::this.renderUnReadCount;
    this.renderMessageContent = ::this.renderMessageContent;
    this.showDetail = ::this.showDetail;
    this._onRefresh = ::this._onRefresh;
    this._onInfinite = ::this._onInfinite;
    this.currentUser = null;
    this.messageItems = null;
  }

  componentDidMount() {
    const { feathers } = this.props;
    this.currentUser = feathers.get('user');
    console.info('Message Scene', this.currentUser);
    const threadService = feathers.service(THREAD_SERVICE);
    const query = {
      involved: { $elemMatch: { $eq: this.currentUser._id } },
      getMessage: true,
    };
    threadService.find({ query })
    .then(curentUserThreads => {
      console.info('current UserThreads', curentUserThreads);
      this.messageItems = curentUserThreads.map((thread) => {
        const threadId = thread._id;
        const lastMessage = {
          message: thread.lastMessage.messageContent,
          type: thread.lastMessage.messageType,
          name: thread.lastMessage.messageName,
          createdAt: new Date(thread.lastMessage.createdAt),
        };
        const unReadCount = thread.unReadCount;
        let otherUser = null;
        thread.involvedArray.forEach((item) => {
          if (this.currentUser._id !== item._id) {
            otherUser = item;
          }
        });
        return {
          threadId,
          lastMessage,
          unReadCount,
          otherUser
        };
      });
      this.setState({ items: this.messageItems, isLoading: false });
      console.info('~~~', this.messageItems);
    })
    .catch(e => {
      this.setState({ isLoading: false });
      console.info('Error finding Current User Thread', e);
    });
  }

  _onRefresh() {
    const { feathers } = this.props;
    const threadService = feathers.service(THREAD_SERVICE);
    const query = {
      involved: { $elemMatch: { $eq: this.currentUser._id } },
      getMessage: true,
    };
    this.setState({ isRefreshing: true });
    threadService.find({ query })
    .then(curentUserThreads => {
      this.messageItems = curentUserThreads.map((thread) => {
        const threadId = thread._id;
        const lastMessage = {
          message: thread.lastMessage.messageContent,
          type: thread.lastMessage.messageType,
          name: thread.lastMessage.messageName,
          createdAt: new Date(thread.lastMessage.createdAt),
        };
        const unReadCount = thread.unReadCount;
        let otherUser = null;
        thread.involvedArray.forEach((item) => {
          if (this.currentUser._id !== item._id) {
            otherUser = item;
          }
        });
        return {
          threadId,
          lastMessage,
          unReadCount,
          otherUser
        };
      });
      this.setState({ items: this.messageItems, isRefreshing: false });
    })
    .catch(e => {
      console.info('Error finding Current User Thread', e);
    });
  }

  _onInfinite() {
    this._onRefresh();
  }

  showDetail(rowData) {
    const { navigator } = this.props;
    navigator.push({
      name: 'ChatScene',
      passProps: { otherUser: rowData.otherUser, threadId: rowData.threadId }
    });
  }

  renderMessageItem(rowData) {
    let avatarUrl = null;
    if (rowData.otherUser.avatarUrl !== '') {
      avatarUrl = { uri: rowData.otherUser.avatarUrl };
    } else {
      if (rowData.otherUser.isClient) {
        avatarUrl = require('img/temp_user_image.png');
      } else {
        avatarUrl = require('img/temp_trainer_image.png');
      }
    }
    return (
      <TouchableOpacity onPress={() => this.showDetail(rowData)}>
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
                  {rowData.otherUser.name}
                </LabelText>
              </View>
              <View style={styles.updatedContainer}>
                <LabelText style={styles.labelText} fontSize={11}>
                  {displayDate(rowData.lastMessage.createdAt)}
                </LabelText>
              </View>
            </View>
            {this.renderMessageContent(rowData)}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderMessageContent(rowData) {
    return (
      <View style={styles.userLocationContainer}>
        <View style={styles.messageContainer}>
          {rowData.lastMessage.type === 'text' ?
            this.renderMessage(rowData.lastMessage.message) :
            this.renderImageMessage(rowData.lastMessage.name)}
        </View>
        <View style={styles.unReadCount}>
          {rowData.unReadCount !== 0 ? this.renderUnReadCount(rowData.unReadCount) : <View /> }
        </View>
      </View>
    );
  }

  renderUnReadCount(rowData) {
    return (
      <View style={styles.labelUnRead}>
        <LabelText style={styles.labelWhiteText} fontSize={rowData > 100 ? 9.5 : 11}>
          {rowData}
        </LabelText>
      </View>
    );
  }

  renderMessage(data) {
    return (
      <LabelText style={styles.labelText} fontSize={12}>
        {data}
      </LabelText>
    );
  }

  renderImageMessage(rowData) {
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
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <Modal
          animationType="none"
          visible={isLoading}
          onRequestClose={(res) => console.info('OnRequestClose', res) }
          transparent={true}
        >
          <View style={styles.indicatorContainer}>
            <ActivityIndicator size="small" color="white" />
          </View>
        </Modal>
      );
    }
    return null;
  }

  renderMessageListView() {
    const { items, isRefreshing } = this.state;
    if (items.length !== 0) {
      const dataSource = this.dataSource.cloneWithRows(items);
      return (
        <View style={styles.container}>
          <View style={styles.listViewContainer}>
            <RefreshListView
              dataSource={dataSource}
              renderRow={this.renderMessageItem}
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
    return (
      <View style={styles.container}>
        {this.renderMessageListView()}
        {this.renderActivityIndicator()}
      </View>
    );
  }
}
