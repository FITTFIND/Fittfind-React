import React, { PropTypes } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SimpleTopNav } from 'AppComponents';
import { WINDOW_WIDTH, NAVBAR_MARGIN_TOP } from 'AppConstants';
import { LabelText } from 'AppFonts';
import { WHITE, BACKGROUND_COLOR, GRAY_COLOR, BLUE, DARK_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
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
  labelText: {
    color: WHITE,
    backgroundColor: 'transparent'
  },
  menuImage: {
    width: 20,
    resizeMode: 'contain',
  },
  contentGoalContainer: {
    marginTop: 10,
    backgroundColor: 'transparent'
  },
  contentText: {
    color: GRAY_COLOR,
  },
  readMoreText: {
    color: BLUE,
    marginTop: -10,
    backgroundColor: 'transparent'
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
  iconComment: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    justifyContent: 'center',
    left: 10
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
  contentContainer: {
    marginTop: 10
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

const renderGoalDescription = (goalDescription, numberOfLines, flagShowAllGoals, showAll) => {
  let subGoal = goalDescription;
  if (goalDescription.length > 75 && !flagShowAllGoals) {
    subGoal = goalDescription.substring(0, 75);
    subGoal = `${subGoal}...   `;
    return (
      <View style={styles.contentGoalContainer}>
        <TouchableOpacity onPress={showAll}>
          <LabelText style={styles.contentText} fontSize={12.5} numberOfLines={numberOfLines}>
            { subGoal }
            {!flagShowAllGoals &&
            <LabelText style={styles.readMoreText} fontSize={12.5}>
              Read More
            </LabelText>
            }
          </LabelText>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.contentGoalContainer}>
      <LabelText style={styles.contentText} fontSize={12.5} numberOfLines={0}>
        { subGoal }
      </LabelText>
    </View>
  );
};

const renderScrollView =
  (avatarUrl,
   goalDescription,
   numberOfLines,
   flagShowAllGoals,
   showAll,
   lifeStyle,
   trainEnvironment
  ) => (
    <ScrollView automaticallyAdjustContentInsets={false} >
      <View style={styles.userImageContainer}>
        <Image
          source={avatarUrl === '' ? require('img/app_back_image1.png') : { uri: avatarUrl }}
          style={styles.userBackImage}
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.goalContainer}>
          <LabelText style={styles.labelText} fontSize={12.5}>
            Personal goals
          </LabelText>
          {renderGoalDescription(goalDescription, numberOfLines, flagShowAllGoals, showAll)}
        </View>
        <View style={styles.goalContainer}>
          <LabelText style={styles.labelText} fontSize={12.5}>
            Lifestyle
          </LabelText>
          <View style={styles.contentContainer}>
            <LabelText style={styles.contentText} fontSize={12.5} numberOfLines={0}>
              {lifeStyle}
            </LabelText>
          </View>
        </View>
        <View style={styles.goalContainer}>
          <LabelText style={styles.labelText} fontSize={12.5}>
            Training environment
          </LabelText>
          <View style={styles.contentContainer}>
            <LabelText style={styles.contentText} fontSize={12.5}>
              {trainEnvironment}
            </LabelText>
          </View>
        </View>
      </View>
    </ScrollView>
);

export function ProfileView({
  userName,
  fadeInValue,
  showSideMenu,
  onEdit,
  avatarUrl,
  goalDescription,
  numberOfLines,
  flagShowAllGoals,
  showAll,
  lifeStyle,
  trainEnvironment
}) {
  return (
    <Animated.View style={[styles.container, { opacity: fadeInValue }]}>
      {renderScrollView(
        avatarUrl,
        goalDescription,
        numberOfLines,
        flagShowAllGoals,
        showAll,
        lifeStyle,
        trainEnvironment
      )}
      <View style={styles.navBarContainer}>
        <SimpleTopNav
          centerLabel={userName}
          leftAction={showSideMenu}
          backgroundColor={"transparent"}
          leftLabel = {leftNavbar}
          wrapStyle = {{ width: WINDOW_WIDTH }}
          rightLabel = {rightNavbar(onEdit)}
          centerFontSize={16}
        />
      </View>
    </Animated.View>
  );
}

ProfileView.propTypes = {
  userName: PropTypes.string,
  fadeInValue: PropTypes.any,
  showSideMenu: PropTypes.func,
  onEdit: PropTypes.func,
  avatarUrl: PropTypes.string,
  goalDescription: PropTypes.string,
  numberOfLines: PropTypes.number,
  flagShowAllGoals: PropTypes.bool,
  showAll: PropTypes.func,
  lifeStyle: PropTypes.string,
  trainEnvironment: PropTypes.string
};
