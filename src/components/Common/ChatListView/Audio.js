import React, { PropTypes } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LabelText } from 'AppFonts';
import { WINDOW_WIDTH } from 'AppConstants';
import { GRAY_COLOR, BLUE, WHITE } from 'AppColors';
import { Slider } from 'AppComponents';

export const styles = StyleSheet.create({
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
  audioPlayContainer: {
    width: 23,
    height: 23,
  },
  loadingIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 23,
    height: 23,
  },
  audioPlayIcon: {
    width: 23,
    height: 23,
    resizeMode: 'stretch',
    tintColor: GRAY_COLOR
  },
  audioReceiverPlayIcon: {
    width: 23,
    height: 23,
    resizeMode: 'stretch',
    tintColor: WHITE
  },
  senderAvatarContainer: {
    marginTop: 7.5,
    width: 35,
    height: 35,
  },
  senderAvatar: {
    flex: 1,
    resizeMode: 'stretch',
    borderRadius: 17.5
  },
  senderMessageAudio: {
    marginLeft: 5,
    backgroundColor: '#1e1e1e',
    width: WINDOW_WIDTH - 110,
    height: 50,
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 3
  },
  messageAudioInfo: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center'
  },
  audioNameContainer: {
    marginLeft: 10,
    flex: 1,
    height: 23,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  audioNameText: {
    color: GRAY_COLOR
  },
  audioDurationContainer: {
    marginLeft: 10,
    height: 23,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  audioProgressContainer: {
    height: 9,
  },
  audioProgress: {
    top: 0,
    height: 9
  },
  trackStyle: {
    height: 2,
    borderRadius: 2
  },
  thumbStyle: {
    width: 0,
    height: 0
  },
  receiverMessageAudio: {
    marginLeft: 5,
    backgroundColor: BLUE,
    width: WINDOW_WIDTH - 110,
    height: 50,
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 3,
    alignSelf: 'flex-end'
  },
  receiverAudioText: {
    color: WHITE
  }
});


function renderUnableSenderAudioArea(audioInfo) {
  const messageContent = audioInfo.rowData.messageContent;
  const loadingIcon = (
    <View style={styles.audioPlayContainer}>
      <ActivityIndicator
        animating={true}
        style={styles.loadingIcon}
        size="small"
      />
    </View>
  );
  const audioPlayIcon = (
    <View style={styles.audioPlayContainer}>
      <Image source={audioInfo.playIcon} style={styles.audioPlayIcon} />
    </View>
  );
  return (
    <View style={styles.senderContainer}>
      <View style={styles.senderAvatarContainer}>
        <Image source={{ uri: audioInfo.rowData.avatar }} style={styles.senderAvatar} />
      </View>
      <View style={styles.senderMessageAudio}>
        <View style={styles.messageAudioInfo}>
          {audioInfo.isBuffering && audioInfo.isSelected ? loadingIcon : audioPlayIcon}
          <View style={styles.audioNameContainer}>
            <LabelText style={styles.audioNameText}>
              {messageContent.name}
            </LabelText>
          </View>
          <View style={styles.audioDurationContainer}>
            <LabelText style={styles.audioNameText}>
              {audioInfo.showTime}
            </LabelText>
          </View>
        </View>
        <View style={styles.audioProgressContainer}>
          <Slider
            style={styles.audioProgress}
            trackStyle={styles.trackStyle}
            maximumValue={audioInfo.isSelected ? audioInfo.audioDuration : 100}
            minimumTrackTintColor={GRAY_COLOR}
            maximumTrackTintColor={"#313131"}
            minimumValue={0}
            thumbStyle={styles.thumbStyle}
            value={audioInfo.isSelected ? audioInfo.audioProgress : 0}
            disabled={true}
          />
        </View>
      </View>
    </View>
  );
}

