export default function RainbowText({ children = "deployment" }) {
  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
  
  return (
    <span style={{
      backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'inherit',
      display: 'inline'
    }}>
      {children}
    </span>
  );
}
