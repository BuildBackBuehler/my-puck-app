import '@/utils/styles/ripple.css';
import Link from 'next/link';

export const createRipple = (event: React.MouseEvent) => {
  const button = event.currentTarget;
  const ripple = document.createElement('div');
  const rect = button.getBoundingClientRect();
  
  ripple.className = 'ripple';
  button.appendChild(ripple);
  
  const wave = document.createElement('div');
  wave.className = 'rippleWave';
  
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  wave.style.left = `${x}px`;
  wave.style.top = `${y}px`;
  
  ripple.appendChild(wave);
  
  wave.addEventListener('animationend', () => {
    ripple.remove();
  });
};