import ImagePicker from 'react-native-image-picker';

const settings = {
  title: 'Select Image',
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...',
  chooseFromLibraryButtonTitle: 'Choose from Library...',
  cameraType: 'back',
  mediaType: 'photo',
  videoQuality: 'high',
  durationLimit: 60,
  maxWidth: 500,
  maxHeight: 500,
  aspectX: 2,
  aspectY: 1,
  quality: 1,
  angle: 0,
  allowsEditing: false,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export const imagePicker = {
  show(options = {}) {
    return new Promise((resolve, reject) => {
      ImagePicker.showImagePicker(Object.assign(settings, options), (response) => {
        debugger;
        const result = {
          source: null,
          type: null,
          message: '',
        };
        if (response.didCancel) {
          result.type = 'UserCancel';
          result.message = 'User cancelled image picker';
        } else if (response.error) {
          return reject({
            type: 'Error',
            message: response.error,
          });
        } else if (response.customButton) {
        } else {
          result.source = {
            uri: `data:image/jpeg;base64,${response.data}`,
            isStatic: true,
          };
        }
        return resolve(result);
      });
    });
  },
};
