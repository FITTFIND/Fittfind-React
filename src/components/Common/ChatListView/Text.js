import React, { PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LabelText } from 'AppFonts';
import { WINDOW_WIDTH } from 'AppConstants';
import { GRAY_COLOR, BLUE, WHITE } from 'AppColors';
import moment from 'moment';

const commonStyles = {
  messageView: {
    maxWidth: WINDOW_WIDTH - 110,
    minWidth: 70,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 18,
  },
  labelText: {
    lineHeight: 20,
    textAlign: 'center'
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  senderContainer: {
    flex: 1,
    marginTop: 16,
    flexDirection: 'row'
  },
  receiverContainer: {
    flex: 1,
    marginTop: 16,
  },
  senderAvatarContainer: {
    marginTop: 5,
    width: 35,
    height: 35,
  },
  senderAvatar: {
    flex: 1,
    resizeMode: 'stretch',
    borderRadius: 17.5
  },
  senderMessageText: {
    backgroundColor: '#1e1e1e',
    marginLeft: 5,
    alignSelf: 'center',
    ...commonStyles.messageView
  },
  receiverMessageText: {
    backgroundColor: BLUE,
    right: 0,
    alignSelf: 'flex-end',
    ...commonStyles.messageView
  },
  senderText: {
    color: GRAY_COLOR,
    ...commonStyles.labelText
  },
  receiverText: {
    color: WHITE,
    ...commonStyles.labelText
  },
  sentTimeContainer: {
    marginTop: 10,
    backgroundColor: 'transparent',
    alignSelf: 'center'
  },
  labelWhiteText: {
    color: WHITE
  }
});

const renderAvatar = (avatar) => (
  <Image source={{ uri: avatar }} style={styles.senderAvatar} />
);

const renderSenderMessage = (rowData) => (
  <View style={styles.senderContainer}>
    <View style={styles.senderAvatarContainer}>
      {rowData.avatar !== '' ? renderAvatar(rowData.avatar) : <View /> }
    </View>
    <View style={styles.senderMessageText}>
      <LabelText style={styles.senderText} fontSize={14} numberOfLines={0}>
        {rowData.messageContent.content}
      </LabelText>
    </View>
  </View>
);

const renderReceiverMessage = (rowData) => (
  <View style={styles.receiverContainer}>
    <View style={styles.receiverMessageText}>
      <LabelText style={styles.receiverText} fontSize={14} numberOfLines={0}>
        {rowData.messageContent.content}
      </LabelText>
    </View>
  </View>
);

const showDate = (sendDate) => {
  const d = moment(sendDate);
  const d1 = d.format('MMMM D, YYYY,');
  const d2 = d.format(' hh:mm A');
  const value = `${d1}${d2}`;
  return value;
};


const renderShowTime = (sendDate) => (
  <View style={styles.sentTimeContainer}>
    <LabelText style={styles.labelWhiteText} fontSize={9} numberOfLines={0}>
      {showDate(sendDate)}
    </LabelText>
  </View>
);

export const MessageText = ({ type, rowData }) => (
  <View style={styles.container}>
    {rowData.isShowTime ? renderShowTime(rowData.sendTime) : <View /> }
    {type === 'sender' ? renderSenderMessage(rowData) : renderReceiverMessage(rowData)}
  </View>
);

MessageText.propTypes = {
  type: PropTypes.string,
  rowData: PropTypes.any
};
