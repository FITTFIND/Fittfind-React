import React, { PropTypes } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import { SimpleTopNav, PhotoGallery } from 'AppComponents';
import { LabelText } from 'AppFonts';
import { WINDOW_WIDTH, NAVBAR_MARGIN_TOP } from 'AppConstants';
import { BLUE, BACKGROUND_COLOR, WHITE, DARK_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  headerContainer: {
    height: WINDOW_WIDTH
  },
  navBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: NAVBAR_MARGIN_TOP,
    flex: 1,
  },
  navIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainerImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center'
  },
  trainerImage: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH,
    resizeMode: 'stretch',
    opacity: 0.7,
    backgroundColor: DARK_COLOR
  },
  labelText: {
    color: WHITE
  },
  menuImage: {
    width: 20,
    resizeMode: 'contain',
  },
  contentBiographyContainer: {
    marginTop: 10,
  },
  contentText: {
    color: '#646464',
    lineHeight: 23
  },
  readMoreText: {
    color: BLUE,
    marginTop: -10,
    backgroundColor: 'transparent'
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
    flex: 1,
    marginLeft: 10,
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
  }
});

const rightNavbar = (onEdit) => (
  <View style={styles.navIconContainer}>
    <TouchableOpacity onPress={onEdit}>
      <LabelText style={styles.labelText} fontSize={16}>
        Edit
      </LabelText>
    </TouchableOpacity>
  </View>
);

const leftNavbar = (
  <View style={styles.navIconContainer}>
    <Image source={require('img/icon_menu.png')} style={styles.menuImage} />
  </View>
);

const renderBioDescription = (
  numberOfLines,
  bioDescription,
  flagShowAllGoals,
  showAll
) => {
  let subGoal = bioDescription;
  if (bioDescription.length > 75 && !flagShowAllGoals) {
    subGoal = bioDescription.substring(0, 75);
    subGoal = `${subGoal}...   `;
    return (
      <View style={styles.contentBiographyContainer}>
        <TouchableOpacity onPress={showAll}>
          <LabelText style={styles.contentText} fontSize={13} numberOfLines={numberOfLines}>
            { subGoal }
            {!flagShowAllGoals &&
            <LabelText style={styles.readMoreText} fontSize={13}>
              Read More
            </LabelText>
            }
          </LabelText>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.contentBiographyContainer}>
      <LabelText style={styles.contentText} fontSize={13} numberOfLines={0}>
        { subGoal }
      </LabelText>
    </View>
  );
};

const renderMain = (
  price,
  imageItems,
  flagShowAllGoals,
  showAll,
  numberOfLines,
  bioDescription
) => (
  <View style={styles.mainContainer}>
    <View style={styles.biographyContainer}>
      <LabelText style={styles.labelText} fontSize={14}>
        Biography
      </LabelText>
      {renderBioDescription(numberOfLines, bioDescription, flagShowAllGoals, showAll)}
    </View>
    <View style={styles.bookContainer}>
      <View style={styles.priceLabelContainer}>
        <LabelText style={styles.contentText} fontSize={13}>
          Fee per hour
        </LabelText>
      </View>
      <View style={styles.priceContainer}>
        <LabelText style={styles.labelText} fontSize={13}>
          £{price}
        </LabelText>
      </View>
    </View>
    <View style={styles.galleryContainer}>
      <View style={styles.galleryLabelContainer}>
        <LabelText style={styles.labelText} fontSize={15}>
          {imageItems.length}
        </LabelText>
        <LabelText style={styles.contentText} fontSize={15}>
          PHOTOS
        </LabelText>
      </View>
      <View style={styles.horizontalListContainer}>
        <PhotoGallery
          img_array = {imageItems}
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
  avatarUrl
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
    )}
  </ScrollView>
);

export function ProfileView({
  name,
  fadeInValue,
  showMenu,
  onEdit,
  price,
  imageItems,
  flagShowAllGoals,
  showAll,
  numberOfLines,
  bioDescription,
  avatarUrl
}) {
  return (
    <Animated.View style={[styles.container, { opacity: fadeInValue }]} >
      {renderScrollView(
        price,
        imageItems,
        flagShowAllGoals,
        showAll,
        numberOfLines,
        bioDescription,
        avatarUrl
      )}
      <View style={styles.navBarContainer}>
        <SimpleTopNav
          centerLabel={name}
          leftAction={showMenu}
          backgroundColor={"transparent"}
          leftLabel = {leftNavbar}
          rightLabel = {rightNavbar(onEdit)}
          wrapStyle = {{ width: WINDOW_WIDTH }}
          centerFontSize = {16}
        />
      </View>
    </Animated.View>
  );
}

ProfileView.propTypes = {
  name: PropTypes.string,
  fadeInValue: PropTypes.any,
  showMenu: PropTypes.func,
  onEdit: PropTypes.func,
  price: PropTypes.number,
  imageItems: PropTypes.array,
  flagShowAllGoals: PropTypes.bool,
  showAll: PropTypes.func,
  bioDescription: PropTypes.string,
  numberOfLines: PropTypes.number,
  avatarUrl: PropTypes.string
};
