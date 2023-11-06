// 分数布朗运动（Fractional Brownian Motion）流体波动效果着色器
// 为了大致和 Apple Music 的背景效果一致而做了修改
// 参考自 https://www.shadertoy.com/view/tdG3Rd

precision highp float;
uniform float time;// 着色器开始运行到现在的时间，单位秒
uniform vec2 resolution;// 绘制画板的大小，单位像素
uniform sampler2D albumColorMap;// 从专辑图片中取色得出的特征色表图
// uniform vec2 albumColorMapRes;// 特征色表图的分辨率，单位像素
// uniform sampler2D albumImage;// 专辑图片，会被裁剪成正方形
// uniform vec2 albumImageRes;// 专辑图片的大小，单位像素

vec3 rgb2hsv(vec3 c)
{
  vec4 K=vec4(0.,-1./3.,2./3.,-1.);
  vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));
  vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));
  
  float d=q.x-min(q.w,q.y);
  float e=1.e-10;
  return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);
}

// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
const vec4 hsv2rgb_K=vec4(1.,2./3.,1./3.,3.);
vec3 hsv2rgb(vec3 c){
  vec3 p=abs(fract(c.xxx+hsv2rgb_K.xyz)*6.-hsv2rgb_K.www);
  return c.z*mix(hsv2rgb_K.xxx,clamp(p-hsv2rgb_K.xxx,0.,1.),c.y);
}

float rand(vec2 n){
  return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);
}

float noise(vec2 p){
  vec2 ip=floor(p);
  vec2 u=fract(p);
  u=u*u*(3.-2.*u);
  
  float res=mix(mix(rand(ip),rand(ip+vec2(1.,0.)),u.x),mix(rand(ip+vec2(0.,1.)),rand(ip+vec2(1.,1.)),u.x),u.y);
  return res*res;
}

float fbm(vec2 p){
  float f=0.;
  
  f+=.148000*noise(p)+time*.0137;
  f+=.125000*sin(p.x*5.)-sin(time*.1)*.1-p.y;
  
  return f/.96875;
}

float pattern(in vec2 p){
  return fbm(p+fbm(p+fbm(p)));
}

void main(){
  vec2 uv=gl_FragCoord.xy/resolution.x;
  float shade=pattern(uv)/2.;
  vec3 color=texture2D(albumColorMap,vec2(shade,shade*.27),16.).rgb;
  
  color=rgb2hsv(color);
  
  color.z=clamp(color.z,0.,.6);
  
  color=hsv2rgb(color);
  
  // gl_FragColor=vec4(1.,0.,0.,1.);
  gl_FragColor=vec4(color.rgb,1.);
}