export const RainbowText = ({ children }) => {
  return (
    <span
      style={{
        background: 'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0080)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'inherit',
        display: 'inline'
      }}
    >
      {children}
    </span>
  )
}
