import Paper from "paper";

type BezierCoordinates = [paper.Point, paper.Point, paper.Point, paper.Point];

const point2Converter = (p1: number, p2: number, z: number) => {
  return ((z - 1) / z) * p1 + (1 / z) * p2;
};

const point3Converter = (p1: number, p2: number, p3: number, z: number) => {
  return (
    ((z ** 2 - 2 * z + 1) / z ** 2) * p1 +
    ((2 * (z - 1)) / z ** 2) * p2 +
    (1 / z ** 2) * p3
  );
};

const point4Converter = (
  p1: number,
  p2: number,
  p3: number,
  p4: number,
  z: number
) => {
  return (
    ((z ** 3 - 3 * z ** 2 + 3 * z - 1) / z ** 3) * p1 +
    ((3 * (z - 1) ** 2) / z ** 3) * p2 +
    ((3 * (z - 1)) / z ** 3) * p3 +
    (1 / z ** 3) * p4
  );
};

const transformCoordinates = (coordinates: BezierCoordinates, z: number) => {
  const p1 = coordinates[0],
    p2 = coordinates[1],
    p3 = coordinates[2],
    p4 = coordinates[3];

  const newP1 = new Paper.Point(p1.x, p1.y);

  const newP2 = new Paper.Point(
    point2Converter(p1.x, p2.x, z),
    point2Converter(p1.y, p2.y, z)
  );

  const newP3 = new Paper.Point(
    point3Converter(p1.x, p2.x, p3.x, z),
    point3Converter(p1.y, p2.y, p3.y, z)
  );

  const newP4 = new Paper.Point(
    point4Converter(p1.x, p2.x, p3.x, p4.x, z),
    point4Converter(p1.y, p2.y, p3.y, p4.y, z)
  );

  return [newP1, newP2, newP3, newP4] as BezierCoordinates;
};

const drawBezier = (
  coordinates: BezierCoordinates,
  strokeColor: string,
  strokeWidth: number
) => {
  const path = new Paper.Path({ strokeColor, strokeWidth });

  path.moveTo(coordinates[0]);
  path.cubicCurveTo(coordinates[1], coordinates[2], coordinates[3]);

  path.segments.forEach((s) => (s.selected = true));
};

function App() {
  return (
    <div className="w-screen h-screen p-5 flex flex-col items-center">
      <h1 className="text-xl font-bold flex-1 mb-2">
        Welcome to the stroke to path project
      </h1>
      <canvas
        className="w-full h-full border-2 border-slate-200 rounded-md"
        ref={(canvas) => {
          if (!canvas) return;
          const paper = new Paper.PaperScope();
          paper.setup(canvas);

          const initialCoordinates = [
            new Paper.Point(400, 400),
            new Paper.Point(430, 430),
            new Paper.Point(480, 480),
            new Paper.Point(500, 400),
          ] as BezierCoordinates;

          drawBezier(initialCoordinates, "black", 4);
          drawBezier(transformCoordinates(initialCoordinates, 0.1), "red", 4);
        }}
      ></canvas>
    </div>
  );
}

export default App;
