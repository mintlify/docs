export const RainbowText = ({ children }) => {
  return (
    <span
      style={{
        background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'inherit',
      }}
    >
      {children}
    </span>
  )
}
