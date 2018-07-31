import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LabelText } from 'AppFonts';
import { GRAY_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginLeft: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkContainer: {
    backgroundColor: "#1e1e1e",
    width: 24,
    height: 24,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelContainer: {
    marginLeft: 5
  },
  checkImgContainer: {
    width: 15,
    height: 15,
    resizeMode: 'contain'
  },
  labelText: {
    color: GRAY_COLOR
  }
});

export class CheckBox extends Component {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    checkedImage: Image.propTypes.source,
    label: PropTypes.string,
    labelFontSize: PropTypes.number,
    onChange: PropTypes.func,
    checked: PropTypes.bool
  };

  static defaultProps = {
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      checked: false,
    };
    this.showCheckIcon = ::this.showCheckIcon;
  }

  showCheckIcon() {
    const { checked } = this.props;
    // if (checked) {
    //   this.setState({ checked: false });
    // } else {
    //   this.setState({ checked: true });
    // }
    this.props.onChange(!checked);
  }

  renderChecked() {
    return (
      <View style={styles.checkContainer}>
        <Image
          source={require('img/icon_check.png')}
          style={styles.checkImgContainer}
        />
      </View>
    );
  }
  renderUnChecked() {
    return (
      <View style={styles.checkContainer} />
    );
  }

  render() {
    const { checked } = this.props;
    return (
      <TouchableOpacity onPress={this.showCheckIcon}>
        <View style={styles.container}>
          {checked ? this.renderChecked() : this.renderUnChecked()}
          <View style={styles.labelContainer}>
            <LabelText style={styles.labelText} fontSize={15.5}>
              {this.props.label}
            </LabelText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
