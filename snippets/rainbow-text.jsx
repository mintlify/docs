export const RainbowText = ({ children }) => {
  const text = children || "";
  const colors = [
    "#FF0000", // Red
    "#FF7F00", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#4B0082", // Indigo
    "#9400D3"  // Violet
  ];
  
  const letters = text.split("");
  
  return (
    <span style={{ display: "inline" }}>
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            color: colors[index % colors.length],
            fontWeight: "500"
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};
