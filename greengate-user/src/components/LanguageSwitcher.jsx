// src/components/LanguageSwitcher.jsx
import { useState, useEffect, useRef } from "react"; 
import i18n from "../i18n";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");
  const switcherRef = useRef(null); 

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
    setOpen(false);
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  const currentLang = languages.find((l) => l.code === selectedLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="lang-switcher" ref={switcherRef}>
      <button
        className={`lang-icon-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className="globe-icon">🌍</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lang-menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {languages.map((lang) => (
              <motion.div
                key={lang.code}
                className={`lang-option ${selectedLang === lang.code ? "active" : ""}`}
                onClick={() => changeLang(lang.code)}
                whileHover={{ x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="lang-name">{lang.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}