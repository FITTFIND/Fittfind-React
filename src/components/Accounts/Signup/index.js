import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import { LabelText } from 'AppFonts';
import { SimpleTopNav, ToggleButton, ModalPicker } from 'AppComponents';
import { DARK_COLOR, WHITE, PRIMARY_TEXT, BACKGROUND_COLOR, BLUE } from 'AppColors';
import { Client } from './client';
import { PersonalTrainer } from './personalTrainer';
import { WINDOW_WIDTH } from 'AppConstants';
import { getIPLocation, getAddress } from 'AppUtilities';

const styles = StyleSheet.create({
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: DARK_COLOR
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR
  },
  toggleContainer: {
    alignSelf: 'stretch',
    height: 40
  },
  termsContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: DARK_COLOR
  },
  termsImage: {
    width: 60,
    height: 30
  },
  termsDescriptionContainer: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    justifyContent: 'center'
  },
  termsSubContainer1: {
    flex: 1,
    justifyContent: 'center'
  },
  termsSubContainer2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  primaryText: {
    color: PRIMARY_TEXT
  },
  whiteText: {
    color: WHITE
  },
  registerButtonContainer: {
    height: 50,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE
  },
  contentSubContainer: {
    flex: 1,
    width: WINDOW_WIDTH,
    overflow: 'hidden',
  },
});

const TAB_ITEMS = ['Client', 'Personal Trainer'];

export class Signup extends Component {
  static propTypes = {
    routeBack: PropTypes.func.isRequired,
    handleSignup: PropTypes.func.isRequired,
    user: PropTypes.object
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTab: 'Client',
      password: 'test1234',
      fullName: props.user ? props.user.name : 'Test Name',
      address: '',
      email: props.user ? props.user.email : 'test@test.com',
      speciality: 0,
      isShowSpecialityPicker: false,
      isLoading: true,
    };
    this.handleSubmit = ::this.handleSubmit;
    this.onTabSelected = ::this.onTabSelected;
    this.changeValue = ::this.changeValue;
    this.showSpecialityPicker = ::this.showSpecialityPicker;
    this.isShowSpecialityPicker = ::this.isShowSpecialityPicker;
    this.setSpeciality = ::this.setSpeciality;
  }

  componentDidMount() {
    getIPLocation()
      .then(location => {
        console.info('location', location.coordinates[1], location.coordinates[0]);
        getAddress(location.coordinates[1], location.coordinates[0])
          .then(address => {
            console.info('location', address);
            this.setState({ address, isLoading: false });
          })
          .catch(() => this.setState({ isLoading: false }, () =>
              Alert.alert('Warning!', 'Connection Error')));
      })
      .catch(() => this.setState({ isLoading: false }, () =>
          Alert.alert('Warning!', 'Connection Error')));
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  setSpeciality(value) {
    this.setState({ speciality: value.key });
  }

  handleSubmit() {
    const { handleSignup } = this.props;
    const { email, password, address, fullName, speciality } = this.state;
    const isClient = this.state.selectedTab === 'Client';
    const price = this.getRandomInt(0, 500);
    let data = {};
    this.setState({ isLoading: true });
    getIPLocation()
      .then((location) => {
        this.setState({ isLoading: false });
        data = {
          isClient,
          location,
          email,
          password,
          address,
          name: fullName,
        };
        if (!isClient) {
          data = {
            ...data,
            price,
            speciality,
            isClient
          };
        }
        handleSignup(data);
      })
      .catch(() => this.setState({ isLoading: false }, () =>
        Alert.alert('Warning!', 'Connection Error')));
  }

  showSpecialityPicker() {
    const { isShowSpecialityPicker } = this.state;
    if (isShowSpecialityPicker) {
      this.setState({ isShowSpecialityPicker: false });
    } else {
      this.setState({ isShowSpecialityPicker: true });
    }
  }

  changeValue(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  isShowSpecialityPicker(isHideSpecialityPicker) {
    this.setState({ isShowSpecialityPicker: !isHideSpecialityPicker });
  }

  renderSubComponent() {
    const { selectedTab, fullName, address, email, password, speciality } = this.state;

    if (selectedTab === 'Client') {
      return (
        <Client
          fullName={fullName}
          address={address}
          email={email}
          password={password}
          changeValue={this.changeValue}
        />
      );
    }
    return (
      <PersonalTrainer
        fullName={fullName}
        address={address}
        email={email}
        password={password}
        speciality={speciality}
        changeValue={this.changeValue}
        showSpecialityPicker={this.showSpecialityPicker}
      />
    );
  }

  renderSpecialityPicker() {
    let index = 0;
    const data = [
      { key: index++, label: 'Muscle gain' },
      { key: index++, label: 'Weight loss' },
      { key: index, label: 'Toning' }
    ];
    return (
      <ModalPicker
        data={data}
        initValue="Select something yummy!"
        onChange={this.setSpeciality}
        isClosed={this.isShowSpecialityPicker}
      />
    );
  }

  renderContent() {
    const { routeBack, handleSignup } = this.props;
    const { selectedTab, isShowSpecialityPicker } = this.state;
    return (
      <View style={styles.container}>
        <SimpleTopNav
          backgroundColor={DARK_COLOR}
          leftAction={routeBack}
          centerLabel="Register"
        />
        <View style={styles.contentContainer}>
          <View style={styles.toggleContainer}>
            <ToggleButton
              options={TAB_ITEMS}
              onSelect={this.onTabSelected}
              value={selectedTab}
              selectedTextStyle={{ color: WHITE }}
            />
          </View>
          <View style={styles.contentSubContainer}>
            {this.renderSubComponent()}
          </View>
          <View style={styles.termsContainer}>
            <Image
              source={require('img/icon_app_logo.png')}
              style={styles.termsImage}
            />
            <View style={styles.termsDescriptionContainer}>
              <View style={styles.termsSubContainer1}>
                <LabelText style={styles.primaryText} fontSize={12}>
                  By signing up you agree to our
                </LabelText>
              </View>
              <View style={styles.termsSubContainer2}>
                <TouchableOpacity>
                  <LabelText style={styles.whiteText} fontSize={12}>
                    Terms of Service
                  </LabelText>
                </TouchableOpacity>
                <LabelText style={styles.primaryText} fontSize={12}>
                  {" and "}
                </LabelText>
                <TouchableOpacity>
                  <LabelText style={styles.whiteText} fontSize={12}>
                    Privacy Policy
                  </LabelText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.registerButtonContainer} onPress={this.handleSubmit}>
            <LabelText style={styles.whiteText} fontSize={15}>
              Register
            </LabelText>
          </TouchableOpacity>
          {isShowSpecialityPicker && this.renderSpecialityPicker()}
        </View>
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
    return (
      <View style={styles.container}>
        {this.renderContent()}
        {this.renderActivityIndicator()}
      </View>
    );
  }
}
