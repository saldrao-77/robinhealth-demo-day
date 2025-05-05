"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "./navigation"
import { X, Menu, Globe } from "lucide-react"

// Add a language state to the component
export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)

  // Add a function to toggle the language menu
  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen)
  }

  // Add a function to change the language
  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    setLanguageMenuOpen(false)
    // Store the language preference in localStorage
    localStorage.setItem("preferredLanguage", lang)
    // Dispatch a custom event to notify other components about the language change
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: lang } }))
  }

  // Load the preferred language from localStorage on component mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("preferredLanguage")
    if (storedLanguage) {
      setLanguage(storedLanguage)
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: storedLanguage } }))
    }
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="w-full py-3 px-4 md:px-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-t9xVCLE1ALaEOVUgFWf00VNut8yuxB.png"
            alt="Robin Health Logo"
            width={400}
            height={140}
            className="h-20 w-auto rounded-2xl"
          />
        </Link>
      </div>
      <div className="hidden md:flex items-center">
        <Navigation color="dark" language={language} />

        {/* Language Selector - Always visible */}
        <div className="relative ml-6">
          <button
            onClick={toggleLanguageMenu}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium p-2 rounded-md hover:bg-gray-100"
            aria-label={language === "en" ? "Change language" : "Cambiar idioma"}
          >
            <Globe size={18} />
            <span>{language === "en" ? "English" : "Español"}</span>
          </button>

          {languageMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <button
                onClick={() => changeLanguage("en")}
                className={`block w-full text-left px-4 py-2 text-sm ${language === "en" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage("es")}
                className={`block w-full text-left px-4 py-2 text-sm ${language === "es" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
              >
                Español
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden flex items-center">
        {/* Mobile Language Selector - Always visible */}
        <button
          onClick={toggleLanguageMenu}
          className="mr-2 text-gray-700 p-2 rounded-md hover:bg-gray-100"
          aria-label={language === "en" ? "Change language" : "Cambiar idioma"}
        >
          <Globe size={20} />
        </button>

        <button
          className="text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Language Menu (Mobile) */}
      {languageMenuOpen && (
        <div className="fixed top-[76px] left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-100 md:hidden">
          <div className="py-2 px-6">
            <button
              onClick={() => changeLanguage("en")}
              className={`block w-full text-left py-3 ${language === "en" ? "text-blue-600 font-medium" : "text-gray-800"}`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("es")}
              className={`block w-full text-left py-3 ${language === "es" ? "text-blue-600 font-medium" : "text-gray-800"}`}
            >
              Español
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[76px] left-0 right-0 bg-white shadow-lg md:hidden z-50 border-t border-gray-100">
          <div className="py-4 px-6">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-800 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "en" ? "Home" : "Inicio"}
              </Link>
              <Link
                href="/about"
                className="text-gray-800 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "en" ? "About Us" : "Sobre Nosotros"}
              </Link>
              <Link
                href="/faq"
                className="text-gray-800 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "en" ? "FAQ" : "Preguntas Frecuentes"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
