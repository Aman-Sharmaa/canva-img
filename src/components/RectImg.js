import '../assets/css/style.css';
import React, { useEffect, useRef, useState } from 'react';

const RectImg = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState([]);

  const canvasOffSetX = useRef(null);
  const canvasOffSetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;

    const canvasOffSet = canvas.getBoundingClientRect();
    canvasOffSetX.current = canvasOffSet.left;
    canvasOffSetY.current = canvasOffSet.top;
  }, []);

  const startDrawingRectangle = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    startX.current = nativeEvent.clientX - canvasOffSetX.current;
    startY.current = nativeEvent.clientY - canvasOffSetY.current;

    setIsDrawing(true);
  };

  const drawRectangle = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }

    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
    const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

    const rectWidth = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current.strokeRect(startX.current, startY.current, rectWidth, rectHeight);

    // Update the rectangles state with the current rectangle's coordinates
    setRectangles((prevRectangles) => [
      ...prevRectangles,
      { x: startX.current, y: startY.current, w: rectWidth, h: rectHeight },
    ]);
  };

  const stopDrawingRectangle = () => {
    setIsDrawing(false);
  };

  const setToDraw = () => {
    contextRef.current.globalCompositeOperation = 'source-over';
  };

  const setToErase = () => {
   

    setRectangles([]);
  };

  return (
    <div>
      <canvas
        className="canvas-container-rect"
        ref={canvasRef}
        onMouseDown={startDrawingRectangle}
        onMouseMove={drawRectangle}
        onMouseUp={stopDrawingRectangle}
        onMouseLeave={stopDrawingRectangle}
      ></canvas>
      <div className="btn">
        <button onClick={setToDraw}>Draw</button>
        <button onClick={setToErase}>Erase</button>
      </div>
      <div className="coordinates">
        <h3>Coordinates:</h3>
        <ul>
          {rectangles.map((rect, index) => (
            <li key={index}>{`Rectangle ${index}: x: ${rect.x}, y: ${rect.y}, w: ${rect.w}, h: ${rect.h}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RectImg;
