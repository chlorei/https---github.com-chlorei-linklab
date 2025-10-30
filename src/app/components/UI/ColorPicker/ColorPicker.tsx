const ColorSwitcher = ({
  value,
  onChange,
  colors,
}: {
  value: string; onChange: (c: string) => void; colors: string[];
}) => (
  <div className="grid grid-cols-5 gap-2">
    {colors.map((hex) => (
      <button
        key={hex}
        type="button"
        onClick={() => onChange(hex)}
        title={hex}
        className={`h-10 w-10 rounded-2xl border transition ring-offset-2 focus:outline-none focus:ring-2 focus:ring-black/60 ${
          value === hex ? "ring-2 ring-black/60" : ""
        }`}
        style={{ backgroundColor: hex }}
      />
    ))}
  </div>
);

export default ColorSwitcher