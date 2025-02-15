// 双重for循环示例
export function doubleForLoopExample() {
  const rows = 3;
  const cols = 3;

  // 外层循环控制行
  for (let i = 0; i < rows; i++) {
    // 内层循环控制列
    for (let j = 0; j < cols; j++) {
      console.log(`当前坐标: (${i}, ${j})`);
    }
  }
}
