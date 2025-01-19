import { Power } from "lucide-react";

function SlidingToggle({ isOn, isAvailable }) {
    return (
        <div className="flex items-center gap-3">
          <div
            className={`relative h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none ${
              isAvailable ? (
                  isOn ? "bg-fuchsia-600" : "bg-gray-300"
              ) : "bg-gray-100"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ${
                isAvailable ? (
                    isOn ? "translate-x-6" : "translate-x-0"
                ) : "bg-gray-100"
              }`}
            >
              <Power className={`h-3 w-3 ${isAvailable ? "text-gray-500" : "text-gray-300"}`} />
            </span>
          </div>
        </div>
    );
};

export default SlidingToggle;