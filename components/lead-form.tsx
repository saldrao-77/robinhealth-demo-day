"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { submitLeadForm } from "@/app/actions/submit-form"
import { X } from "lucide-react"

// Fallback function to save form data locally if database fails
const saveSubmissionLocally = (data: any) => {
  try {
    // Get existing submissions or initialize empty array
    const existingSubmissions = JSON.parse(localStorage.getItem("leadSubmissions") || "[]")

    // Add new submission with timestamp
    existingSubmissions.push({
      ...data,
      submittedAt: new Date().toISOString(),
    })

    // Save back to localStorage
    localStorage.setItem("leadSubmissions", JSON.stringify(existingSubmissions))
    return true
  } catch (error) {
    console.error("Error saving submission locally:", error)
    return false
  }
}

export function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [showThankYouPopup, setShowThankYouPopup] = useState(false)
  const [phoneValue, setPhoneValue] = useState("")
  const [language, setLanguage] = useState("en")
  const phoneNumber = "2625018982"

  // Listen for language changes
  useEffect(() => {
    // Check for stored language preference
    const storedLanguage = localStorage.getItem("preferredLanguage")
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }

    // Listen for language change events
    const handleLanguageChange = (event: any) => {
      setLanguage(event.detail.language)
    }

    window.addEventListener("languageChange", handleLanguageChange)

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange)
    }
  }, [])

  // Function to format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Format the phone number as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
  }

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    setPhoneValue(formattedValue)
  }

  // Function to show the thank you popup with a different URL for tracking
  const showThankYou = () => {
    setShowThankYouPopup(true)
    // Update URL without full page reload for tracking purposes
    window.history.pushState({}, "", window.location.pathname + "?submitted=true")
  }

  // Function to close the thank you popup and restore original URL
  const closeThankYou = () => {
    setShowThankYouPopup(false)
    window.history.pushState({}, "", window.location.pathname)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const form = e.currentTarget
    const formElement = form as HTMLFormElement

    // Get raw phone value (without formatting) for database
    const rawPhone = phoneValue.replace(/\D/g, "")

    // Prepare submission data
    const submissionData = {
      zipCode: formElement.zipcode.value,
      phone: rawPhone,
      imagingType: formElement.imaging.value,
      bodyPart: showAdditionalFields ? formElement.bodyPart.value : undefined,
      hasOrder: showAdditionalFields ? formElement.doctorOrder.value === "yes" : undefined,
      fullName: showAdditionalFields ? formElement.fullName.value : undefined,
      headers: {
        referer: window.location.href,
      },
    }

    try {
      // Try to submit to database
      const result = await submitLeadForm(submissionData)

      if (result.success) {
        // Success - show thank you popup
        form.reset()
        setPhoneValue("")
        setShowAdditionalFields(false)
        showThankYou()
      } else {
        // Database error - try local storage fallback
        console.log("Database submission failed:", result.debug || result.message)
        const savedLocally = saveSubmissionLocally(submissionData)

        if (savedLocally) {
          // Local storage fallback worked - still show success to user
          console.log("Saved to local storage as fallback")
          form.reset()
          setPhoneValue("")
          setShowAdditionalFields(false)
          showThankYou()
        } else {
          // Both database and local storage failed
          setMessage({
            type: "error",
            text:
              language === "en"
                ? "Unable to submit form. Please try again or contact us directly."
                : "No se pudo enviar el formulario. Inténtelo de nuevo o contáctenos directamente.",
          })
        }
      }
    } catch (error) {
      console.error("Form submission error:", error)

      // Try local storage fallback
      const savedLocally = saveSubmissionLocally(submissionData)

      if (savedLocally) {
        // Local storage fallback worked - still show success to user
        console.log("Saved to local storage after error")
        form.reset()
        setPhoneValue("")
        setShowAdditionalFields(false)
        showThankYou()
      } else {
        setMessage({
          type: "error",
          text:
            language === "en"
              ? "An unexpected error occurred. Please try again or contact us directly."
              : "Ocurrió un error inesperado. Inténtelo de nuevo. Inténtelo de nuevo o contáctenos directamente.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white/90 rounded-lg p-4 md:p-6 shadow-lg">
      <h2 className="text-center text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
        {language === "en" ? (
          <>
            Tired of overpriced scans and endless wait times? We'll find you an affordable, high-quality MRIs, CTs, and
            more near you — fast. You'll only pay our{" "}
            <span className="font-bold text-blue-600 relative inline-block">
              <span className="relative z-10">$25 booking fee</span>
              <span className="absolute inset-0 bg-blue-100 rounded-md -z-0 transform -rotate-1"></span>
            </span>{" "}
            once your appointment is confirmed — and if we don't save you at least $100, it's on us.
          </>
        ) : (
          <>
            ¿Cansado de escaneos caros y tiempos de espera interminables? Te encontraremos resonancias magnéticas,
            tomografías computarizadas y más asequibles y de alta calidad cerca de ti, rápidamente. Solo pagarás nuestra{" "}
            <span className="font-bold text-blue-600 relative inline-block">
              <span className="relative z-10">tarifa de reserva de $25</span>
              <span className="absolute inset-0 bg-blue-100 rounded-md -z-0 transform -rotate-1"></span>
            </span>{" "}
            una vez que se confirme tu cita, y si no te ahorramos al menos $100, corre por nuestra cuenta.
          </>
        )}
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div>
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
            {language === "en" ? "Zip code" : "Código postal"}
          </label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === "en" ? "Enter your zip code" : "Ingresa tu código postal"}
            required
            maxLength={5}
            pattern="[0-9]{5}"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-70"
        >
          {isSubmitting
            ? language === "en"
              ? "Submitting..."
              : "Enviando..."
            : language === "en"
              ? "Get affordable scan quotes now"
              : "Obtén cotizaciones asequibles ahora"}
        </button>

        <div className="text-center my-2">
          <span className="text-gray-500 text-sm">— OR —</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <a
            href={`tel:${phoneNumber}`}
            className="py-3 px-4 bg-white border border-blue-600 text-blue-600 font-medium rounded-md transition-colors hover:bg-blue-50 text-center"
          >
            {language === "en" ? "Call us" : "Llámanos"}
          </a>
          <a
            href={`sms:${phoneNumber}`}
            className="py-3 px-4 bg-white border border-blue-600 text-blue-600 font-medium rounded-md transition-colors hover:bg-blue-50 text-center"
          >
            {language === "en" ? "Text us" : "Envíanos un mensaje"}
          </a>
        </div>
      </form>

      {/* Thank You Popup */}
      {showThankYouPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">{language === "en" ? "Thank You!" : "¡Gracias!"}</h3>
              <button
                onClick={closeThankYou}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2">{language === "en" ? "Thank You!" : "¡Gracias!"}</h4>
                <p className="text-gray-600">
                  {language === "en" ? "We have received your form." : "Hemos recibido tu formulario."}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-blue-800 text-sm">
                  {language === "en"
                    ? "Our care coordination will kick off on pulling scan prices near you now! We'll call or text you shortly to confirm a few quick details. Hang tight!"
                    : "¡Nuestra coordinación de atención comenzará a buscar precios de escaneo cerca de ti ahora! Te enviaremos un mensaje de texto en breve para confirmar algunos detalles rápidos. ¡Espera un momento!"}
                </p>
              </div>
              <button
                onClick={closeThankYou}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                {language === "en" ? "Return to Homepage" : "Volver a la página principal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
