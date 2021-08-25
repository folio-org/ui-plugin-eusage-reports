/* eslint-disable no-console */

let _stashedParams;
let _stashedResult;

function myUseMemo(func, params) {
  if (!_stashedParams) {
    _stashedParams = params;
    _stashedResult = func();
    console.log('myUseMemo: first call, calculated value', _stashedResult);
    return _stashedResult;
  }

  const changed = [];
  params.forEach((val, i) => {
    if (val !== _stashedParams[i]) {
      changed.push([i, val]);
    }
  });

  if (changed.length === 0) {
    console.log('myUseMemo: no change, returning old value', _stashedResult);
    return _stashedResult;
  }

  _stashedParams = params;
  _stashedResult = func();
  console.log('myUseMemo: change in params', changed.map(([i, val]) => `${i}=${val}`).join(', '), '- recalculated', _stashedResult);
  return _stashedResult;
}

export default myUseMemo;
