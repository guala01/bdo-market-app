function isValidDays(days) {
  const validDays = [1, 3, 7];
  return validDays.includes(Number(days));
}

module.exports = {
  isValidDays
};