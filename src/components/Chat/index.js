import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { BACKGROUND_COLOR, DARK_COLOR, WHITE, GRAY_COLOR, BORDER_COLOR } from 'AppColors';
import { WINDOW_HEIGHT, NAVBAR_MARGIN_TOP } from 'AppConstants';
import { ChatListView } from 'AppComponents';
import { MESSAGE_SERVICE, UPLOAD_SERVICE, THREAD_SERVICE } from 'AppServices';
import { ImagePicker } from 'AppUtilities';
// import { updateActiveTime } from 'AppUtilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  bottomContainer: {
    position: 'absolute',
    top: WINDOW_HEIGHT - 50 - NAVBAR_MARGIN_TOP - 40,
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    backgroundColor: DARK_COLOR,
    flexDirection: 'row',
    borderTopWidth: 1 / 2,
    borderTopColor: BORDER_COLOR
  },
  attachIconContainer: {
    width: 50,
    alignItems: 'center'
  },
  addTextContainer: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: WHITE,
    marginVertical: 8,
    paddingHorizontal: 13
  },
  sendContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  attachIcon: {
    width: 23,
    resizeMode: 'contain'
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 15
  },
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageToSendContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageToSend: {
    flex: 1,
    resizeMode: 'contain'
  }
});

export class Chat extends Component {
  static propTypes = {
    feathers: PropTypes.object,
    otherUser: PropTypes.object,
    threadId: PropTypes.string,
    setThreadId: PropTypes.func,
    setHideNavBar: PropTypes.func,
    hideNavBar: PropTypes.bool,
  };

