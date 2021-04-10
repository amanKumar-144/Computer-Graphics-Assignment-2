export default class Shader{
    constructor(gl,vertexShaderText,fragmentShaderText)
    {
        this.gl=gl;
        this.vertexShaderText=vertexShaderText;
        this.fragmentShaderText=fragmentShaderText;
    }
    compile()
    {
        this.vertexShader=this.gl.createShader(this.gl.VERTEX_SHADER);
        this.fragmentShader=this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(this.vertexShader,this.vertexShaderText);
        this.gl.shaderSource(this.fragmentShader,this.fragmentShaderText);

        this.gl.compileShader(this.vertexShader);
        if(!this.gl.getShaderParameter(this.vertexShader,this.gl.COMPILE_STATUS))
        {
            console.log("Error compiling vertexShader ",this.gl.getShaderInfoLog(this.vertexShader));
        }
        this.gl.compileShader(this.fragmentShader);
        if(!this.gl.getShaderParameter(this.fragmentShader,this.gl.COMPILE_STATUS))
        {
            console.log("Error compiling fragmentShader ",this.gl.getShaderInfoLog(this.fragmentShader));
        }   
    }
    link()
    {
        this.program=this.gl.createProgram();
        this.gl.attachShader(this.program,this.vertexShader);
        this.gl.attachShader(this.program,this.fragmentShader);

        
        this.gl.linkProgram(this.program);
        if(!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS))
        {
            console.log("Error linking the program ",this.gl.getProgramInfoLog(this.program));
        }


        this.gl.validateProgram(this.program);
        if(!this.gl.getProgramParameter(this.program,this.gl.VALIDATE_STATUS))
        {
            console.log("Error validating the program ",this.gl.getProgramInfoLog(this.program));
        }
    }
}