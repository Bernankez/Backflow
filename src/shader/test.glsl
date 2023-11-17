
uniform vec3 iResolution;// viewport resolution (in pixels)
uniform float iTime;// shader playback time (in seconds)

float colormap_red(float x){
  if(x<0.){
    return 54./255.;
  }else if(x<20049./82979.){
    return(829.79*x+54.51)/255.;
  }else{
    return 1.;
  }
}

float colormap_green(float x){
  if(x<20049./82979.){
    return 0.;
  }else if(x<327013./810990.){
    return(8546482679670./10875673217.*x-2064961390770./10875673217.)/255.;
  }else if(x<=1.){
    return(103806720./483977.*x+19607415./483977.)/255.;
  }else{
    return 1.;
  }
}

float colormap_blue(float x){
  if(x<0.){
    return 54./255.;
  }else if(x<7249./82979.){
    return(829.79*x+54.51)/255.;
  }else if(x<20049./82979.){
    return 127./255.;
  }else if(x<327013./810990.){
    return(792.02249341361393720147485376583*x-64.364790735602331034989206222672)/255.;
  }else{
    return 1.;
  }
}

vec4 colormap(float x){
  return vec4(colormap_red(x),colormap_green(x),colormap_blue(x),1.);
}

// https://iquilezles.org/articles/warp
/*float noise( in vec2 x )
{
  vec2 p = floor(x);
  vec2 f = fract(x);
  f = f*f*(3.0-2.0*f);
  float a = textureLod(iChannel0,(p+vec2(0.5,0.5))/256.0,0.0).x;
  float b = textureLod(iChannel0,(p+vec2(1.5,0.5))/256.0,0.0).x;
  float c = textureLod(iChannel0,(p+vec2(0.5,1.5))/256.0,0.0).x;
  float d = textureLod(iChannel0,(p+vec2(1.5,1.5))/256.0,0.0).x;
  return mix(mix( a, b,f.x), mix( c, d,f.x),f.y);
}*/


float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u*u*(3.0-2.0*u);
  
  float res = mix(
    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
  return res*res;
}
  
const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

float fbm( vec2 p ){
  float f = 0.0;
  
  f += 0.500000*noise( p + iTime  ); p = mtx*p*2.02;
  f += 0.031250*noise( p ); p = mtx*p*2.01;
  f += 0.250000*noise( p ); p = mtx*p*2.03;
  f += 0.125000*noise( p ); p = mtx*p*2.01;
  f += 0.062500*noise( p ); p = mtx*p*2.04;
  f += 0.015625*noise( p + sin(iTime) );
  
  return f/0.96875;
}

float pattern( in vec2 p ){
  return fbm( p + fbm( p + fbm( p ) ) );
}

void main( ){
  vec2 uv = gl_FragCoord.xy/iResolution.x;
  float shade = pattern(uv);
  gl_FragColor = vec4(colormap(shade).rgb, shade);
}

/** SHADERDATA
{
  "title": "Base warp fBM",
  "description": "Noise but Pink",
  "model": "person"
}
*/