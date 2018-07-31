import React, { PropTypes, Component } from 'react';

import {
  View,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { DARK_COLOR, WHITE } from 'AppColors';

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const OPTION_CONTAINER_HEIGHT = 160;

const styles = StyleSheet.create({
  overlayStyle: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  optionContainer: {
    borderRadius: BORDER_RADIUS,
    width: WINDOW_WIDTH * 0.6,
    height: OPTION_CONTAINER_HEIGHT,
    backgroundColor: DARK_COLOR,
    left: WINDOW_WIDTH * 0.2,
    top: (WINDOW_HEIGHT - OPTION_CONTAINER_HEIGHT) / 2,
    paddingTop: 30,
  },
  cancelContainer: {
    left: WINDOW_WIDTH * 0.2,
    top: (WINDOW_HEIGHT - OPTION_CONTAINER_HEIGHT) / 2 + 10
  },
  cancelStyle: {
    borderRadius: BORDER_RADIUS,
    width: WINDOW_WIDTH * 0.6,
    backgroundColor: DARK_COLOR,
    padding: PADDING
  },
  cancelTextStyle: {
    textAlign: 'center',
    color: WHITE,
    fontSize: FONT_SIZE
  },
  optionStyle: {
    padding: PADDING,
  },
  optionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
    color: WHITE
  },
  sectionStyle: {
    padding: PADDING * 2,
  },
  sectionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE
  }
});

let componentIndex = 0;

export class ModalPicker extends Component {

  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    initValue: PropTypes.string,
    style: View.propTypes.style,
    selectStyle: View.propTypes.style,
    optionStyle: View.propTypes.style,
    optionTextStyle: Text.propTypes.style,
    sectionStyle: View.propTypes.style,
    sectionTextStyle: Text.propTypes.style,
    cancelStyle: View.propTypes.style,
    cancelTextStyle: Text.propTypes.style,
    overlayStyle: View.propTypes.style,
    cancelText: PropTypes.string,
    children: PropTypes.any,
    isClosed: PropTypes.func
  };

  static defaultProps = {
    data: [],
    onChange: () => {},
    initValue: 'Select me!',
    style: {},
    selectStyle: {},
    optionStyle: {},
    optionTextStyle: {},
    sectionStyle: {},
    sectionTextStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    cancelText: 'cancel'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      animationType: 'slide',
      modalVisible: true,
      transparent: false,
      selected: 'please select'
    };
    this.onChange = ::this.onChange;
    this.open = ::this.open;
    this.close = ::this.close;
    this.renderChildren = ::this.renderChildren;
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initValue !== this.props.initValue) {
      this.setState({ selected: nextProps.initValue });
    }
  }

  onChange(item) {
    this.setState({ selected: item.label });
    this.close();
    this.props.onChange(item);
  }

  init() {
    this.setState({
      selected: this.props.initValue,
      cancelText: this.props.cancelText
    });
  }

  close() {
    this.setState({
      modalVisible: false
    });
    this.props.isClosed(true);
  }

  open() {
    this.setState({
      modalVisible: true
    });
  }

  renderSection(section) {
    return (
      <View key={section.key} style={[styles.sectionStyle, this.props.sectionStyle]}>
        <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{section.label}</Text>
      </View>
    );
  }

  renderOption(option) {
    return (
      <TouchableOpacity key={option.key} onPress={() => this.onChange(option)}>
        <View style={[styles.optionStyle, this.props.optionStyle]}>
          <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>{option.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderOptionList() {
    const options = this.props.data.map((item) => {
      if (item.section) {
        return this.renderSection(item);
      }
      return this.renderOption(item);
    });

    return (
      <View
        style={[styles.overlayStyle, this.props.overlayStyle]}
        key={`modalPicker${componentIndex++}`}
      >
        <View style={styles.optionContainer}>
          <ScrollView keyboardShouldPersistTaps>
            <View style={{ paddingHorizontal: 10 }}>
              {options}
            </View>
          </ScrollView>
        </View>
        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={this.close}>
            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
              <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>
                {this.props.cancelText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>);
  }

  renderChildren() {
    if (this.props.children) {
      return this.props.children;
    }
    return (<View />);
  }

  render() {
    const dp = (
      <Modal
        transparent={true}
        ref="modal"
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={this.state.animationType}
      >
        {this.renderOptionList()}
      </Modal>
    );

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={this.open}>
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    );
  }
}

