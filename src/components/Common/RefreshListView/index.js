import React, { Component } from 'react';
import { View, ListView, ActivityIndicator } from 'react-native';
const STATUS_NONE = 0;
const STATUS_REFRESH_IDLE = 1;
const STATUS_WILL_REFRESH = 2;
const STATUS_REFRESHING = 3;
const STATUS_INFINITE_IDLE = 4;
const STATUS_WILL_INFINITE = 5;
const STATUS_INFINITING = 6;
const STATUS_INFINITE_LOADED_ALL = 7;

const DEFAULT_PULL_DISTANCE = 20;
const DEFAULT_HF_HEIGHT = 50;

const headerFooterContainer = {
  height: DEFAULT_HF_HEIGHT,
  justifyContent: 'center',
  alignItems: 'center'
};

export class RefreshListView extends Component {
  static defaultProps = {
    footerHeight: DEFAULT_HF_HEIGHT,
    pullDistance: DEFAULT_PULL_DISTANCE,
    loadedAllData: () => false,
    refreshing: false,
    onRefresh: () => console.log('onRefresh'),
    onInfinite: () => console.log('onInfinite'),
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      status: STATUS_NONE,
      isLoadedAllData: false,
    };
    this.footerIsRender = false;
    this.initialInfiniteOffset = 0;
    this.listView = null;
    this.contentSize = { width: 0, height: 0 };
    this.listViewSize = { width: 0, height: 0 };
    this.flagGrant = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshing !== this.props.refreshing && this.props.refreshing) {
      this.setState({ status: STATUS_NONE });
    }
  }

  onLayout = (event) => {
    const { nativeEvent } = event;
    this.listViewSize = {
      width: nativeEvent.layout.width,
      height: nativeEvent.layout.height,
    };
    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  };

  onContentSizeChange = (width, height) => {
    this.contentSize = { width, height };
    if (this.props.onContentSizeChange) {
      this.props.onContentSizeChange(width, height);
    }
  };
  onResponderGrant = (event) => {
    this.flagGrant = true;
    if (this.props.onResponderGrant) {
      this.props.onResponderGrant(event);
    }
  }
  onResponderRelease = () => {
    this.flagGrant = false;
    if (this.props.onResponderRelease) {
      this.props.onResponderRelease();
    }
    let status = this.state.status;
    switch (this.state.status) {
      case STATUS_WILL_REFRESH:
        status = STATUS_REFRESHING;
        this.props.onRefresh();
        break;
      case STATUS_WILL_INFINITE:
        status = STATUS_INFINITING;
        this.props.onInfinite();
        break;
      case STATUS_REFRESH_IDLE:
      case STATUS_INFINITE_IDLE:
      case STATUS_INFINITE_LOADED_ALL:
        status = STATUS_NONE;
        break;
      default:
        break;
    }
    this.setState({ status });
  };

  onScroll = (event) => {
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }
    const { nativeEvent } = event;
    const { status } = this.state;
    if (this.flagGrant) {
      const y = nativeEvent.contentInset.top + nativeEvent.contentOffset.y;
      if (status === STATUS_NONE || status === STATUS_REFRESH_IDLE ||
        status === STATUS_WILL_REFRESH) {
        if (status !== STATUS_WILL_REFRESH && y < -this.props.pullDistance) {
          return this.setState({ status: STATUS_WILL_REFRESH });
        } else if (status === STATUS_WILL_REFRESH && y >= -this.props.pullDistance) {
          return this.setState({ status: STATUS_REFRESH_IDLE });
        }
        if (status !== STATUS_NONE) {
          return;
        }
      }
      if (status === STATUS_NONE || status === STATUS_INFINITE_IDLE
        || status === STATUS_WILL_INFINITE) {
        let y1 = y + nativeEvent.layoutMeasurement.height
          - nativeEvent.contentSize.height - this.initialInfiniteOffset;
        if (this.footerIsRender) {
          y1 += this.props.footerHeight;
        }
        if (status !== STATUS_WILL_INFINITE && y1 > this.props.pullDistance) {
          this.setState({ status: STATUS_WILL_INFINITE });
        } else if (status === STATUS_WILL_INFINITE && y1 <= this.props.pullDistance) {
          this.setState({ status: STATUS_INFINITE_IDLE });
        }
      }
      if (status !== STATUS_WILL_REFRESH && y < -this.props.pullDistance ) {
        return this.setState({ status: STATUS_WILL_REFRESH });
      }
    }
  };

  renderHeader = () => {
    const { status } = this.state;
    if (status === STATUS_REFRESHING) {
      return (
        <View style={headerFooterContainer}>
          <ActivityIndicator size="small" animating={true} />
        </View>
      );
    }
    if (this.props.renderHeader) {
      this.props.renderHeader();
    }
    return <View />;
  };

  renderFooter = () => {
    const { status } = this.state;
    this.footerIsRender = true;
    if (status === STATUS_INFINITING) {
      return (
        <View style={headerFooterContainer}>
          <ActivityIndicator size="small" animating={true} />
        </View>
      );
    }
    if (this.props.renderFooter) {
      return this.props.renderFooter();
    }
    this.footerIsRender = false;
    return <View />;
  };

  render() {
    return (
      <ListView
        {...this.props}
        ref={listView => {this.listView = listView;}}
        onContentSizeChange={this.onContentSizeChange}
        onLayout={this.onLayout}
        renderFooter={this.renderFooter}
        renderHeader={this.renderHeader}
        onResponderGrant={this.onResponderGrant}
        onResponderRelease={this.onResponderRelease}
        onScroll={this.onScroll}
      />
    );
  }
}
