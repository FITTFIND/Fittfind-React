import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Animated, PanResponder, Easing } from 'react-native';

const TRACK_SIZE = 4;
const THUMB_SIZE = 20;

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  containsPoint(x, y) {
    return (x >= this.x
    && y >= this.y
    && x <= this.x + this.width
    && y <= this.y + this.height);
  }
}

const DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100
  },
  timing: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
    delay: 0
  },
};

const defaultStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugThumbTouchArea: {
    position: 'absolute',
    backgroundColor: 'green',
    opacity: 0.5,
  }
});

export class Slider extends Component {
  static propTypes = {
    value: PropTypes.number,
    disabled: PropTypes.bool,
    minimumValue: PropTypes.number,
    maximumValue: PropTypes.number,
    step: PropTypes.number,
    minimumTrackTintColor: PropTypes.string,
    maximumTrackTintColor: PropTypes.string,
    thumbTintColor: PropTypes.string,
    thumbTouchSize: PropTypes.shape(
      { width: PropTypes.number, height: PropTypes.number }
    ),
    onValueChange: PropTypes.func,
    onSlidingStart: PropTypes.func,
    onSlidingComplete: PropTypes.func,
    style: View.propTypes.style,
    trackStyle: View.propTypes.style,
    thumbStyle: View.propTypes.style,
    debugTouchArea: PropTypes.bool,
    animateTransitions: PropTypes.bool,
    animationType: PropTypes.oneOf(['spring', 'timing']),
    animationConfig: PropTypes.object,
    styles: PropTypes.any,
  };

  static defaultProps = {
    value: 0,
    minimumValue: 0,
    maximumValue: 1,
    step: 0,
    minimumTrackTintColor: '#3f3f3f',
    maximumTrackTintColor: '#b3b3b3',
    thumbTintColor: '#343434',
    thumbTouchSize: { width: 40, height: 40 },
    debugTouchArea: false,
    animationType: 'timing'
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      containerSize: { width: 0, height: 0 },
      trackSize: { width: 0, height: 0 },
      thumbSize: { width: 0, height: 0 },
      allMeasured: false,
      value: new Animated.Value(this.props.value),
    };
    this._measureContainer = ::this._measureContainer;
    this._measureThumb = ::this._measureThumb;
    this._measureTrack = ::this._measureTrack;
    this._handleStartShouldSetPanResponder = ::this._handleStartShouldSetPanResponder;
    this._handleMoveShouldSetPanResponder = ::this._handleMoveShouldSetPanResponder;
    this._handlePanResponderGrant = ::this._handlePanResponderGrant;
    this._handlePanResponderMove = ::this._handlePanResponderMove;
    this._handlePanResponderEnd = ::this._handlePanResponderEnd;
    this._handlePanResponderRequestEnd = ::this._handlePanResponderRequestEnd;
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  componentWillReceiveProps(nextProps) {
    const newValue = nextProps.value;
    if (this.props.value !== newValue) {
      if (this.props.animateTransitions) {
        this._setCurrentValueAnimated(newValue);
      } else {
        this._setCurrentValue(newValue);
      }
    }
  }

  _renderDebugThumbTouchRect(thumbLeft) {
    const thumbTouchRect = this._getThumbTouchRect();
    const positionStyle = {
      left: thumbLeft,
      top: thumbTouchRect.y,
      width: thumbTouchRect.width,
      height: thumbTouchRect.height,
    };

    return (
      <Animated.View
        style={[defaultStyles.debugThumbTouchArea, positionStyle]}
        pointerEvents="none"
      />
    );
  }

  _getPropsForComponentUpdate(props) {
    const {
      ...otherProps,
    } = props;

    return otherProps;
  }

  _handleStartShouldSetPanResponder(e): boolean {
    return this._thumbHitTest(e);
  }

  _handleMoveShouldSetPanResponder(): boolean {
    return false;
  }

  _handlePanResponderGrant() {
    this._previousLeft = this._getThumbLeft(this._getCurrentValue());
    this._fireChangeEvent('onSlidingStart');
  }

  _handlePanResponderMove(e, gestureState) {
    if (this.props.disabled) {
      return;
    }
    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onValueChange');
  }

  _handlePanResponderRequestEnd() {
    return false;
  }

  _handlePanResponderEnd(e, gestureState) {
    if (this.props.disabled) {
      return;
    }
    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onSlidingComplete');
  }

  _measureContainer(x) {
    this._handleMeasure('containerSize', x);
  }

  _measureTrack(x) {
    this._handleMeasure('trackSize', x);
  }

  _measureThumb(x) {
    this._handleMeasure('thumbSize', x);
  }

