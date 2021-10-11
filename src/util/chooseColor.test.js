import chooseColor from './chooseColor';

test('chooses color by seeded method', () => {
  expect(chooseColor(0, 1)).toBe('blue');
  expect(chooseColor(1, 1)).toBe('red');
  expect(chooseColor(2, 1)).toBe('yellow');
  expect(chooseColor(3, 1)).toBe('green');
});

test('chooses color by rotating method', () => {
  for (let i = 0; i <= 3; i++) {
    expect(chooseColor(0, 2)).toBe('#3366CC');
    expect(chooseColor(1 + 20 * i, 2)).toBe('#DC3912');
    expect(chooseColor(2 + 20 * i, 2)).toBe('#FF9900');
    expect(chooseColor(3 + 20 * i, 2)).toBe('#109618');
  }
});

test('chooses color by default method', () => {
  expect(chooseColor(0)).toBe('#a9d62c');
  // There is really not much point in asserting more about the output
  // of an opaque third-party library.
});

