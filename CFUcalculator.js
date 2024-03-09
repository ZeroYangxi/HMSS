function CFUCounter(colonies, size, exposureTime) {
  let CFU = 5 * colonies * Math.pow(10, 4) * Math.pow(size * exposureTime, -1);
  return CFU;
}
