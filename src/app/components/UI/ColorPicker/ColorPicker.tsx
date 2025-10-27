import React, { useState } from "react";


type ColorPickerProps = {
  value?: string;
  colors: string[];
  onChange?: (color: string) => void;
};

export default function ColorPicker({ value, onChange, colors }: ColorPickerProps) {
  const [selected, setSelected] = useState(value || colors[0]);

  const handleSelect = (color: string) => {
    setSelected(color);
    onChange?.(color);
  };


  return (
    <div className="mt-4">
      {/* <p className="text-sm font-medium text-gray-600 mb-2">Project Color</p> */}
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => handleSelect(color)}
            className={`w-9 h-9 rounded-xl transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2  duration-150 border-2 ${
              selected === color
                ? "border-black scale-105"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}