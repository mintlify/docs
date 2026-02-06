export const Rainbow = ({ children }) => {
  const text = typeof children === 'string' ? children : String(children);
  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
  
  return (
    <span style={{ display: 'inline' }}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            color: colors[index % colors.length],
            display: 'inline',
            fontWeight: '500'
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};
