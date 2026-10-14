import colorMap from "@/app/utils/colorMap";

const ColorPicker = ({
  value,
  onChange,
  colors,
  name = "Project color",
}: {
  value: string;
  onChange: (c: string) => void;
  colors: (keyof typeof colorMap)[];
  name?: string;
}) => (
  <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
    {colors.map((color) => {
      const selected = value === color;
      return (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={selected}
          aria-label={color}
          title={color}
          onClick={() => onChange(color)}
          className={`size-8 rounded-full border border-black/10 transition-shadow ${
            selected ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : "hover:ring-2 hover:ring-line-strong hover:ring-offset-2 hover:ring-offset-surface"
          }`}
          style={{ backgroundColor: colorMap[color].mainColor }}
        />
      );
    })}
  </div>
);

export default ColorPicker;
