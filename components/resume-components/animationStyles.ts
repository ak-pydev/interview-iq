// src/styles/animationStyles.ts

export const animationStyles = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

@keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
.animate-shimmer { 
  background: linear-gradient(to right, #f0f4ff 8%, #e0e7ff 18%, #f0f4ff 33%); 
  background-size: 800px 104px; 
  animation: shimmer 1.5s infinite linear; 
}

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

@keyframes thinking { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
.animate-thinking { animation: thinking 1.5s ease-in-out infinite; }

@keyframes ellipsis { 0% { content: '.'; } 33% { content: '..'; } 66% { content: '...'; } 100% { content: '.'; } }
.animate-ellipsis::after { content: '.'; display: inline-block; width: 18px; text-align: left; animation: ellipsis 1.5s infinite; }

@keyframes gradientBg { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.gradient-animate { 
  background: linear-gradient(-45deg, #6366f1, #8b5cf6, #4f46e5, #4338ca); 
  background-size: 400% 400%; 
  animation: gradientBg 15s ease infinite; 
}

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.animate-float { animation: float 3s ease-in-out infinite; }

@keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 3s linear infinite; }

.glass-morphism {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
}

.subtle-shadow {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

.neon-glow {
  box-shadow: 0 0 5px #4f46e5, 0 0 15px #4f46e5, 0 0 20px #4f46e5;
  transition: all 0.3s ease;
}

.neon-text {
  text-shadow: 0 0 5px #4f46e5, 0 0 10px #4f46e5;
}

.tech-border {
  border: 1px solid rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
}

.tech-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
  transform: translateX(-100%);
  animation: borderGlow 2s infinite linear;
}

@keyframes borderGlow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.glitch-effect {
  position: relative;
  color: white;
}

.glitch-effect::before, .glitch-effect::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-effect::before {
  left: 2px;
  text-shadow: -1px 0 #ff00ff;
  animation: glitch-1 2s infinite linear alternate-reverse;
}

.glitch-effect::after {
  left: -2px;
  text-shadow: 2px 0 #00ffff;
  animation: glitch-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-1 {
  0%, 80%, 100% { clip-path: inset(0 0 0 0); }
  20% { clip-path: inset(10% 0 60% 0); }
  40% { clip-path: inset(40% 0 20% 0); }
  60% { clip-path: inset(70% 0 5% 0); }
}

@keyframes glitch-2 {
  0%, 80%, 100% { clip-path: inset(0 0 0 0); }
  20% { clip-path: inset(60% 0 10% 0); }
  40% { clip-path: inset(20% 0 40% 0); }
  60% { clip-path: inset(5% 0 70% 0); }
}

.circuit-lines {
  background-color: #ffffff;
  background-image: 
    radial-gradient(#e0e7ff 1px, transparent 1px),
    linear-gradient(to right, #e0e7ff 1px, transparent 1px),
    linear-gradient(to bottom, #e0e7ff 1px, transparent 1px);
  background-size: 20px 20px;
}

.data-grid {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.scanning-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 10px 3px rgba(99, 102, 241, 0.7);
  animation: scanning 2s ease-in-out infinite;
}

@keyframes scanning {
  0% { left: 0; }
  100% { left: calc(100% - 5px); }
}

.glow-effect {
  position: relative;
}

.glow-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  box-shadow: 0 0 15px 2px rgba(99, 102, 241, 0.6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glow-effect:hover::after {
  opacity: 1;
}

.btn-gradient {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
}

.label-effect {
  display: inline-block;
  position: relative;
  transition: transform 0.3s;
}

.label-effect::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #6366f1;
  transition: width 0.3s ease;
}

.label-effect:hover {
  transform: translateY(-1px);
}

.label-effect:hover::after {
  width: 100%;
}
`;

export default animationStyles;