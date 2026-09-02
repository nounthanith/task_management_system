"use client";

type ToggleProps = {
    on: boolean;
    onChange: (value: boolean) => void;
};

export default function Toggle({ on, onChange }: ToggleProps) {
    return (
        <button
            type="button"
            onClick={() => onChange(!on)}
            className={`relative w-12 h-7 rounded-full p-1 transition-colors duration-300 ${
                on ? "bg-gradient-to-r from-orange-500 to-orange-400" : "bg-neutral-300"
            }`}
            aria-pressed={on}
        >
            <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    on ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </button>
    );
}