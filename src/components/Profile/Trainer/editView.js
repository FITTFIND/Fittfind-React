import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  TextInput
} from 'react-native';
import { PhotoGallery } from 'AppComponents';
import { LabelText } from 'AppFonts';
import { WINDOW_WIDTH, WINDOW_HEIGHT, NAVBAR_MARGIN_TOP } from 'AppConstants';
import { BLUE, BACKGROUND_COLOR, WHITE, GRAY_COLOR, DARK_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  headerContainer: {
    height: WINDOW_WIDTH
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
  textInput: {
    marginLeft: 25,
    fontSize: 16,
    color: WHITE,
    paddingVertical: 0,
    width: WINDOW_WIDTH / 2 - 50,
    textAlign: 'center'
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
  iconEdit: {
    marginLeft: 5,
    width: 20,
    resizeMode: 'contain'
  },
  trainerImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  trainerImage: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH,
    resizeMode: 'stretch',
    opacity: 0.7,
  },
  labelText: {
    color: WHITE
  },
  contentText: {
    color: '#646464',
    lineHeight: 23
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 17
  },
  biographyContainer: {
    marginTop: 30,
  },
  bookContainer: {
    marginTop: 13,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceLabelContainer: {
    borderRightWidth: 1 / 2,
    borderColor: '#2d2d2d',
    paddingRight: 15,
  },
  priceContainer: {
    width: 80,
    marginLeft: 10,
    backgroundColor: '#1e1e1e',
    marginVertical: 5,
  },
  galleryContainer: {
    height: 100,
    marginTop: 10,
    paddingVertical: 15,
    paddingLeft: 15,
    flexDirection: 'row'
  },
  galleryLabelContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  horizontalListContainer: {
    flex: 1,
    marginLeft: 15
  },
  auditionViewContainer: {
    position: 'absolute',
    top: WINDOW_WIDTH - 22,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  auditionContainer: {
    backgroundColor: BLUE,
    width: WINDOW_WIDTH / 2,
    height: WINDOW_HEIGHT / 14,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  labelAudition: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: WHITE
  },
  biographyTitleContainer: {
    flexDirection: 'row',
  },
  iconEdit1: {
    marginLeft: 5,
    width: 12,
    height: 12,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  contentBioContainer: {
    marginTop: 10,
    backgroundColor: '#1e1e1e',
    height: 100,
    alignSelf: 'stretch',
    width: WINDOW_WIDTH - 40,
    borderRadius: 5,
  },
  input1: {
    flex: 1,
    color: GRAY_COLOR,
    paddingVertical: 0,
    alignSelf: 'stretch',
    fontSize: 12.5,
    lineHeight: 20
  },
  input2: {
    flex: 1,
    color: WHITE,
    paddingVertical: 0,
    alignSelf: 'stretch',
    fontSize: 12.5,
    lineHeight: 20
  }
});

const renderMain = (
  price,
  imageItems,
  flagShowAllGoals,
  showAll,
  numberOfLines,
  bioDescription,
  changeBioDescription,
  changePrice,
  uploadPhoto
) => (
  <View style={styles.mainContainer}>
    <View style={styles.biographyContainer}>
      <View style={styles.biographyTitleContainer}>
        <LabelText style={styles.labelText} fontSize={14}>
          Biography
        </LabelText>
        <Image source={require('img/icon_edit_payment.png')} style={styles.iconEdit1} />
      </View>
      <View style={styles.contentBioContainer}>
        <TextInput
          style={styles.input1}
          multiline={true}
          onChangeText={changeBioDescription}
          value={bioDescription}
          underlineColorAndroid="transparent"
        />
      </View>
    </View>
    <View style={styles.bookContainer}>
      <View style={styles.priceLabelContainer}>
        <LabelText style={styles.contentText} fontSize={13}>
          Fee per hour
        </LabelText>
      </View>
      <View style={styles.priceContainer}>
        <TextInput
          style={styles.input2}
          onChangeText={changePrice}
          keyboardType="numeric"
          value={price}
          underlineColorAndroid="transparent"
        />
      </View>
      <Image source={require('img/icon_edit_payment.png')} style={styles.iconEdit1} />
    </View>
    <View style={styles.galleryContainer}>
      <View style={styles.galleryLabelContainer}>
        <LabelText style={styles.labelText} fontSize={15}>
          {imageItems.length - 1}
        </LabelText>
        <LabelText style={styles.contentText} fontSize={15}>
          PHOTOS
        </LabelText>
      </View>
      <View style={styles.horizontalListContainer}>
        <PhotoGallery
          img_array = {imageItems}
          bEditMode = {true}
          uploadPhoto={uploadPhoto}
        />
      </View>
    </View>
  </View>
);

const renderScrollView = (
  price,
  imageItems,
  flagShowAllGoals,
  showAll,
  numberOfLines,
  bioDescription,
  changeBioDescription,
  changePrice,
  changeImage,
  avatarUrl,
  uploadPhoto
) => (
  <ScrollView automaticallyAdjustContentInsets={false}>
    <View style={styles.headerContainer}>
      <View style={styles.trainerImageContainer}>
        <Image
          source={avatarUrl === '' ? require('img/temp_trainer_image.png') : { uri: avatarUrl }}
          style={styles.trainerImage}
        />
      </View>
    </View>
    {renderMain(
      price,
      imageItems,
      flagShowAllGoals,
      showAll,
      numberOfLines,
      bioDescription,
      changeBioDescription,
      changePrice,
      uploadPhoto
    )}
    <View style={styles.auditionViewContainer}>
      <TouchableOpacity style={styles.auditionContainer} onPress={changeImage}>
        <LabelText style={styles.labelAudition} fontSize={15}>
          Upload Image
        </LabelText>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

export function EditView({
  name,
  fadeOutValue,
  price,
  imageItems,
  flagShowAllGoals,
  showAll,
  numberOfLines,
  bioDescription,
  changeName,
  onEditSave,
  onEditCancel,
  changeBioDescription,
  changePrice,
  changeImage,
  avatarUrl,
  uploadPhoto
}) {
  return (
    <Animated.View style={[styles.container, { opacity: fadeOutValue }]} >
      {renderScrollView(
        price,
        imageItems,
        flagShowAllGoals,
        showAll,
        numberOfLines,
        bioDescription,
        changeBioDescription,
        changePrice,
        changeImage,
        avatarUrl,
        uploadPhoto
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
          value = {name}
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
  name: PropTypes.string,
  fadeOutValue: PropTypes.any,
  showMenu: PropTypes.func,
  onEdit: PropTypes.func,
  price: PropTypes.string,
  imageItems: PropTypes.array,
  flagShowAllGoals: PropTypes.bool,
  showAll: PropTypes.func,
  bioDescription: PropTypes.string,
  numberOfLines: PropTypes.number,
  changeName: PropTypes.func,
  onEditSave: PropTypes.func,
  onEditCancel: PropTypes.func,
  changeBioDescription: PropTypes.func,
  changePrice: PropTypes.func,
  changeImage: PropTypes.func,
  avatarUrl: PropTypes.string,
  uploadPhoto: PropTypes.func
};
