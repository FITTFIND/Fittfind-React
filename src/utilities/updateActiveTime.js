export function updateActiveTime(activeTime, currentUserId) {
  const updatedActiveTime = activeTime;
  updatedActiveTime.forEach((item, i) => {
    if (item._id === currentUserId) {
      updatedActiveTime[i] = {
        _id: currentUserId,
        time: new Date(),
      };
    }
  });
  return updatedActiveTime;
}
