import { useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
import { newRect, addRect } from "../utilities/canvasFunctions";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

function AppFabric(props) {

    const { editor, onReady } = useFabricJSEditor();

    const canvasRef = useRef();
    const [canvas, setCanvas] = useState(null);
    const [currentCanvasObject, setCurrentCanvasObject] = useState(null);
    const [rect, setRect] = useState(null);

    const [ imageURL ] = useState(props.imageURL)

    var rectangle, isDown, mouseMoved, origX, origY;
    var imgElement, imgInstance;

    var textObj;
  
    // Initialize Canvas
    const initCanvas = () => new fabric.Canvas("c", 
      {
        height: 800,
        width: 800,
        backgroundColor:'yellow'
      })
    
    // 
    const handleGetPosition = () => {

      try{

        alert("object selected")

        var obj = canvas.getActiveObject();
        console.log({
          "Selected Object": obj,
          "Top: " : obj.top,
          "Left: " : obj.left,
          "Width: ": obj.width,
          "Height: " : obj.height,
        })

        // INSERT CODE retrieve box coordination

      } catch (error) {
        console.log({"Active Object selection error: " : error})
      }
      
    };

    const addText = () => {
        
      // Create a new Textbox instance 
      textObj = new fabric.Textbox('A Computer Science Portal', {
          left: 0,
          top: 0,
          width: 500,
      });

      canvas.add(textObj);
      console.log("caaaannnnesss", canvas)
      canvas.renderAll();

    }


    const embbedImage = () => {
      console.log("imgElement", canvas)

      imgElement = document.getElementById('myImage');
      imgInstance = new fabric.Image(imgElement, {});
      
      canvas.add(imgInstance);
      canvas.renderAll();

    }

    const getCanvas = () => {
      console.log(canvas)
      canvas.defaultCursor ="pointer"
      console.log("rect", rect)
    }
  
    useEffect(() => {

      const canvas = initCanvas();
      setCanvas(canvas);

      console.log("canvas", canvas)

      canvas.defaultCursor = "crosshair";

      // // Create a new Textbox instance 
      // var text = new fabric.Textbox(
      //     'A Computer Science Portal', {
      //     left: 0,
      //     top: 0,
      //     width: 10,
      // });

      // canvas.add(text)

      // MOUSE DOWN
      canvas.on('mouse:down', function(o){

        // prevent adding new rect when mouse is down within a rectangle object 

        try{

          // Log the active object attribute
          var obj = canvas.getActiveObject();

          console.log({
            "Selected Object": obj,
            "Top: " : obj.top,
            "Left: " : obj.left,
            "Width: ": obj.width,
            "Height: " : obj.height,
          })
  
        }  catch (e) {

          // create a new rectangle when mouse is down outside any existing rectangle
          var pointer = canvas.getPointer(o.e);

          isDown = true;
          origX = pointer.x;
          origY = pointer.y;
          
          rectangle = new fabric.Rect({
              left: origX,
              top: origY,
              fill: 'transparent',
              stroke: 'red',
              strokeWidth: 1,
          });

        }

      });

      // MOUSE MOVE within canvas
      canvas.on('mouse:move', function(o){

        // console.assert({"log mouse position" : o })

        if (!isDown) return;

        mouseMoved = true;

        var pointer = canvas.getPointer(o.e);
        
        if(origX>pointer.x){
            rectangle.set({ left: Math.abs(pointer.x) });
        }

        if(origY>pointer.y){
            rectangle.set({ top: Math.abs(pointer.y) });
        }

        console.log("TEST", rectangle)
        
        rectangle.set({ width: Math.abs(origX - pointer.x) });
        rectangle.set({ height: Math.abs(origY - pointer.y) });
        canvas.renderAll();

      });

      // MOUSE UP
      canvas.on('mouse:up', function(o) {

        // prevent new creation of rectangle if the mouseMoved variable is False.
        if(!mouseMoved) return;

        console.log(rectangle.width)
        canvas.add(rectangle)
        setRect(rectangle)

        console.log(
          {"rectangle variable: " : canvas.toObject().objects},
          {"rect state: " : rect}
        )

        isDown = false;
        mouseMoved = false;
        
      });

      setCurrentCanvasObject(canvas.toObject().objects);

    }, []);

    const onAddCircle = () => {
      editor.addCircle();
    };
    const onAddRectangle = () => {
      editor.addRectangle();
    };
  
    return (
      <div className="App">
        <div
          style={{
            width: "10%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px"
          }}
        >
          {/* <button onClick={() => handleUndo(indexInHistory, history, setIndexInHistory)}>Undo</button>
          <button onClick={() => handleRedo(indexInHistory, setIndexInHistory)}>Redo</button> */}

          <button onClick={() => handleGetPosition()}>getPosition</button>
          <button onClick={() => newRect(canvas, setRect, 100, 100, 10, 10)}>createNewRect</button>
          <button onClick={() => embbedImage()}>embbedImage</button>
          <button onClick={ () => addText(canvas) }>add text</button>
          <button onClick={ () => addRect(canvas, setRect, rect) }>add text</button>
          <button onClick={ getCanvas }>getCanvas</button>


          <p>{imageURL}</p>
        </div>
        <button onClick={onAddCircle}>Add circle</button>
        <button onClick={onAddRectangle}>Add Rectangle</button>
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        <canvas id="c" ref={canvasRef} />
      </div>
    );
  }
  
  export default AppFabric;