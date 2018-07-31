import React, { PropTypes, Component } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { WHITE, PRIMARY_TEXT, DARK_COLOR } from 'AppColors';
import { LabelText } from 'AppFonts';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 35,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  allContainers: {
    position: 'absolute',
    height: 80,
    marginTop: 10,
    opacity: 1,
    // top: 0,
    backgroundColor: DARK_COLOR,
    overflow: 'hidden'
  },
  listItem: {
    height: 35,
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  arrowContainer: {
    width: 15,
    resizeMode: 'contain',
  }
});

export class DropdownList extends Component {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    values: PropTypes.array.isRequired,
    selectedStyle: PropTypes.object,
    onSelected: PropTypes.func.isRequired,
    selected: PropTypes.number.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      flagShowList: false,
    };
    this.onShowList = ::this.onShowList;
  }

  onShowList(flagShowList) {
    this.setState({ flagShowList });
  }

  onItemSelected(activeListItem) {
    this.onShowList(false);
    const { onSelected } = this.props;
    onSelected(activeListItem);
  }

  renderList() {
    const components = this.props.values.map((listItem, index) => (
      <TouchableOpacity
        key={index} onPress={() => this.onItemSelected(index)}
        style={styles.listItem}
      >
        <LabelText style={{ color: PRIMARY_TEXT }} fontSize={15}>
          {listItem}
        </LabelText>
      </TouchableOpacity>
    ));
    return components;
  }
  renderSelectedView() {
    const { values, selected } = this.props;
    let selectedValue = '';
    if (selected > -1 && selected < values.length) {
      selectedValue = values[selected];
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={ () => this.onShowList(true) } style={{ flex: 1 }}>
          <LabelText style={{ color: WHITE, overflow: 'visible' }} fontSize={15}>
            {selectedValue}
          </LabelText>
        </TouchableOpacity>
        <Image
          source={require('img/icon_arrow.png')}
          style={styles.arrowContainer}
        />
      </View>
    );
  }
  render() {
    const { flagShowList } = this.state;
    if (flagShowList === false) {
      return this.renderSelectedView();
    }
    return (
      <View style={{ overflow: 'visible', height:80 }}>
        {this.renderSelectedView()}
        <View style={styles.allContainers}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.renderList()}
          </ScrollView>
        </View>
      </View>
    );
  }
}
