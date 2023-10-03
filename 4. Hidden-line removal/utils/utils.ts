export const scalePoints = (x: number, y: number, z: number, scale: number = 1) => {
  return {
    x: x * scale,
    y: y * scale,
    z: z * scale,
  };
};

function rotate(value1: number, value2: number, angle: number) {
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);
  return {
    newValue1: cosTheta * value1 - sinTheta * value2,
    newValue2: sinTheta * value1 + cosTheta * value2,
  };
}

export function rotateAroundX(y: number, z: number, angle: number) {
  const { newValue1, newValue2 } = rotate(y, z, angle);
  return { rotatedY: newValue1, rotatedZ: newValue2 };
}

export function rotatePointsAroundX(
  points: { x: number; y: number; z: number }[],
  angle: number
) {
  return points.map((point: { x: number; y: number; z: number }) => {
    const { x, y, z } = point;
    const { rotatedY, rotatedZ } = rotateAroundX(y, z, angle);
    return { x: x, y: rotatedY, z: rotatedZ };
  });
}

export function rotateAroundY(x: number, z: number, angle: number) {
  const { newValue1, newValue2 } = rotate(x, z, angle);
  return { rotatedX: newValue1, rotatedZ: newValue2 };
}

export function rotatePointsAroundY(
  points: { x: number; y: number; z: number }[],
  angle: number
) {
  return points.map((point: { x: number; y: number; z: number }) => {
    const { x, y, z } = point;
    const { rotatedX, rotatedZ } = rotateAroundY(x, z, angle);
    return { x: rotatedX, y: y, z: rotatedZ };
  });
}

export function rotateAroundZ(x: number, y: number, angle: number) {
  const { newValue1, newValue2 } = rotate(x, y, angle);
  return { rotatedX: newValue1, rotatedY: newValue2 };
}

export function rotatePointsAroundZ(
  points: { x: number; y: number; z: number }[],
  angle: number
) {
  return points.map((point: { x: number; y: number; z: number }) => {
    const { x, y, z } = point;
    const { rotatedX, rotatedY } = rotateAroundZ(x, y, angle);
    return { x: rotatedX, y: rotatedY, z: z };
  });
}

export function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function setPixel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  context.fillStyle = color;
  context.fillRect(x, y, 1, 1);
}
