export type Pixel = [number, number, number];

function generateRandomColor() {
  // 生成一个0到255之间的随机整数
  return Math.floor(Math.random() * 256);
}

function generateRandomColorsArray(numColors: number) {
  const colors: Pixel[] = [];
  for (let i = 0; i < numColors; i++) {
    // 对于每种颜色，生成红、绿、蓝分量
    const color: Pixel = [generateRandomColor(), generateRandomColor(), generateRandomColor()];
    colors.push(color);
  }
  return colors;
}

// 生成一个包含5种随机颜色的数组

export function transformColors() {
  const mainColors: Pixel[] = generateRandomColorsArray(50);
  const c = [...mainColors];
  for (let i = 0; i < 28; i++) {
    mainColors.push(...c);
  }
  return mainColors;
}
