import React from "react";

interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  labelSuffix?: string | React.ReactNode;
  markers?: string[];
}

const SliderInput: React.FC<SliderInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  labelSuffix,
  markers,
}) => {
  const getSliderBackground = (value: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #4ade80 ${percentage}%, #e5e7eb ${percentage}%)`;
  };

  return (
    <div>
      <label
        htmlFor={label.toLowerCase().replace(/ /g, "-")}
        className="block text-lg font-bold text-black mb-2"
      >
        {label}: {labelSuffix}
      </label>
      <div className="relative">
        <input
          type="range"
          id={label.toLowerCase().replace(/ /g, "-")}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: getSliderBackground(value),
          }}
        />
        {markers && (
          <div className="flex justify-between text-xs text-gray-600 px-1 mt-2">
            {markers.map((marker, index) => (
              <span key={index}>{marker}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderInput;
