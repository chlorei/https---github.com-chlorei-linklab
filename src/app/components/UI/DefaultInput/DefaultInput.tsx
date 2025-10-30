
type DefaultInputProps = {
    name: string;
    type: string;
    value: string;
    placeholder?: string;
    autoComplete?: string;
}

const DefaultInput = ({ name, type, value, placeholder, autoComplete }: DefaultInputProps) => {
  return (
    <input      
                onChange={() => console.log("")}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="h-11 w-7/8 mt-2 rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
  )
}

export default DefaultInput
