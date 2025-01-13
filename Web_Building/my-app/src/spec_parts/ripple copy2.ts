// ripple.ts
const MAX_DROPS = 32;
const RIPPLE_FADE_SPEED = 0.1;
const WAVE_INTENSITY = 0.05;

class RippleEffect {
  private drops: Float32Array;
  private currentDrop: number;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private canvas: HTMLCanvasElement;
  private animationFrame: number;
  private bgColorLocation: WebGLUniformLocation;

  constructor(targetElement: HTMLElement) {
    this.drops = new Float32Array(MAX_DROPS * 3);
    this.currentDrop = 0;
    this.initializeDrops();
    this.setupCanvas(targetElement);
    this.setupWebGL();
    this.animate();
  }

  private initializeDrops() {
    for (let i = 0; i < MAX_DROPS * 3; i += 3) {
      this.drops[i] = Math.random();
      this.drops[i + 1] = Math.random();
      this.drops[i + 2] = -100;
    }
  }

  private setupCanvas(targetElement: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0.6';
    targetElement.appendChild(this.canvas);
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      if (this.gl) {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.updateUniforms();
      }
    }
  }

  private setupWebGL() {
    this.gl = this.canvas.getContext('webgl', { 
      premultipliedAlpha: false,
      alpha: true 
    })!;
    
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `);

    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec3 drops[${MAX_DROPS}];
      uniform vec4 backgroundColor; // Add background color uniform
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 ripple = vec2(0.0);
        
        for(int i = 0; i < ${MAX_DROPS}; i++) {
          if(drops[i].z > -90.0) {
            vec2 pos = drops[i].xy;
            float dist = length(uv - pos);
            float wave = sin(dist * 50.0 - drops[i].z * 5.0) * exp(-dist * 8.0);
            ripple += wave * (uv - pos) * 0.5;
          }
        }
        
        // Blend with background color
        gl_FragColor = vec4(ripple * 0.5 + backgroundColor.rgb, backgroundColor.a);
      }
    `);

    this.program = this.createProgram(vertexShader, fragmentShader);
    this.gl.useProgram(this.program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.updateUniforms();
  }

  private createShader(type: number, source: string) {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    return program;
  }

  private updateUniforms() {
    const resolutionLocation = this.gl.getUniformLocation(this.program, 'resolution');
    this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
    this.bgColorLocation = this.gl.getUniformLocation(this.program, 'backgroundColor');
    this.gl.uniform4fv(this.bgColorLocation, [0.1, 0.1, 0.1, 1.0]); // Adjust values to match bg-adaptive-primary
  }

  public addRipple(x: number, y: number) {
    const index = (this.currentDrop % MAX_DROPS) * 3;
    this.drops[index] = x;
    this.drops[index + 1] = y;
    this.drops[index + 2] = 0;
    this.currentDrop++;
  }

  private animate = () => {
    for (let i = 0; i < MAX_DROPS; i++) {
      if (this.drops[i * 3 + 2] > -90) {
        this.drops[i * 3 + 2] += RIPPLE_FADE_SPEED;
      }
    }

    const dropsLocation = this.gl.getUniformLocation(this.program, 'drops');
    this.gl.uniform3fv(dropsLocation, this.drops);

    const timeLocation = this.gl.getUniformLocation(this.program, 'time');
    this.gl.uniform1f(timeLocation, performance.now() / 1000);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  public destroy() {
    cancelAnimationFrame(this.animationFrame);
    this.canvas.remove();
  }
}

export const initRippleEffect = (target: HTMLElement) => {
  const ripple = new RippleEffect(target);
  
  const handleClick = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    ripple.addRipple(x, y);
  };

  target.addEventListener('click', handleClick);

  return () => {
    target.removeEventListener('click', handleClick);
    ripple.destroy();
  };
};