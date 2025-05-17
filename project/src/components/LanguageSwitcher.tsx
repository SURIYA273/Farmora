import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const languages = [
    { code: "en", label: "English" },
    { code: "ml", label: "മലയാളം" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "te", label: "తెలుగు" },
    { code: "ta", label: "தமிழ்" },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleTouchOutside = (event: TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-black" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full cursor-pointer shadow-sm hover:border-green-400 touch-manipulation"
      >
        <Globe className="h-5 w-5 text-gray-600" />
        <span className="font-medium">
          {languages.find((lang) => lang.code === i18n.language)?.label || "Select Language"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 right-0 bg-white shadow-lg rounded-lg w-44 border border-gray-200 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center px-4 py-3 text-sm w-full text-left hover:bg-gray-100 touch-manipulation"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}