import React, { PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import { LabelText } from 'AppFonts';
import { WHITE } from 'AppColors';

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
  senderMessageImage: {
    width: 170,
    height: 170,
    marginLeft: 10,
    borderRadius: 10
  },
  receiverMessageImage: {
    width: 170,
    height: 170,
    marginLeft: 10,
    borderRadius: 10,
    alignSelf: 'flex-end'
  },
  sentTimeContainer: {
    marginTop: 10,
    backgroundColor: 'transparent',
    alignSelf: 'center'
  },
  labelWhiteText: {
    color: WHITE
  },
  receiverImageTagContainer: {
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginRight: 10,
  },
  senderImageTagContainer: {
    marginBottom: 5,
    marginLeft: 10,
  }
});

const renderAvatar = (avatar) => (
  <Image source={{ uri: avatar }} style={styles.senderAvatar} />
);

const renderSenderImage = (rowData) => (
  <View style={styles.senderContainer}>
    <View style={styles.senderAvatarContainer}>
      {rowData.avatar !== '' ? renderAvatar(rowData.avatar) : <View /> }
    </View>
    <View style={styles.senderMessageImage}>
      <View style={styles.senderImageTagContainer}>
        <LabelText style={styles.labelWhiteText} fontSize={9}>
          {rowData.messageContent.name}
        </LabelText>
      </View>
      <Image
        source={{ uri: rowData.messageContent.content }}
        style={styles.senderAvatar}
      />
    </View>
  </View>
);
const renderReceiverImage = (rowData) => (
  <View style={styles.receiverContainer}>
    <View style={styles.receiverImageTagContainer}>
      <LabelText style={styles.labelWhiteText} fontSize={9}>
        {rowData.messageContent.name}
      </LabelText>
    </View>
    <View style={styles.receiverMessageImage}>
      <Image
        source={{ uri: rowData.messageContent.content }}
        style={styles.senderAvatar}
      />
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

export const MessageImage = ({ type, rowData }) => (
  <View style={styles.container}>
    {rowData.isShowTime ? renderShowTime(rowData.sendTime) : <View /> }
    {type === 'sender' ? renderSenderImage(rowData) : renderReceiverImage(rowData)}
  </View>
);

MessageImage.propTypes = {
  type: PropTypes.string,
  rowData: PropTypes.any
};