  _handleMeasure(name, x) {
    const { width, height } = x.nativeEvent.layout;
    const size = { width, height };

    const storeName = `_${name}`;
    const currentSize = this[storeName];
    if (currentSize && width === currentSize.width && height === currentSize.height) {
      return;
    }
    this[storeName] = size;

    if (this._containerSize && this._trackSize && this._thumbSize) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
        allMeasured: true,
      });
    }
  }

  _getRatio(value) {
    return (value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue);
  }

  _getThumbLeft(value) {
    const ratio = this._getRatio(value);
    return ratio * (this.state.containerSize.width - this.state.thumbSize.width);
  }

  _getValue(gestureState) {
    const length = this.state.containerSize.width - this.state.thumbSize.width;
    const thumbLeft = this._previousLeft + gestureState.dx;

    const ratio = thumbLeft / length;

    if (this.props.step) {
      return Math.max(this.props.minimumValue,
        Math.min(this.props.maximumValue,
          this.props.minimumValue + Math.round(ratio * (this.props.maximumValue - this.props.minimumValue) / this.props.step) * this.props.step
        )
      );
    }
    return Math.max(this.props.minimumValue,
      Math.min(this.props.maximumValue,
        ratio * (this.props.maximumValue - this.props.minimumValue) + this.props.minimumValue
      )
    );
  }

  _getCurrentValue() {
    return this.state.value.__getValue();
  }

  _setCurrentValue(value) {
    this.state.value.setValue(value);
  }

  _setCurrentValueAnimated(value) {
    const animationType = this.props.animationType;
    const animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      { toValue: value }
    );

    Animated[animationType](this.state.value, animationConfig).start();
  }

  _fireChangeEvent(event) {
    if (this.props[event]) {
      this.props[event](this._getCurrentValue());
    }
  }

  _getTouchOverflowSize() {
    const state = this.state;
    const props = this.props;

    const size = {};
    if (state.allMeasured === true) {
      size.width = Math.max(0, props.thumbTouchSize.width - state.thumbSize.width);
      size.height = Math.max(0, props.thumbTouchSize.height - state.containerSize.height);
    }

    return size;
  }

  _getTouchOverflowStyle() {
    const { width, height } = this._getTouchOverflowSize();

    const touchOverflowStyle = {};
    if (width !== undefined && height !== undefined) {
      const verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      const horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (this.props.debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = 'orange';
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  }

  _thumbHitTest(e) {
    const nativeEvent = e.nativeEvent;
    const thumbTouchRect = this._getThumbTouchRect();
    return thumbTouchRect.containsPoint(nativeEvent.locationX, nativeEvent.locationY);
  }

  _getThumbTouchRect() {
    const state = this.state;
    const props = this.props;
    const touchOverflowSize = this._getTouchOverflowSize();

    return new Rect(
      touchOverflowSize.width / 2 + this._getThumbLeft(this._getCurrentValue()) + (state.thumbSize.width - props.thumbTouchSize.width) / 2,
      touchOverflowSize.height / 2 + (state.containerSize.height - props.thumbTouchSize.height) / 2,
      props.thumbTouchSize.width,
      props.thumbTouchSize.height
    );
  }

  render() {
    const {
      minimumValue,
      maximumValue,
      minimumTrackTintColor,
      maximumTrackTintColor,
      thumbTintColor,
      styles,
      style,
      trackStyle,
      thumbStyle,
      debugTouchArea,
      ...other
    } = this.props;
    const { value, containerSize, trackSize, thumbSize, allMeasured } = this.state;
    const mainStyles = styles || defaultStyles;
    const thumbLeft = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, containerSize.width - thumbSize.width],
    });
    const valueVisibleStyle = {};
    if (!allMeasured) {
      valueVisibleStyle.opacity = 0;
    }
    const minimumTrackStyle = {
      position: 'absolute',
      width: Animated.add(thumbLeft, thumbSize.width / 2),
      marginTop: -trackSize.height,
      backgroundColor: minimumTrackTintColor,
      ...valueVisibleStyle
    };
    const touchOverflowStyle = this._getTouchOverflowStyle();
    return (
      <View {...other} style={[mainStyles.container, style]} onLayout={this._measureContainer}>
        <View
          style={[{ backgroundColor: maximumTrackTintColor }, mainStyles.track, trackStyle]}
          onLayout={this._measureTrack}
        />
        <Animated.View style={[mainStyles.track, trackStyle, minimumTrackStyle]} />
        <Animated.View
          onLayout={this._measureThumb}
          style={[
            { backgroundColor: thumbTintColor },
            mainStyles.thumb, thumbStyle,
            {
              transform: [
                { translateX: thumbLeft },
                { translateY: -(trackSize.height + thumbSize.height) / 2 }
              ],
              ...valueVisibleStyle
            }
          ]}
        />
        <View
          style={[defaultStyles.touchArea, touchOverflowStyle]}
          {...this._panResponder.panHandlers}
        >
          {debugTouchArea === true && this._renderDebugThumbTouchRect(thumbLeft)}
        </View>
      </View>
    );
  }

}
