import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
export default class Cube
{
    constructor(gl,program,canvas)
    {
        this.gl=gl;
        this.program=program;

        this.width=canvas.width;
        this.height=canvas.height;

        this.x0=-0.5;
        this.y0=0.5;
        this.z0=0.5;

        this.x1=0.5;
        this.y1=0.5;
        this.z1=0.5;

        this.x2=0.5;
        this.y2=0.5;
        this.z2=-0.5;

        this.x3=-0.5;
        this.y3=0.5;
        this.z3=-0.5;

        this.x4=-0.5;
        this.y4=-0.5;
        this.z4=0.5;

        this.x5=0.5;
        this.y5=-0.5;
        this.z5=0.5;

        this.x6=0.5;
        this.y6=-0.5;
        this.z6=-0.5;

        this.x7=-0.5;
        this.y7=-0.5;
        this.z7=-0.5;

        this.xRotation=new Float32Array(16);
        this.yRotation=new Float32Array(16);
        this.identity=new Float32Array(16);

        mat4.identity(this.xRotation);
        mat4.identity(this.yRotation);
        mat4.identity(this.identity);


        this.vertexAttributesData= new Float32Array([

            //X,Y,Z
            this.x0,this.y0,this.z0,
            this.x1,this.y1,this.z1,
            this.x2,this.y2,this.z2,
            this.x3,this.y3,this.z3,

            this.x4,this.y4,this.z4,
            this.x5,this.y5,this.z5,
            this.x6,this.y6,this.z6,
            this.x7,this.y7,this.z7,            
        ]);
        this.indexAttributesData = new Uint16Array([

            //Top
            0,1,2,
            0,2,3,

            //Left
            0,7,3,
            0,4,7,

            //Back
            3,7,6,
            3,6,2,

            //Right
            1,6,2,
            1,5,6,

            //Front
            0,4,5,
            0,5,1,

            //Down
            4,5,7,
            5,6,7

        ]);
        this.triangleVertexBufferObject=this.gl.createBuffer();
        this.triangleIndexBufferObject=this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.triangleVertexBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.vertexAttributesData,this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.triangleIndexBufferObject);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,this.indexAttributesData,this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);
       

        this.colourAttributesData=new Float32Array([
            1.0,0.0,0.0,//0
            1.0,0.0,0.0,//1
            1.0,0.0,0.0,//2
            0.0,1.0,0.0,//3
            0.0,1.0,0.0,//4
            0.0,0.0,1.0,//5
            0.0,0.0,1.0,//6
            0.0,0.0,1.0,//7
        ]);
        
        this.colourVertexBufferObject=this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.colourVertexBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.colourAttributesData,this.gl.STATIC_DRAW);
       

        if(!this.triangleVertexBufferObject)
        {
            console.log("Buffer Cannot be allocated for vertex");
        }
        if(!this.triangleIndexBufferObject)
        {
            console.log("Buffer Cannot be allocated for index");
        }
        if(!this.colourVertexBufferObject)
        {
            console.log("Buffer Cannot be allocated for colour vertex");
        }
    }

    drawShape(angle,finalX,finalY)
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.triangleVertexBufferObject);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.triangleIndexBufferObject);
        this.positionAttribLocation=this.gl.getAttribLocation(this.program,'vertPosition');
        this.gl.vertexAttribPointer(
            this.positionAttribLocation,
            3,
            this.gl.FLOAT,
            false,
            3*Float32Array.BYTES_PER_ELEMENT,
            0
        );
        this.gl.enableVertexAttribArray(this.positionAttribLocation);



        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);
        



        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.colourVertexBufferObject);
        this.colourAttribLocation=this.gl.getAttribLocation(this.program,'vertColour');
        this.gl.vertexAttribPointer(
            this.colourAttribLocation,
            3,
            this.gl.FLOAT,
            false,
            3*Float32Array.BYTES_PER_ELEMENT,
            0
        );
        this.gl.enableVertexAttribArray(this.colourAttribLocation);

        

        this.worldMatrixLocation=this.gl.getUniformLocation(this.program,'mWorld');
        this.viewMatrixLocation=this.gl.getUniformLocation(this.program,'mView');
        this.projMatrixLocation=this.gl.getUniformLocation(this.program,'mProj');

        this.worldMatrix=new Float32Array(16);
        this.viewMatrix=new Float32Array(16);
        this.projMatrix=new Float32Array(16);

        mat4.identity(this.worldMatrix);
        mat4.lookAt(this.viewMatrix,[finalX,finalY,5],[0,0,0],[0,1,0]);
        mat4.perspective(this.projMatrix,45,this.width/this.height,0.1,1000.0);


        mat4.identity(this.xRotation);
        mat4.identity(this.yRotation);
        mat4.rotate(this.yRotation,this.yRotation,angle/5,[0,1,0]);
        mat4.rotate(this.xRotation,this.xRotation,angle,[1,0,0]);
        mat4.mul(this.worldMatrix,this.xRotation,this.yRotation);

        this.gl.uniformMatrix4fv(this.worldMatrixLocation,this.gl.FALSE,this.worldMatrix);
        this.gl.uniformMatrix4fv(this.viewMatrixLocation,this.gl.FALSE,this.viewMatrix);
        this.gl.uniformMatrix4fv(this.projMatrixLocation,this.gl.FALSE,this.projMatrix);

        this.gl.useProgram(this.program);
        this.gl.drawElements(this.gl.TRIANGLES, this.indexAttributesData.length, this.gl.UNSIGNED_SHORT, 0);
    }
};