  static defaultProps = {
    threadId: null
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      messageText: '',
      isSent: false,
      threadId: props.threadId,
      isLoading: true,
      messageLogs: [],
      isLoadingMore: false,
      isShowingImageToSend: false,
    };
    this.changeMessageText = ::this.changeMessageText;
    this.onSend = ::this.onSend;
    this.returnToInitState = ::this.returnToInitState;
    this.onSendFile = ::this.onSendFile;
    this.loadMore = ::this.loadMore;
    this.onMessageCreated = null;
    this.currentUser = null;
    this.imageToSend = null;
    this.$skip = 0;
  }

  componentDidMount() {
    const { feathers, otherUser, setThreadId } = this.props;
    this.currentUser = feathers.get('user');
    const threadService = feathers.service(THREAD_SERVICE);
    const query = {
      senderId: this.currentUser._id,
      receiverId: otherUser._id
    };
    threadService.find({ query })
    .then(res => {
      this.setState({ isLoading: false });
      let threadId = null;
      if (res.length !== 0) {
        threadId = res[0]._id;
        this.setState({ threadId });
        setThreadId(threadId);
        this.loadMessages();
      }
    })
    .catch(e => {
      this.setState({ isLoading: false });
      console.info('Error finding Thread', e);
    });
  }

  componentWillReceiveProps(props) {
    if (!props.hideNavBar) {
      this.setState({ isShowingImageToSend: false });
    }
  }

  componentWillUnmount() {
    const { feathers } = this.props;
    const messageService = feathers.service(MESSAGE_SERVICE);
    if (this.onMessageCreated) {
      messageService.off('created', this.onMessageCreated);
      this.onMessageCreated = null;
    }
  }

  onSendFile() {
    ImagePicker.show()
    .then(({ source }) => {
      if (source) {
        this.imageToSend = source.uri;
        this.props.setHideNavBar(true);
        this.setState({ isShowingImageToSend: true });
        // this.uploadImage(source.uri);
      }
    })
    .catch(() => { });
  }

  onSend() {
    const { otherUser } = this.props;
    const { threadId, messageText, isShowingImageToSend } = this.state;
    if (isShowingImageToSend) {
      const message = messageText.replace(/\s+/g, '');
      if (message === '') {
        Alert.alert('Error', 'Please type Image Tag, not only spaces');
        this.setState({ messageText: '' });
        return;
      }
      this.uploadImage(this.imageToSend);
    } else {
      const message = messageText.replace(/\s+/g, '');
      if (message === '') {
        Alert.alert('Error', 'Please type your words, not only spaces');
        this.setState({ messageText: '' });
        return;
      }
      const data = {
        threadId,
        messageContent: messageText,
        messageType: 'text',
        messageName: 'message',
        senderId: this.currentUser._id,
        receiverId: otherUser._id,
      };
      this.sendMessage(data);
    }
  }

  onSendImage(url) {
    const { otherUser } = this.props;
    const { threadId, messageText } = this.state;
    const data = {
      threadId,
      messageContent: url,
      messageType: 'image',
      messageName: messageText,
      senderId: this.currentUser._id,
      receiverId: otherUser._id,
    };
    this.sendMessage(data);
  }

  sendMessage(data) {
    const { feathers, setThreadId } = this.props;
    const { threadId } = this.state;
    const messageService = feathers.service(MESSAGE_SERVICE);
    messageService.create(data)
    .then((hook) => {
      console.info('MessageService~~~~~~~', hook);
      console.info('MessageService~~~~~~~', threadId);
      if (threadId === null) {
        setThreadId(hook.threadId);
        this.setState({ threadId: hook.threadId });
        if (hook.isAlreadyThreadCreated) {
          this.loadMessages();
        } else {
          this.onMessageCreated = ::this.showNewMessage;
          messageService.on('created', this.onMessageCreated);
        }
      }
      this.setState({ messageText: '' });
    })
    .catch((e) => {
      console.info('error', e);
    });
  }

  loadMessages() {
    const { feathers, otherUser } = this.props;
    const { threadId } = this.state;
    const query = { threadId, $sort: { createdAt: -1 } };
    const messageService = feathers.service(MESSAGE_SERVICE);
    this.setState({ isLoading: true });
    messageService.find({ query })
    .then(resultArray => {
      const result = resultArray.data.reverse();
      this.$skip = this.$skip + resultArray.limit;
      const messageLogs = result.map((message, index) => {
        let type = ';';
        let name = '';
        let avatar = '';
        let isShowTime = false;
        if (message.senderId === this.currentUser._id) {
          type = 'receiver';
          name = this.currentUser.name;
          avatar = this.currentUser.avatarUrl;
        } else {
          type = 'sender';
          name = otherUser.name;
          avatar = otherUser.avatarUrl;
        }
        const sendTime = new Date(message.createdAt);
        const messageContent = {
          type: message.messageType,
          content: message.messageContent,
          name: message.messageName,
        };
        if (index > 0) {
          const beforeMessage = result[index - 1];
          if (type === 'sender' && beforeMessage.senderId === otherUser._id) {
            avatar = '';
          }
          const seconds =
            (sendTime.getTime() - new Date(beforeMessage.createdAt).getTime()) / 1000;
          if (seconds > 1800) {
            isShowTime = true;
          }
        } else {
          isShowTime = true;
        }
        return {
          type,
          name,
          avatar,
          sendTime,
          isShowTime,
          messageContent,
        };
      });
      console.info('MessageLogs~Chat', messageLogs);
      this.setState({ messageLogs, isLoading: false });
      this.onMessageCreated = ::this.showNewMessage;
      messageService.on('created', this.onMessageCreated);
    })
    .catch(e => {
      this.setState({ isLoading: false });
      console.info('Error Finding Message', e);
    });
  }

  showNewMessage(message) {
    const { setHideNavBar } = this.props;
    const { messageLogs, isShowingImageToSend, threadId } = this.state;
    if (threadId === message.threadId) {
      this.$skip = this.$skip + 1;
      let newMessage = {
        type: message.createdBy._id === this.currentUser._id ? 'receiver' : 'sender',
        name: message.createdBy.name,
        avatar: message.createdBy.avatarUrl,
        sendTime: new Date(message.createdAt),
        messageContent: {
          type: message.messageType,
          content: message.messageContent,
          name: message.messageName
        }
      };
      let isShowTime = false;
      const length = messageLogs.length;
      if (length > 0) {
        const beforeMessage = messageLogs[length - 1];
        if (newMessage.type === 'sender' && beforeMessage.type === newMessage.type) {
          newMessage.avatar = '';
        }
        const seconds =
          (newMessage.sendTime.getTime() - beforeMessage.sendTime.getTime()) / 1000;
        if (seconds > 1800) {
          isShowTime = true;
        }
      } else {
        isShowTime = true;
      }
      newMessage = { ...newMessage, isShowTime };
      messageLogs.push(newMessage);
      this.setState({ isSent: true, isLoadingMore: true });
      if (isShowingImageToSend) {
        setHideNavBar(false);
      }
    }
  }

  uploadImage(media) {
    const { feathers } = this.props;
    feathers.service(UPLOAD_SERVICE).create({ media })
    .then((result) => {
      // this.imageToSend = null;
      this.onSendImage(result.url, media);
    })
    .catch((e) => {
      console.info('error upload', e);
    });
  }

  changeMessageText(messageText) {
    this.setState({ messageText });
  }

  returnToInitState() {
    this.setState({
      isSent: false,
      messageText: '',
    });
  }

  loadMore(isLoad) {
    if (isLoad) {
      const { feathers, otherUser } = this.props;
      const { threadId, messageLogs } = this.state;
      const query = {
        threadId,
        $sort: { createdAt: -1 },
        $skip: this.$skip
      };
      const messageService = feathers.service(MESSAGE_SERVICE);
      messageService.find({ query })
      .then(resultArray => {
        const result = resultArray.data.reverse();
        console.info('Finding Message Result', result);
        this.$skip = this.$skip + resultArray.limit;
        console.info('skip count', this.$skip);
        const oldMessageLogs = result.map((message, index) => {
          let type = ';';
          let name = '';
          let avatar = '';
          let isShowTime = false;
          if (message.senderId === this.currentUser._id) {
            type = 'receiver';
            name = this.currentUser.name;
            avatar = this.currentUser.avatarUrl;
          } else {
            type = 'sender';
            name = otherUser.name;
            avatar = otherUser.avatarUrl;
          }
          const sendTime = new Date(message.createdAt);
          const messageContent = {
            type: message.messageType,
            content: message.messageContent,
            name: message.messageName,
          };
          if (index > 0) {
            const beforeMessage = result[index - 1];
            if (type === 'sender' && beforeMessage.senderId === otherUser._id) {
              avatar = '';
            }
            const seconds =
              (sendTime.getTime() - new Date(beforeMessage.createdAt).getTime()) / 1000;
            if (seconds > 1800) {
              isShowTime = true;
            }
          } else {
            isShowTime = true;
          }
          return {
            type,
            name,
            avatar,
            sendTime,
            isShowTime,
            messageContent,
          };
        });
        const updatedMessageLogs = oldMessageLogs.concat(messageLogs);
        updatedMessageLogs.forEach((item, i) => {
          if (i > 0) {
            const seconds = (updatedMessageLogs[i].sendTime.getTime() -
              updatedMessageLogs[i - 1].sendTime.getTime()) / 1000;
            if (seconds > 1800) {
              updatedMessageLogs[i].isShowTime = true;
            } else {
              updatedMessageLogs[i].isShowTime = false;
            }
          } else {
            updatedMessageLogs[i].isShowTime = true;
          }
        });
        console.info('MessageLogs~Chat', updatedMessageLogs);
        this.setState({
          messageLogs: updatedMessageLogs,
          isLoadingMore: false,
          isSent: true,
        });
      })
      .catch(e => {
        console.info('Error Finding Message', e);
      });
    }
  }

  renderChatBottom() {
    const { messageText } = this.state;
    return (
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={this.onSendFile}>
          <View style={styles.attachIconContainer}>
            <Image source={require('img/icon_attachment.png')} style={styles.attachIcon} />
          </View>
        </TouchableOpacity>
        <View style={styles.addTextContainer}>
          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
            returnKeyType="send"
            placeholder="Message"
            placeholderTextColor = {GRAY_COLOR}
            value={messageText}
            onChangeText={this.changeMessageText}
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity onPress={this.onSend}>
          <View style={styles.sendContainer}>
            <Image source={require('img/icon_send.png')} style={styles.attachIcon} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderChat() {
    const { isSent, messageLogs, isLoadingMore } = this.state;
    // const newMessage = {
    //   type: 'receiver',
    //   name: '',
    //   avatar: '',
    //   sendTime: new Date(),
    //   messageContent: {
    //     type: newMessageType,
    //     content: newMessageData,
    //     name: ''
    //   }
    // };
    return (
      <View style={styles.container}>
        <ChatListView
          messages={messageLogs}
          isSent={isSent}
          returnToInitState={this.returnToInitState}
          loadMore={this.loadMore}
          isLoadingMore={isLoadingMore}
        />
        {this.renderChatBottom()}
      </View>
    );
  }

  renderActivityIndicator() {
    const { isLoading } = this.state;
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

  renderImageToSend() {
    return (
      <View style={styles.imageToSendContainer}>
        <Image source={{ uri: this.imageToSend }} style={styles.imageToSend} />
        {this.renderChatBottom()}
      </View>
    );
  }

  render() {
    const { isLoading, isShowingImageToSend } = this.state;
    if (isLoading) {
      return this.renderActivityIndicator();
    }
    if (isShowingImageToSend) {
      return this.renderImageToSend();
    }
    return this.renderChat();
  }
}
