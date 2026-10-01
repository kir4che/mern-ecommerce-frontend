import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

const DEFAULT_OPTIONS = [
  "牛奶",
  "蛋",
  "花生",
  "堅果",
  "大豆",
  "麩質",
  "芝麻",
  "海鮮",
];

interface AllergenPickerProps {
  value: string[];
  onChange: (allergens: string[]) => void;
  options?: string[];
}

const AllergenPicker = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: AllergenPickerProps) => {
  const [inputVal, setInputVal] = useState("");
  const [msg, setMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);

  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(id);
  }, [msg]);

  const addCustom = () => {
    const val = inputVal.trim();
    if (!val) {
      setMsg("請輸入過敏原名稱");
      return;
    }
    if (value.includes(val)) {
      setMsg(`「${val}」已存在`);
      return;
    }
    onChange([...value, val]);
    setInputVal("");
    inputRef.current?.focus();
  };

  const toggle = (a: string) => {
    onChange(value.includes(a) ? value.filter((x) => x !== a) : [...value, a]);
  };

  const customAllergens = value.filter((a) => !options.includes(a));

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        過敏原
      </label>
      <div className="mb-3 flex flex-wrap gap-2">
        {options.map((a) => (
          <Button
            key={a}
            onClick={() => toggle(a)}
            className={[
              "h-auto min-h-0 rounded-full border px-3 py-1.5 text-sm font-normal",
              value.includes(a)
                ? "border-none bg-primary text-white"
                : "border-gray-300 bg-white text-gray-600 hover:border-primary",
            ].join(" ")}
          >
            {a}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="輸入自訂過敏原，按 Enter 新增。"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          onCompositionStart={() => {
            isComposing.current = true;
          }}
          onCompositionEnd={() => {
            isComposing.current = false;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing.current) {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <Button variant="secondary" onClick={addCustom}>
          新增
        </Button>
      </div>
      {msg && <p className="mt-1 text-xs text-red-500">{msg}</p>}
      {customAllergens.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {customAllergens.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-600"
            >
              {a}
              <Button
                variant="icon"
                onClick={() => onChange(value.filter((x) => x !== a))}
                className="h-auto text-base text-red-600 hover:text-red-700"
              >
                ×
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllergenPicker;
