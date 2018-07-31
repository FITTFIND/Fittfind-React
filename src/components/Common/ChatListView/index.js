import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ListView,
  DeviceEventEmitter,
  RefreshControl,
} from 'react-native';
import { BACKGROUND_COLOR } from 'AppColors';
import { WINDOW_HEIGHT } from 'AppConstants';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { MessageText } from './Text';
import { MessageImage } from './Image';
import { MessageAudio } from './Audio';

const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT - 120,
    backgroundColor: BACKGROUND_COLOR
  },
  messageContainer: {
    paddingHorizontal: 16,
  }
});

export class ChatListView extends Component {
  static propTypes = {
    messages: PropTypes.array,
    isSent: PropTypes.bool,
    returnToInitState: PropTypes.func,
    loadMore: PropTypes.func,
    isLoadingMore: PropTypes.bool,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      messages: props.messages,
      isPlaying: false,
      audioDuration: 100.0,
      audioProgress: 0.0,
      isBuffering: false,
      isPaused: false,
      listHeight: 450,
      footerY: 0,
      isRefreshing: false,
    };
    this.renderChatRow = ::this.renderChatRow;
    this.playAudio = ::this.playAudio;
    this.onLayout = ::this.onLayout;
    this.renderFooter = ::this.renderFooter;
    this._onRefresh = ::this._onRefresh;
    this.handleScroll = ::this.handleScroll;
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.playingURL = '';
    this.toPlayURL = '';
    this.playRowID = -1;
    this.ifDifferentRow = false; // bool between the select row and playing Row
    this.chatListRef = null;
    this.disableScroll = false;
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
      'AudioBridgeEvent', (evt) => {
        const { audioProgress, isPlaying } = this.state;
        console.info('event', evt);
        switch (evt.status) {
          case 'PLAYING':
            if (evt.duration !== 0) {
              console.info('event', evt.duration);
              this.setState({
                audioDuration: evt.duration,
                isPlaying: true,
                isBuffering: false,
                isPaused: false
              });
            }
            this.playingURL = evt.url;
            break;
          case 'STREAMING':
            if ((audioProgress !== evt.progress) && isPlaying) {
              this.setState({ audioProgress: evt.progress });
            }
            break;
          case 'STOPPED':
            if (this.playingURL !== this.toPlayURL || this.ifDifferentRow) {
              ReactNativeAudioStreaming.play(this.toPlayURL);
              this.ifDifferentRow = false;
            }
            this.setState({ audioProgress: 0, isBuffering: false, isPlaying: false });
            this.playingURL = '';
            break;
          case 'PAUSED':
            this.setState({ isPlaying: false, isPaused: true });
            break;
          case 'BUFFERING':
            this.setState({ isBuffering: true });
            break;
          case 'COMPLETED': // Andriod only
            this.setState({ audioProgress: 0, isBuffering: false, isPlaying: false });
            this.playingURL = '';
            break;
          case 'BUFFERING_START': // Android only
            this.setState({ isBuffering: true });
            break;
          default:
            break;
        }
      }
    );
  }

  componentWillReceiveProps(props) {
    if (props.isSent) {
      if (!props.isLoadingMore) { // when loading old messages, disable scrollToBottom
        this.setState({ isRefreshing: false });
        this.disableScroll = true;
      } else {  // when loading new message, enable scrollToBottom
        this.disableScroll = false;
      }
      this.setState({ messages: props.messages });
      this.props.returnToInitState();
      this.scrollToBottom(true);
    }
  }

  componentWillUnmount() {
    // const { isPlaying } = this.state;
    // if (isPlaying) {
    // }
    // ReactNativeAudioStreaming.stop();
    this.subscription.remove();
  }

  onLayout(event) {
    const layout = event.nativeEvent.layout;
    this.setState({ listHeight: layout.height }, () => this.scrollToBottom(false));
  }

  scrollToBottom(animated) {
    const { footerY, listHeight } = this.state;
    if (!this.disableScroll) {
      if (footerY > listHeight) {
        const scrollDistance = listHeight - footerY;
        this.chatListRef.scrollTo({ y: -scrollDistance, animated });
      }
    }
  }

  secondsToHms(d) {
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);
    const hDisplay = h > 0 ? `${h}:` : '';
    let mDisplay = '';
    if (m > 0) {
      if (m < 10) {
        mDisplay = `0${m}:`;
      } else {
        mDisplay = `${m}:`;
      }
    } else {
      mDisplay = '00:';
    }
    let sDisplay = '';
    if (s > 0 && s < 10) {
      sDisplay = `0${s}`;
    } else if (s === 0) {
      sDisplay = '00';
    } else {
      sDisplay = s;
    }
    return hDisplay + mDisplay + sDisplay;
  }

  playAudio(rowData, rowID) {
    const audioURL = rowData.messageContent.content;
    const { isPlaying, isPaused } = this.state;
    console.info('audio play', audioURL);
    if (audioURL !== this.playingURL || rowID !== this.playRowID) {
      if (isPlaying) {
        this.ifDifferentRow = rowID !== this.playRowID;
        ReactNativeAudioStreaming.stop();
      } else if (isPaused) {
        this.ifDifferentRow = rowID !== this.playRowID;
        ReactNativeAudioStreaming.stop();
      }
      this.setState({ audioProgress: 0, isBuffering: false, isPlaying: false });
      ReactNativeAudioStreaming.play(audioURL);
      this.toPlayURL = audioURL;
      this.playRowID = rowID;
    } else {
      if (!isPlaying) {
        ReactNativeAudioStreaming.resume();
      } else {
        ReactNativeAudioStreaming.pause();
      }
    }
  }

  handleScroll(event) {
    const { nativeEvent } = event;
    const y = nativeEvent.contentOffset.y +
      nativeEvent.layoutMeasurement.height + nativeEvent.contentInset.top;
    if (y >= nativeEvent.contentSize.height) {
      this.disableScroll = false;
    }
  }

  _onRefresh() {
    this.setState({ isRefreshing: true });
    this.disableScroll = true;
    this.props.loadMore(true);
  }

  renderAudioRow(rowData, rowID, type) {
    const { isPlaying, audioDuration, audioProgress, isBuffering } = this.state;
    const messageContent = rowData.messageContent;
    const playIcon =
      (isPlaying && messageContent.content === this.toPlayURL && rowID === this.playRowID) ?
      require('img/icon_pause.png') :
      require('img/icon_play.png');
    const isSelected = messageContent.content === this.toPlayURL && rowID === this.playRowID;
    const showTime = isSelected ? this.secondsToHms(audioProgress) : '';
    const audioInfo = {
      type,
      rowData,
      rowID,
      isPlaying,
      isBuffering,
      audioDuration,
      audioProgress,
      showTime,
      isSelected,
      playIcon
    };
    return (
      <MessageAudio audioInfo={audioInfo} onPress={() => this.playAudio(rowData, rowID)} />
    );
  }

  renderChatRowContent(rowData, rowID, type) {
    if (rowData.messageContent.type === 'text') {
      return (
        <MessageText type={type} rowData={rowData} />
      );
    } else if (rowData.messageContent.type === 'image') {
      return (
        <MessageImage type={type} rowData={rowData} />
      );
    } else if (rowData.messageContent.type === 'audio') {
      return this.renderAudioRow(rowData, rowID, type);
    }
    return null;
  }

  renderChatRow(rowData, rowID) {
    return (
      <View style={styles.messageContainer}>
        {this.renderChatRowContent(rowData, rowID, rowData.type)}
      </View>
    );
  }

  renderFooter() {
    return (
      <View onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        this.setState({ footerY: layout.y }, () => this.scrollToBottom(false));
      }}
      />
    );
  }

  renderRefreshControl() {
    const { isRefreshing } = this.state;
    return (
      <RefreshControl
        onRefresh={this._onRefresh}
        refreshing={isRefreshing}
      />
    );
  }

  render() {
    if (this.state.messages.length !== 0) {
      const dataSource = this.dataSource.cloneWithRows(this.state.messages);
      return (
        <View style={styles.container}>
          <ListView
            ref={(ref) => this.chatListRef = ref}
            onLayout={this.onLayout}
            dataSource={dataSource}
            renderRow = {(rowData, sectionID, rowID) => this.renderChatRow(rowData, rowID)}
            renderFooter={this.renderFooter}
            pageSize={this.state.messages.length / 2}
            refreshControl={this.renderRefreshControl()}
            onScroll={this.handleScroll}
          />
        </View>
      );
    }
    return (<View style={styles.container} />);
  }
}
