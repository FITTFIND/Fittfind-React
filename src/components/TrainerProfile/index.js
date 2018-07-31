import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SimpleTopNav, PhotoGallery } from 'AppComponents';
import { WHITE, BLUE, BORDER_COLOR, BACKGROUND_COLOR } from 'AppColors';
import { NAVBAR_MARGIN_TOP, WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { LabelText } from 'AppFonts';
import { FAVORITE_SERVICE } from 'AppServices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: 'column'
  },
  headerContainer: {
    height: WINDOW_WIDTH
  },
  navBarContainer: {
    flex: 1,
    marginTop: NAVBAR_MARGIN_TOP,
  },
  navIconContainer: {
    width: 110,
    justifyContent: 'center',
    paddingLeft: 10
  },
  menuImage: {
    width: 10,
    resizeMode: 'contain',
  },
  labelText: {
    color: WHITE
  },
  navRightIconContainer: {
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  favoriteIconContainer: {
    flex: 1,
    marginLeft: 10
  },
  favoriteIcon: {
    width: 20,
    resizeMode: 'contain',
  },
  chatContainer: {
    flex: 1,
    marginRight: 10
  },
  labelChat: {
    alignSelf: 'flex-end',
    color: WHITE
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
    opacity: 0.7
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
  mainContainer: {
    flex: 1,
    marginHorizontal: 17
  },
  labelAudition: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: WHITE
  },
  iconPlay: {
    width: 20,
    resizeMode: 'contain',
    marginLeft: 5
  },
  biographyContainer: {
    marginTop: 30,
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
  bookContainer: {
    marginTop: 13,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center'
  },
  hourlyRateLabelContainer: {
    flex: 1,
    borderRightWidth: 1 / 2,
    borderColor: '#2d2d2d'
  },
  hourlyRateContainer: {
    flex: 1,
    marginLeft: 10,
  },
  bookButtonContainer: {
    flex: 1,
    marginHorizontal: 15,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BORDER_COLOR
  },
  helpContainer: {
    width: 35,
  },
  bookSubContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  helpSubContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 18
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
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const leftNavbar = (
  <View style={styles.navIconContainer}>
    <Image source={require('img/icon_back.png')} style={styles.menuImage} />
  </View>
);

export class TrainerProfile extends Component {
  static propTypes= {
    navigator: PropTypes.object,
    otherUser: PropTypes.object,
    feathers: PropTypes.object.isRequired,
    disableSideBar: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      numberOfLines: 2,
      flagShowAllGoals: false,
      favorite: false,
    };
    this.showMenu = ::this.showMenu;
    this.showAll = ::this.showAll;
    this.addFavorite = ::this.addFavorite;
    this.renderFavorite = ::this.renderFavorite;
    this.goChatScene = ::this.goChatScene;
    this.setBook = ::this.setBook;
    this.showAuditionVideo = ::this.showAuditionVideo;
    this.currentUser = null;
    this.favoriteId = '';
  }

  componentDidMount() {
    const { feathers, otherUser } = this.props;
    this.currentUser = feathers.get('user');
    const favoriteService = this.props.feathers.service(FAVORITE_SERVICE);
    const createdBy = this.currentUser._id;
    const query = {
      createdBy
    };
    favoriteService.find({ query })
      .then(res => {
        if (res.length === 0) {
          this.setState({ favorite: false });
        } else {
          this.favoriteId = res[0]._id;
          if (res[0].favoriteUsers.indexOf(otherUser._id) > -1) {
            this.setState({ favorite: true });
          }
        }
      })
      .catch(e => console.info('error!', e));
  }

  setBook() {
    const { navigator, otherUser } = this.props;
    navigator.push({
      name: 'BookingScene',
      passProps: { trainer: otherUser }
    });
  }

  showAuditionVideo() {
    const { otherUser } = this.props;
    alert(otherUser.trainer.auditionVideoUrl);
  }

  addFavorite() {
    const { favorite } = this.state;
    const { otherUser, feathers } = this.props;
    const favoriteService = feathers.service(FAVORITE_SERVICE);
    const createdBy = this.currentUser._id;
    const query = {
      createdBy
    };
    favoriteService.find({ query })
      .then(res => {
        if (res.length === 0) {
          const data = {
            createdBy,
            favoriteUsers: [otherUser._id]
          };
          favoriteService.create(data)
            .then(result => {
              this.favoriteId = result._id;
            })
            .catch(e => console.info('error creating favorite', e));
        } else {
          this.favoriteId = res[0]._id;
          const favoriteUsers = res[0].favoriteUsers;
          if (favorite) {
            const index = favoriteUsers.indexOf(otherUser._id);
            if (index > -1) {
              favoriteUsers.splice(index, 1);
            }
          } else {
            favoriteUsers.push(otherUser._id);
          }
          console.info('favoriteId11', this.favoriteId);
          favoriteService.patch(this.favoriteId, { favoriteUsers })
            .then(result => {
              console.info('result~', result);
              this.setState({ favorite: !favorite });
            })
            .catch(e => console.info('error!', e));
        }
      })
      .catch(err => console.info('error finding favorite', err));
  }

  showMenu() {
    this.props.navigator.pop();
    this.props.disableSideBar(false);
  }

  showAll() {
    this.setState({ flagShowAllGoals: true });
  }

  goChatScene() {
    const { feathers, otherUser, navigator } = this.props;
    this.currentUser = feathers.get('user');
    const threadId = null;
    navigator.push({
      name: 'ChatScene',
      passProps: { otherUser, threadId }
    });
  }

  renderFavorite() {
    const { favorite } = this.state;
    if (favorite) {
      return (
        <Image source={require('img/icon_favorite_active.png')} style={styles.favoriteIcon} />
      );
    }
    return (
      <Image source={require('img/icon_favorite.png')} style={styles.favoriteIcon} />
    );
  }

  renderBiographyDescription() {
    const { otherUser } = this.props;
    const { numberOfLines, flagShowAllGoals } = this.state;
    let subGoal = otherUser.trainer.bioDescription;
    if (otherUser.trainer.bioDescription.length > 75 && !flagShowAllGoals) {
      subGoal = otherUser.trainer.bioDescription.substring(0, 75);
      subGoal = `${subGoal}...   `;
      return (
        <View style={styles.contentBiographyContainer}>
          <TouchableOpacity onPress={this.showAll}>
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
  }

  renderMain() {
    const { otherUser } = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.biographyContainer}>
          <LabelText style={styles.labelText} fontSize={14}>
            Biography
          </LabelText>
          {this.renderBiographyDescription()}
        </View>
        <View style={styles.bookContainer}>
          <View style={styles.hourlyRateLabelContainer}>
            <LabelText style={styles.contentText} fontSize={13}>
              Fee per hour
            </LabelText>
          </View>
          <View style={styles.hourlyRateContainer}>
            <LabelText style={styles.labelText} fontSize={13}>
              £{otherUser.trainer.price}
            </LabelText>
          </View>
          <TouchableOpacity style={styles.bookButtonContainer} onPress={() => this.setBook()}>
            <View style={styles.bookSubContainer}>
              <LabelText style={styles.labelText} fontSize={13}>
                Book
              </LabelText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpContainer}>
            <View style={styles.helpSubContainer}>
              <LabelText style={styles.labelText} fontSize={15}>
                ?
              </LabelText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.galleryContainer}>
          <View style={styles.galleryLabelContainer}>
            <LabelText style={styles.labelText} fontSize={15}>
              {otherUser.trainer.imageItems.length}
            </LabelText>
            <LabelText style={styles.contentText} fontSize={15}>
              PHOTOS
            </LabelText>
          </View>
          <View style={styles.horizontalListContainer}>
            <PhotoGallery
              img_array = {otherUser.trainer.imageItems}
            />
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { otherUser } = this.props;
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.trainerImageContainer}>
              <Image
                source=
                  {otherUser.avatarUrl === '' ?
                    require('img/temp_trainer_image.png') : { uri: otherUser.avatarUrl }
                    }
                style={styles.trainerImage}
              />
            </View>
            <View style={styles.navBarContainer}>
              <SimpleTopNav
                centerLabel={otherUser.name}
                leftAction={this.showMenu}
                backgroundColor={"transparent"}
                leftLabel = {leftNavbar}
                rightLabel = {<View style={styles.navRightIconContainer}>
                                 <View style={styles.favoriteIconContainer}>
                                    <TouchableOpacity onPress={this.addFavorite}>
                                      {this.renderFavorite()}
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.chatContainer}>
                                    <TouchableOpacity onPress={() => this.goChatScene()}>
                                      <LabelText style={styles.labelChat} fontSize={14}>
                                        Chat
                                      </LabelText>
                                    </TouchableOpacity>
                                  </View>
                               </View>
                              }
                centerFontSize = {16}
              />
            </View>
          </View>
          {this.renderMain()}
          <View style={styles.auditionViewContainer}>
            <TouchableOpacity style={styles.auditionContainer} onPress={this.showAuditionVideo}>
              <LabelText style={styles.labelAudition} fontSize={15}>
                Audition Video
              </LabelText>
              <Image
                source={require('img/icon_play.png')}
                style={styles.iconPlay}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
