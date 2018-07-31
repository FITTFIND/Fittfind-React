import _ from 'lodash';

const imageItems = ['https://s3-us-west-1.amazonaws.com/fitfind/i/image1.png',
  'https://s3-us-west-1.amazonaws.com/fitfind/i/image2.png',
  'https://s3-us-west-1.amazonaws.com/fitfind/i/image3.png',
  'https://s3-us-west-1.amazonaws.com/fitfind/i/image4.png'
];
const audioItems = ['https://s3-us-west-1.amazonaws.com/fitfind/a/Let+it+go.mp3',
  'https://s3-us-west-1.amazonaws.com/fitfind/a/I+See+The+Light.mp3'
];
const audioItemNames = ['Let it go',
  'I see the light'];
const audioItemDurations = [226,
  213];
const mesagePattern = (repeatCount, pattern) => {
  let ret = '';
  for (let i = 0; i < repeatCount; i ++) {
    ret = `${pattern} ${ret}`;
  }
  return ret;
};
const count = 10;
export const CHAT_LOG = _.map(_.range(0, count), (value, index) => {
  const type = index % 2 === 0 ? 'sender' : 'receiver';
  const name = `test account ${index}`;
  const avatar = imageItems[0];
  const sendTime = new Date(2016, 10, 10 + index);
  let messageContent = {};
  switch (index % 3) {
    case 0:
      {
        messageContent = {
          type: 'text',
          content: mesagePattern(index % 6 + 3, '123 test d%%'),
          name: ''
        };
      }
      break;
    case 1:
      {
        messageContent = {
          type: 'audio',
          content: audioItems[index % 2],
          name: audioItemNames[index % 2],
          duration: audioItemDurations[index % 2],
        };
      }
      break;
    case 2:
      {
        messageContent = {
          type: 'image',
          content: imageItems[index % 4],
          name: ''
        };
      }
      break;
    default:
      break;
  }
  return {
    type,
    name,
    avatar,
    sendTime,
    messageContent,
  };
});

export const BOOK_ITEMS = _.map(_.range(0, count), (value, index) => {
  const name = `Alexander${index}`;
  const location = 'Paris, France';
  const avatar = imageItems[index % 4];
  const distance = 1.6 + index;
  const bookDate = '22 OCT 2016';
  const bookTime = '04:30 PM';
  const trainHours = 2;
  const payment = 250;
  return {
    name,
    location,
    avatar,
    distance,
    bookDate,
    bookTime,
    trainHours,
    payment
  };
});
// console.info('test messages', CHAT_LOG);
