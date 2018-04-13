function getRandomInt(min, max) {
  return min + parseInt(Math.random() * (max - min + 1));
}
module.exports = {
  getRandomInt,
  getRandomArray: (prefix, number, min, max, notInclude) => {
    const array = [];
    while (array.length < number) {
      const rnd = getRandomInt(min, max);
      if (rnd !== notInclude) {
        const newItem = prefix + rnd;
        if (!array.find(item => item === newItem)) {
          array.push(newItem);
        }
      }
    }
    return array;
  },
};
