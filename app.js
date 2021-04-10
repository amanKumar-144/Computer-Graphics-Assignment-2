import vertexShaderText from "./vertex.js"
import fragmentShaderText from "./fragment.js"
import Shader from "./shader.js"
import Cube from "./cube.js"
import Mesh from "./mesh.js"



var canvas=document.getElementById("myCanvas");
var gl=canvas.getContext("webgl",{preserveDrawingBuffer: true});

canvas.width=1000;
canvas.height=1000;

var shader= new Shader(gl,vertexShaderText,fragmentShaderText);
shader.compile();
shader.link();

var stopRenderer=0;


var axisList=[];
var objectList=[];

//Our 3 axis
var shapeZAxis=new Mesh(1,shader.program,gl,[0.0,0.0,1.0],"my_axis.obj",canvas,Math.PI/2,[1,0,0]);
var shapeYAxis=new Mesh(2,shader.program,gl,[1.0,0.0,0.0],"my_axis.obj",canvas,0,[1,0,0]);
var shapeXAxis=new Mesh(3,shader.program,gl,[0.0,1.0,0.0],"my_axis.obj",canvas,-Math.PI/2,[0,0,1]);
axisList.push(shapeZAxis);
axisList.push(shapeYAxis);
axisList.push(shapeXAxis);

//Our 3 shapes
var cube1=new Mesh(1,shader.program,gl,[1.0,1.0,0.0],"my_cube.obj",canvas,0,[1,0,0]);
var octahedron=new Mesh(2,shader.program,gl,[0.0,1.0,1.0],"my_octahedron.obj",canvas,0,[1,0,0]);
var cube2=new Mesh(3,shader.program,gl,[1.0,0.0,1.0],"my_cube.obj",canvas,0,[1,0,0]);
objectList.push(cube1);
objectList.push(octahedron);
objectList.push(cube2);


var modeScale=0;
var modeRotate=0;

var xCoor,yCoor,finalX,finalY;
finalX=0;
finalY=0;
var mouseX=0;
var mouseY=0;
//(a,b)->(0,1)->(c,d)
var mapFunction=function(value,a,b,c,d)
{
    value=(value-a)/(b-a);
    value=c+value*(d-c);
    return value
}
window.addEventListener("click", function(event) {
    var x=xCoor*canvas.width/canvas.clientWidth;
    var y=canvas.height - yCoor*canvas.height/canvas.clientHeight-1;
    var pixels = new Uint8Array(4);
    gl.readPixels(x,y,1,1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);

    if(pixels[0]==255.0 && pixels[1]==255.0 && pixels[2]==255.0)
    {
        objectList[0].colour=[1.0,1.0,0.0];
        objectList[1].colour=[0.0,1.0,1.0];
        objectList[2].colour=[1.0,0.0,1.0];
    }
});
window.addEventListener("mousemove", function(event) {
    xCoor = event.clientX;
    yCoor = event.clientY;

    finalX = (xCoor / canvas.width) * (2) - 1;
    finalY = (yCoor / canvas.height) * (2) - 1;
    finalY = -finalY;

    mouseX=finalX;
    mouseY=finalY;

    finalX=mapFunction(finalX,-1,1,-9,9);
    finalY=mapFunction(finalY,-1,1,-9,9);

    //Create a map function
    console.log("The screen coordinates are ", xCoor, " ", yCoor);
    console.log("The WebGL coordinates are ", mouseX, " ", mouseY);

    

});
window.addEventListener("keydown", function(event) {
    //3 points of a Triangle
    if(event.key == 'd') {
        cube1.translate=[4,4,0];
        octahedron.translate=[-4,0,0];
        cube2.translate=[4,-4,0];
    }
    //Mid point of sides of a Triangle
    else if(event.key=='e'){
        cube1.translate=[4,0,0];
        octahedron.translate=[0,2,0];
        cube2.translate=[0,-2,0];
    }
    else if(event.key=='f'){
        if(modeRotate==0)
        {
            cube1.rotationAngle=45;
            cube1.rotationAxis=[1,0,0];

            cube2.rotationAngle=45;
            cube2.rotationAxis=[0,1,0];

            octahedron.rotationAngle=45;
            octahedron.rotationAxis=[0,0,1];
            modeRotate=1;
        }
        else if(modeRotate==1)
        {
            cube1.rotationAngle=0;
            cube1.rotationAxis=[1,0,0];

            cube2.rotationAngle=0;
            cube2.rotationAxis=[0,1,0];

            octahedron.rotationAngle=0;
            octahedron.rotationAxis=[0,0,1];
            modeRotate=0;
        }
    }
    else if(event.key=='g'){
        if(modeScale==0)
        {
            cube1.scale=[0.5,0.5,0.5];
            octahedron.scale=[2.0,2.0,2.0];
            cube2.scale=[3.0,3.0,3.0];
            modeScale=1;
        }
        else if(modeScale==1)
        {
            cube1.scale=[1.0,1.0,1.0];
            octahedron.scale=[1.0,1.0,1.0];
            cube2.scale=[1.0,1.0,1.0];
            modeScale=0;
        }
    }
    else if(event.key=='h')
    { 
        var x=xCoor*canvas.width/canvas.clientWidth;
        var y=canvas.height - yCoor*canvas.height/canvas.clientHeight-1;
        var pixels = new Uint8Array(4);
        gl.readPixels(x,y,1,1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        console.log(pixels);

        //Cube1 selected
        if(pixels[0]==255.0 && pixels[1]==255.0)
        {
            objectList[0].colour=[0.0,0.0,0.0];
        }
        //Octahedron selected
        else if(pixels[1]==255.0 && pixels[2]==255.0)
        {
            objectList[1].colour=[0.0,0.0,0.0];
        }
        //Cube2 selected
        else if(pixels[0]==255.0 && pixels[2]==255.0)
        {
            objectList[2].colour=[0.0,0.0,0.0];
        }
    }
});


function animate()
{
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    for(var i=0;i<axisList.length;i++)
    {
        axisList[i].drawShape(finalX,finalY);
    }
    for(var i=0;i<objectList.length;i++)
    {
        objectList[i].drawShape(finalX,finalY);
    }
    window.requestAnimationFrame(animate);
}
animate();
