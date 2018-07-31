import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Animated
} from 'react-native';
import { LabelText } from 'AppFonts';
import { BACKGROUND_COLOR, WHITE, DARK_COLOR, BLUE, GRAY_COLOR } from 'AppColors';
import { NAVBAR_MARGIN_TOP, WINDOW_WIDTH } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  editNameBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: NAVBAR_MARGIN_TOP,
    flex: 1,
    width: WINDOW_WIDTH,
    justifyContent: 'center',
    height: 40,
    alignItems: 'center',
  },
  editTouchContainer: {
    flex: 1,
  },
  labelCancel: {
    marginLeft: 15,
    color: WHITE,
    alignSelf: 'stretch',
    backgroundColor: 'transparent'
  },
  labelSave: {
    marginRight: 15,
    color: WHITE,
    textAlign: 'right',
    alignSelf: 'stretch',
    backgroundColor: 'transparent'
  },
  textInput: {
    marginLeft: 25,
    fontSize: 16,
    color: WHITE,
    paddingVertical: 0,
    width: WINDOW_WIDTH / 2 - 50,
    textAlign: 'center'
  },
  iconEdit: {
    marginLeft: 5,
    width: 20,
    resizeMode: 'contain'
  },
  userImageContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH,
    alignItems: 'center',
  },
  userBackImage: {
    top: 0,
    marginTop: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH,
    alignSelf: 'stretch',
    opacity: 0.7,
    backgroundColor: DARK_COLOR
  },
  messageContainer: {
    top: -22,
    height: 44,
    width: WINDOW_WIDTH / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageBackground: {
    flex: 1,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 20,
    flexDirection: 'row'
  },
  labelText: {
    color: WHITE,
    backgroundColor: 'transparent'
  },
  infoContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  goalContainer: {
    marginTop: 40,
  },
  contentGoalContainer: {
    marginTop: 10,
    backgroundColor: '#1e1e1e',
    height: 100,
    alignSelf: 'stretch',
    width: WINDOW_WIDTH - 40,
    borderRadius: 5,
  },
  contentContainer: {
    marginTop: 10,
    height: 50,
    backgroundColor: '#1e1e1e',
    width: WINDOW_WIDTH - 40,
  },
  input: {
    flex: 1,
    color: GRAY_COLOR,
    paddingVertical: 0,
    alignSelf: 'stretch',
    fontSize: 12.5,
    lineHeight: 20
  },
  goalTitleContainer: {
    flexDirection: 'row'
  },
  iconEdit1: {
    marginLeft: 5,
    width: 12,
    height: 12,
    resizeMode: 'stretch',
    alignSelf: 'center'
  }
});

const renderEditScrollView = (
  avatarUrl,
  goalDescription,
  changeImage,
  changeGoalDescription,
  lifeStyle,
  changeLifeStyle,
  trainEnvironment,
  changeTrainEnvironment
) => (
  <ScrollView automaticallyAdjustContentInsets={false} >
    <View style={styles.userImageContainer}>
      <Image
        source={avatarUrl === '' ? require('img/app_back_image1.png') : { uri: avatarUrl }}
        style={styles.userBackImage}
      />
      <View style={styles.messageContainer}>
        <TouchableOpacity style={styles.messageBackground} onPress={changeImage}>
          <LabelText style={styles.labelText} fontSize={15}>
            Upload Image
          </LabelText>
          <Image source={require('img/icon_edit_payment.png')} style={styles.iconEdit} />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.infoContainer}>
      <View style={styles.goalContainer}>
        <View style={styles.goalTitleContainer}>
          <LabelText style={styles.labelText} fontSize={12.5}>
            Personal goals
          </LabelText>
          <Image source={require('img/icon_edit_payment.png')} style={styles.iconEdit1} />
        </View>
        <View style={styles.contentGoalContainer}>
          <TextInput
            style={styles.input}
            multiline={true}
            onChangeText={changeGoalDescription}
            value={goalDescription}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
      <View style={styles.goalContainer}>
        <View style={styles.goalTitleContainer}>
          <LabelText style={styles.labelText} fontSize={12.5}>
            Lifestyle
          </LabelText>
          <Image source={require('img/icon_edit_payment.png')} style={styles.iconEdit1} />
        </View>
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            multiline={true}
            onChangeText={changeLifeStyle}
            value={lifeStyle}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
      <View style={styles.goalContainer}>
        <View style={styles.goalTitleContainer}>
          <LabelText style={styles.labelText} fontSize={12.5}>
            Training environment
          </LabelText>
          <Image source={require('img/icon_edit_payment.png')} style={styles.iconEdit1} />
        </View>
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            multiline={true}
            onChangeText={changeTrainEnvironment}
            value={trainEnvironment}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    </View>
  </ScrollView>
);

export function EditView({
  userName,
  changeName,
  onEditCancel,
  onEditSave,
  avatarUrl,
  goalDescription,
  changeImage,
  fadeOutValue,
  changeGoalDescription,
  lifeStyle,
  changeLifeStyle,
  trainEnvironment,
  changeTrainEnvironment
}) {
  return (
    <Animated.View style={[styles.container, { opacity: fadeOutValue }]}>
      {renderEditScrollView(
        avatarUrl,
        goalDescription,
        changeImage,
        changeGoalDescription,
        lifeStyle,
        changeLifeStyle,
        trainEnvironment,
        changeTrainEnvironment
      )}
      <View style={styles.editNameBarContainer}>
        <TouchableOpacity style={styles.editTouchContainer} onPress={onEditCancel}>
          <LabelText style={styles.labelCancel} fontSize={14}>
            Cancel
          </LabelText>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          underlineColorAndroid="transparent"
          autoCapitalize = "words"
          onChangeText = {changeName}
          value = {userName}
          autoCorrect={false}
        />
        <Image source={require('img/icon_edit_payment.png')} style={styles.iconEdit} />
        <TouchableOpacity style={styles.editTouchContainer} onPress={onEditSave}>
          <LabelText style={styles.labelSave} fontSize={14}>
            Save
          </LabelText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

EditView.propTypes = {
  userName: PropTypes.string,
  changeName: PropTypes.func,
  onEditSave: PropTypes.func,
  onEditCancel: PropTypes.func,
  avatarUrl: PropTypes.string,
  goalDescription: PropTypes.string,
  changeImage: PropTypes.func,
  fadeOutValue: PropTypes.any,
  changeGoalDescription: PropTypes.func,
  lifeStyle: PropTypes.string,
  changeLifeStyle: PropTypes.func,
  trainEnvironment: PropTypes.string,
  changeTrainEnvironment: PropTypes.func,
};
