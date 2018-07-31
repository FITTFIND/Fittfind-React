import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LabelText } from 'AppFonts';
import { displayDate } from 'AppUtilities';
import { BORDER_COLOR, GRAY_COLOR } from 'AppColors';
import { NAVBAR_MARGIN_HORIZONTAL, NOTIFICATION_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  userInfoContainer: {
    height: NOTIFICATION_HEIGHT,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: NAVBAR_MARGIN_HORIZONTAL,
    borderBottomWidth: 1 / 2,
    borderBottomColor: BORDER_COLOR
  },
  userImageContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userImage: {
    width: NOTIFICATION_HEIGHT - 15,
    height: NOTIFICATION_HEIGHT - 15,
    borderRadius: 17.5
  },
  userDetailContainer: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  aboveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  userNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  labelWhiteText: {
    color: 'white',
    backgroundColor: 'transparent'
  },
  updatedContainer: {
    justifyContent: 'center'
  },
  labelText: {
    color: GRAY_COLOR
  },
  userLocationContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 7,
    alignItems: 'flex-start'
  },
  messageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start'
  },
  msgFileTypeContainer: {
    flexDirection: 'row'
  },
  messageFileType: {
    width: 13,
    height: 13
  },
  labelFileTypeContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center'
  },
});

export class MessageNotification extends Component {
  static propTypes = {
    content: PropTypes.object,
    touchable: PropTypes.bool,
    onPress: PropTypes.func,
    isSent: PropTypes.bool
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      notification: props.content
    };
    this.onPress = ::this.onPress;
  }

  componentWillReceiveProps(props) {
    if (props.isSent) {
      this.setState({ notification: props.content });
    }
  }

  onPress() {
    this.props.onPress();
  }

  renderMessageContent(message) {
    return (
      <View style={styles.userLocationContainer}>
        <View style={styles.messageContainer}>
          {message.type === 'text' ?
            this.renderTextMessage(message.content) :
            this.renderImageMessage(message.name)}
        </View>
      </View>
    );
  }

  renderTextMessage(messageContent) {
    return (
      <LabelText style={styles.labelText} fontSize={12}>
        {messageContent}
      </LabelText>
    );
  }

  renderImageMessage(messageContent) {
    return (
      <View style={styles.msgFileTypeContainer}>
        <Image
          source={require('img/icon_message_filetype.png')}
          style={styles.messageFileType}
        />
        <View style={styles.labelFileTypeContainer}>
          <LabelText style={styles.labelText} fontSize={12}>
            {messageContent}
          </LabelText>
        </View>
      </View>
    );
  }

  render() {
    const { notification } = this.state;
    if (notification !== null) {
      let avatarUrl = null;
      if (notification.createdBy.avatarUrl !== '') {
        avatarUrl = { uri: notification.createdBy.avatarUrl };
      } else {
        if (notification.createdBy.isClient) {
          avatarUrl = require('img/temp_user_image.png');
        } else {
          avatarUrl = require('img/temp_trainer_image.png');
        }
      }
      const createdAt = new Date(notification.createdAt);
      const ComponentView = this.props.touchable ? TouchableOpacity : View;
      return (
        <ComponentView onPress={this.onPress} style={styles.userInfoContainer}>
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
                  {notification.createdBy.name}
                </LabelText>
              </View>
              <View style={styles.updatedContainer}>
                <LabelText style={styles.labelText} fontSize={11}>
                  {displayDate(createdAt)}
                </LabelText>
              </View>
            </View>
            {this.renderMessageContent(notification.message)}
          </View>
        </ComponentView>
      );
    }
    return (<View />);
  }
}
