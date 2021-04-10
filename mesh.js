import OBJ from "https://cdn.skypack.dev/webgl-obj-loader";
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Mesh
{
    //Here str is "my_octahedral.obj","my_cube.obj","my_axis.obj"
    constructor(id,program,gl,colour,str,canvas,rotationAngle,rotationAxis)
    {
        this.id=id;
        this.scale=[1.0,1.0,1.0];
        this.translate=[0.0,0.0,0.0];
        this.program=program;
        this.gl=gl;
        this.colour=colour;
        this.str=str;
        this.rotationAngle=rotationAngle;
        this.rotationAxis=rotationAxis;

        this.width=canvas.width;
        this.height=canvas.height;

        this.worldMatrix=new Float32Array(16);
        this.viewMatrix=new Float32Array(16);
        this.projMatrix=new Float32Array(16);

        this.xRotation=new Float32Array(16);
        this.yRotation=new Float32Array(16);
        this.zRotation=new Float32Array(16);
        this.identity=new Float32Array(16);

        mat4.identity(this.xRotation);
        mat4.identity(this.yRotation);
        mat4.identity(this.zRotation);
        mat4.identity(this.identity);

        this.objectStr = document.getElementById(this.str).innerHTML;
        const mesh = new OBJ.Mesh(this.objectStr);
        this.object = mesh;
        OBJ.initMeshBuffers(gl, this.object);

        this.vertexAttributesData = new Float32Array(this.object.vertices);
        this.indexAttributesData = new Uint16Array(this.object.indices);

        this.objectVertexBufferObject=this.gl.createBuffer();
        this.objectIndexBufferObject=this.gl.createBuffer();

        if(!this.objectVertexBufferObject)
        {
            console.log("Error in creating the Buffer");
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.objectVertexBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.vertexAttributesData,this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.objectIndexBufferObject);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,this.indexAttributesData,this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);
    }

    //Functions
    //Transformations applied in opposite order
    
    updateMVPMatrix() 
    {
        mat4.identity(this.worldMatrix);
        mat4.translate(
          this.worldMatrix,
          this.worldMatrix,
          this.translate
        );
        mat4.rotate(
          this.worldMatrix,
          this.worldMatrix,
          this.rotationAngle,
          this.rotationAxis
        );
        mat4.scale(
          this.worldMatrix,
          this.worldMatrix,
          this.scale
        );
    }
    setTranslate(translationVec) 
    {
        this.translate = translationVec;
    }
    setScale(scalingVec) 
    {
      this.scale = scalingVec;
    }
    setRotate(rotationAxis, rotationAngle) 
    {
      this.rotationAngle = rotationAngle;
      this.rotationAxis = rotationAxis;
    }
    


    drawShape(finalX,finalY)
    {
        let elementPerVertex = 3;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.objectVertexBufferObject);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.objectIndexBufferObject);

        this.positionAttribLocation=this.gl.getAttribLocation(this.program,'vertPosition');
        this.gl.vertexAttribPointer(
            this.positionAttribLocation,
            elementPerVertex,  //Triangle
            this.gl.FLOAT,
            false,
            elementPerVertex*Float32Array.BYTES_PER_ELEMENT,
            0
        );
        this.gl.enableVertexAttribArray(this.positionAttribLocation);


        this.worldMatrixLocation=this.gl.getUniformLocation(this.program,'mWorld');
        this.viewMatrixLocation=this.gl.getUniformLocation(this.program,'mView');
        this.projMatrixLocation=this.gl.getUniformLocation(this.program,'mProj');

        //Set Colour of the object
        this.objectColourLocation=this.gl.getUniformLocation(this.program,'uPrimitiveColor');
        this.gl.uniform3f(this.objectColourLocation,...this.colour);

        
        //Update Camera according to mouse Position
        mat4.identity(this.worldMatrix);
        mat4.lookAt(this.viewMatrix,[finalX,finalY,finalX+finalY-5],[0,0,0],[0,1,0]);
        mat4.perspective(this.projMatrix,45,this.width/this.height,0.1,1000.0);

        //Here call Update MVP matrix
        this.updateMVPMatrix();
        
        this.gl.uniformMatrix4fv(this.worldMatrixLocation,this.gl.FALSE,this.worldMatrix);
        this.gl.uniformMatrix4fv(this.viewMatrixLocation,this.gl.FALSE,this.viewMatrix);
        this.gl.uniformMatrix4fv(this.projMatrixLocation,this.gl.FALSE,this.projMatrix);

        this.gl.useProgram(this.program);
        this.gl.drawElements(this.gl.TRIANGLES, this.indexAttributesData.length, this.gl.UNSIGNED_SHORT, 0);
    }
};