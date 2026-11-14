import { useEffect, useId, useState } from "react";
import { Dithering } from "@paper-design/shaders-react";

const palettes = [
  { name: "Mint", back: "#0b1f14", front: "#26BD6C" },
  { name: "Violet", back: "#10091f", front: "#d9c6ff" },
  { name: "Ember", back: "#1f0d06", front: "#ffb37a" },
];

const shapes = ["sphere", "warp", "ripple", "swirl"];

const control = {
  font: "inherit",
  fontSize: 13,
  padding: "4px 10px",
  borderRadius: 6,
  border: "1px solid rgba(127, 127, 127, 0.4)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};

export const DitheringExample = () => {
  const shapeId = useId();
  const [palette, setPalette] = useState(palettes[0]);
  const [shape, setShape] = useState("sphere");
  const [size, setSize] = useState(3);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
    }
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Dithering
        width="100%"
        height={320}
        speed={paused ? 0 : 0.4}
        scale={0.6}
        maxPixelCount={2000000}
        colorBack={palette.back}
        colorFront={palette.front}
        shape={shape}
        type="4x4"
        size={size}
        style={{ borderRadius: 12, overflow: "hidden", backgroundColor: palette.back }}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
          marginBottom: 16,
          fontSize: 13,
        }}
      >
        {palettes.map((p) => (
          <button
            key={p.name}
            type="button"
            aria-pressed={palette.name === p.name}
            onClick={() => setPalette(p)}
            style={{
              ...control,
              borderColor: palette.name === p.name ? p.front : "rgba(127, 127, 127, 0.4)",
            }}
          >
            {p.name}
          </button>
        ))}
        <label htmlFor={shapeId} style={{ marginLeft: 8 }}>
          Shape
        </label>
        <select
          id={shapeId}
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          style={control}
        >
          {shapes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
          Pixel size
          <input
            type="range"
            min={1}
            max={8}
            value={size}
            style={{ accentColor: palette.front }}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </label>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          style={{ ...control, marginLeft: "auto" }}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
};