function renderTouchableSenderAudioArea(audioInfo, onPress) {
  const messageContent = audioInfo.rowData.messageContent;
  const loadingIcon = (
    <View style={styles.audioPlayContainer}>
      <ActivityIndicator
        animating={true}
        style={styles.loadingIcon}
        size="small"
      />
    </View>
  );
  const audioPlayIcon = (
    <View style={styles.audioPlayContainer}>
      <Image source={audioInfo.playIcon} style={styles.audioPlayIcon} />
    </View>
  );
  return (
    <TouchableOpacity onPress={() => onPress(audioInfo.rowData, audioInfo.rowID)}>
      <View style={styles.senderContainer}>
        <View style={styles.senderAvatarContainer}>
          <Image source={{ uri: audioInfo.rowData.avatar }} style={styles.senderAvatar} />
        </View>
        <View style={styles.senderMessageAudio}>
          <View style={styles.messageAudioInfo}>
            {audioInfo.isBuffering && audioInfo.isSelected ? loadingIcon : audioPlayIcon}
            <View style={styles.audioNameContainer}>
              <LabelText style={styles.audioNameText}>
                {messageContent.name}
              </LabelText>
            </View>
            <View style={styles.audioDurationContainer}>
              <LabelText style={styles.audioNameText}>
                {audioInfo.showTime}
              </LabelText>
            </View>
          </View>
          <View style={styles.audioProgressContainer}>
            <Slider
              style={styles.audioProgress}
              trackStyle={styles.trackStyle}
              maximumValue={audioInfo.isSelected ? audioInfo.audioDuration : 100}
              minimumTrackTintColor={GRAY_COLOR}
              maximumTrackTintColor={"#313131"}
              minimumValue={0}
              thumbStyle={styles.thumbStyle}
              value={audioInfo.isSelected ? audioInfo.audioProgress : 0}
              disabled={true}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function renderUnableReceiverAudioArea(audioInfo) {
  const messageContent = audioInfo.rowData.messageContent;
  const loadingIcon = (
    <View style={styles.audioPlayContainer}>
      <ActivityIndicator
        animating={true}
        style={styles.loadingIcon}
        size="small"
      />
    </View>
  );
  const audioPlayIcon = (
    <View style={styles.audioPlayContainer}>
      <Image source={audioInfo.playIcon} style={styles.audioReceiverPlayIcon} />
    </View>
  );
  return (
    <View style={styles.receiverContainer}>
      <View style={styles.receiverMessageAudio}>
        <View style={styles.messageAudioInfo}>
          {audioInfo.isBuffering && audioInfo.isSelected ? loadingIcon : audioPlayIcon}
          <View style={styles.audioNameContainer}>
            <LabelText style={styles.receiverAudioText}>
              {messageContent.name}
            </LabelText>
          </View>
          <View style={styles.audioDurationContainer}>
            <LabelText style={styles.receiverAudioText}>
              {audioInfo.showTime}
            </LabelText>
          </View>
        </View>
        <View style={styles.audioProgressContainer}>
          <Slider
            style={styles.audioProgress}
            trackStyle={styles.trackStyle}
            maximumValue={audioInfo.isSelected ? audioInfo.audioDuration : 100}
            minimumTrackTintColor={WHITE}
            maximumTrackTintColor={"#313131"}
            minimumValue={0}
            thumbStyle={styles.thumbStyle}
            value={audioInfo.isSelected ? audioInfo.audioProgress : 0}
            disabled={true}
          />
        </View>
      </View>
    </View>
  );
}

function renderTouchableReceiverAudioArea(audioInfo, onPress) {
  const messageContent = audioInfo.rowData.messageContent;
  const loadingIcon = (
    <View style={styles.audioPlayContainer}>
      <ActivityIndicator
        animating={true}
        style={styles.loadingIcon}
        size="small"
      />
    </View>
  );
  const audioPlayIcon = (
    <View style={styles.audioPlayContainer}>
      <Image source={audioInfo.playIcon} style={styles.audioReceiverPlayIcon} />
    </View>
  );
  return (
    <TouchableOpacity onPress={() => onPress(audioInfo.rowData, audioInfo.rowID)}>
      <View style={styles.receiverContainer}>
        <View style={styles.receiverMessageAudio}>
          <View style={styles.messageAudioInfo}>
            {audioInfo.isBuffering && audioInfo.isSelected ? loadingIcon : audioPlayIcon}
            <View style={styles.audioNameContainer}>
              <LabelText style={styles.receiverAudioText}>
                {messageContent.name}
              </LabelText>
            </View>
            <View style={styles.audioDurationContainer}>
              <LabelText style={styles.receiverAudioText}>
                {audioInfo.showTime}
              </LabelText>
            </View>
          </View>
          <View style={styles.audioProgressContainer}>
            <Slider
              style={styles.audioProgress}
              trackStyle={styles.trackStyle}
              maximumValue={audioInfo.isSelected ? audioInfo.audioDuration : 100}
              minimumTrackTintColor={WHITE}
              maximumTrackTintColor={"#313131"}
              minimumValue={0}
              thumbStyle={styles.thumbStyle}
              value={audioInfo.isSelected ? audioInfo.audioProgress : 0}
              disabled={true}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function renderSenderAudio(audioInfo, onPress) {
  return (
    <View style={styles.senderContainer}>
      {audioInfo.isBuffering ?
        renderUnableSenderAudioArea(audioInfo) : renderTouchableSenderAudioArea(audioInfo, onPress)
      }
    </View>
  );
}

function renderReceiverAudio(audioInfo, onPress) {
  return (
    <View style={styles.container}>
      {audioInfo.isBuffering ?
        renderUnableReceiverAudioArea(audioInfo) :
        renderTouchableReceiverAudioArea(audioInfo, onPress)
      }
    </View>
  );
}

export function MessageAudio({ audioInfo, onPress }) {
  return (
    <View style={styles.container}>
      {audioInfo.type === 'sender' ?
        renderSenderAudio(audioInfo, onPress) :
        renderReceiverAudio(audioInfo, onPress)}
    </View>
  );
}

MessageAudio.propTypes = {
  audioInfo: PropTypes.any,
  onPress: PropTypes.func
};
