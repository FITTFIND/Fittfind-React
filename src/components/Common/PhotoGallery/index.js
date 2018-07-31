import React, { PropTypes } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  subContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  imageListItem: {
    width: 70,
    height: 70,
    alignSelf: 'stretch'
  }
});

const renderListViewItem = (imgs, bEditMode, uploadPhoto) => (
  imgs.map((img, index) => {
    if (index === imgs.length - 1 && bEditMode) {
      return (
        <TouchableOpacity onPress={uploadPhoto} key={img}>
          <View style={styles.subContainer}>
            <Image source={require('img/add_image.png')} style={styles.imageListItem} />
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.subContainer} key={img}>
        <Image source={{ uri: img }} style={styles.imageListItem} />
      </View>
    );
  })
);


export const PhotoGallery = ({
  img_array,
  bEditMode,
  uploadPhoto
}) => (
  <ScrollView horizontal={true}>
    <View style={styles.container}>
      {renderListViewItem(img_array, bEditMode, uploadPhoto)}
    </View>
  </ScrollView>
);


PhotoGallery.propTypes = {
  img_array: PropTypes.array,
  bEditMode: PropTypes.bool,
  uploadPhoto: PropTypes.func
};

PhotoGallery.defaultProps = {
  bEditMode: false
};
