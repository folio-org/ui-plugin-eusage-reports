function vectorAdd(v1, v2) {
  return v1.map((value, index) => value + v2[index]);
}

export default vectorAdd;
