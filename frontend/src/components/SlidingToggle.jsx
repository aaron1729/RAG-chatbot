import { Power } from "lucide-react";

function SlidingToggle({ isOn }) {
    return (
        <div className="flex items-center gap-3">
          <button
            className={`relative h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${
              isOn ? "bg-fuchsia-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ${
                isOn ? "translate-x-6" : "translate-x-0"
              }`}
            >
              <Power className="h-3 w-3 text-gray-400" />
            </span>
          </button>
        </div>
    );
};

export default SlidingToggle;