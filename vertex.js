const vertexShaderText=
`
precision mediump float;
attribute vec3 vertPosition;
uniform mat4 mWorld; //Rotate,Translate,Scale Matrix
uniform mat4 mView;  //Camera positioning
uniform mat4 mProj;  //Orthographic or Perspective projection

attribute vec4 aColour;
attribute float aFace;
varying vec4 vColour;

void main()
{
    gl_Position=mProj*mView*mWorld*vec4(vertPosition,1.0);
}
`;
export default vertexShaderText;