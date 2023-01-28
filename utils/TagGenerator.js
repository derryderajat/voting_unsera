exports.generateTag = (length) => {
  let result = '';
  let characters = `1234567890abcdefghijklmnopqrstuvwxyz`;
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
