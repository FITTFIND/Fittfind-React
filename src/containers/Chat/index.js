import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SimpleTopNav, Chat } from 'AppComponents';
import { DARK_COLOR } from 'AppColors';
import { NAVBAR_MARGIN_TOP } from 'AppConstants';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { connectFeathers } from 'AppConnectors';
import { THREAD_SERVICE } from 'AppServices';
import { updateActiveTime } from 'AppUtilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLOR,
    paddingTop: NAVBAR_MARGIN_TOP,
  },
  navIconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImage: {
    width: 10,
    resizeMode: 'contain',
  },
  imageNavBar: {
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  closeImage: {
    marginRight: 15,
    width: 15,
    height: 15,
    resizeMode: 'contain',
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

const leftNavbar = (
  <View style={styles.navIconContainer}>
    <Image source={require('img/icon_back.png')} style={styles.menuImage} />
  </View>
);

class ChatContainer extends Component {
  static propTypes = {
    showSideBar: PropTypes.func,
    onBack: PropTypes.func,
    disableSideBar: PropTypes.func,
    feathers: PropTypes.object,
    otherUser: PropTypes.object,
    threadId: PropTypes.string,
  };
  static defaultProps = {
    threadId: null
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      threadId: props.threadId,
      hideNavBar: false,
      isLoading: false,
    };
    this.goBack = ::this.goBack;
    this.setThreadId = ::this.setThreadId;
    this.setHideNavBar = ::this.setHideNavBar;
    this.closeImage = ::this.closeImage;
    this.currentUser = null;
  }

  setThreadId(threadId) {
    this.setState({ threadId });
  }

  setHideNavBar(hideNavBar) {
    this.setState({ hideNavBar });
  }

  goBack() {
    const { disableSideBar, onBack, feathers } = this.props;
    const { threadId } = this.state;
    if (threadId !== null) {
      const threadService = feathers.service(THREAD_SERVICE);
      this.currentUser = feathers.get('user');
      this.setState({ isLoading: true });
      threadService.get(threadId)
      .then(thread => {
        const activeTime = updateActiveTime(thread.activeTime, this.currentUser._id);
        threadService.patch(threadId, { activeTime })
        .then(() => {
          // ReactNativeAudioStreaming.stop();
          this.setState({ isLoading: false });
          disableSideBar(false);
          onBack();
        })
        .catch(e => {
          console.info('error updating active time', e);
          this.setState({ isLoading: false });
        });
      })
      .catch(e => {
        this.setState({ isLoading: false });
        console.info('error finding thread', e);
      });
    } else {
      // ReactNativeAudioStreaming.stop();
      disableSideBar(false);
      onBack();
    }
  }

  closeImage() {
    this.setState({ hideNavBar: false });
  }

  renderImageNavBar() {
    return (
      <View style={styles.imageNavBar}>
        <TouchableOpacity onPress={this.closeImage}>
          <Image source={require('img/icon_close.png')} style={styles.closeImage} />
        </TouchableOpacity>
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

  render() {
    const { otherUser, feathers, threadId } = this.props;
    const { hideNavBar } = this.state;
    return (
      <View style={styles.container}>
        { !hideNavBar &&
          <SimpleTopNav
            centerLabel="Chat"
            leftAction={this.goBack}
            backgroundColor={DARK_COLOR}
            leftLabel = {leftNavbar}
            rightLabel = {<View style={styles.navIconContainer} />}
            centerFontSize = {16}
          />
        }
        {hideNavBar && this.renderImageNavBar()}
        <Chat
          otherUser={otherUser}
          feathers={feathers}
          threadId={threadId}
          setThreadId={this.setThreadId}
          setHideNavBar={this.setHideNavBar}
          hideNavBar={hideNavBar}
        />
        {this.renderActivityIndicator()}
      </View>
    );
  }
}
export default connectFeathers(ChatContainer);
