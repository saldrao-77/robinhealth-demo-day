"use client"

import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Shield, Clock, CheckCircle, Globe } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ChatPopup } from "@/components/chat-popup"
import { SiteFooter } from "@/components/site-footer"
import { LeadForm } from "@/components/lead-form"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Home() {
  const [showChatButton, setShowChatButton] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const phoneNumber = "2625018982"
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState("en")

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Show chat button after scrolling a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowChatButton(true)
      } else {
        setShowChatButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Function to scroll to a specific testimonial
  const scrollToTestimonial = (index: number) => {
    const testimonialContainer = document.getElementById("testimonial-carousel")
    if (testimonialContainer) {
      const testimonialWidth = testimonialContainer.scrollWidth / 3
      testimonialContainer.scrollTo({
        left: testimonialWidth * index,
        behavior: "smooth",
      })
      setActiveTestimonial(index)
    }
  }

  // Testimonials data
  const testimonials = [
    {
      name: "Judy",
      location: "Austin, Texas",
      image: "/images/judy-new.png",
      quote:
        "After my doctor ordered an MRI, I was shocked at the $3,200 quote. Robin Health found me the exact same scan for $450! The process was simple, and I got my results the next day.",
    },
    {
      name: "Linda",
      location: "Dallas, Texas",
      image: "/images/linda-new.png",
      quote:
        "I was nervous about paying cash for my scan, but Robin Health made the entire process so transparent and easy. They found me a high-quality imaging center at a fraction of what my insurance would have charged. The care team was incredibly helpful and responsive throughout the entire process.",
    },
    {
      name: "Dave",
      location: "Houston, Texas",
      image: "/images/dave-new.png",
      quote:
        "My insurance denied my CT scan authorization twice. Robin Health helped me bypass the whole mess with a cash-pay option that was actually cheaper than my deductible would have been!",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - now sticky */}
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
              onClick={() => {
                const newLang = language === "en" ? "es" : "en"
                localStorage.setItem("preferredLanguage", newLang)
                setLanguage(newLang)
                window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: newLang } }))
              }}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium p-2 rounded-md hover:bg-gray-100"
              aria-label={language === "en" ? "Change language" : "Cambiar idioma"}
            >
              <Globe size={18} />
              <span>{language === "en" ? "English" : "Español"}</span>
            </button>
          </div>
        </div>
        <div className="md:hidden flex items-center">
          {/* Mobile Language Selector - Always visible */}
          <button
            onClick={() => {
              const newLang = language === "en" ? "es" : "en"
              localStorage.setItem("preferredLanguage", newLang)
              setLanguage(newLang)
              window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: newLang } }))
            }}
            className="mr-2 text-gray-700 p-2 rounded-md hover:bg-gray-100"
            aria-label={language === "en" ? "Change language" : "Cambiar idioma"}
          >
            <Globe size={20} />
          </button>

          <button
            className="text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

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
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-800 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-800 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section - adjusted padding for sticky header */}
        <section className="relative pt-10 md:pt-20" id="hero" ref={heroRef}>
          <div className="absolute inset-0">
            {isMobile ? (
              <div className="absolute inset-0 bg-navy-900 bg-[#0a2351]"></div>
            ) : (
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unsplash-image-T-iifFLk3KU.jpg-MCzSDAVYIcHIChxyJdEAeOAKvTI6XC.jpeg"
                alt="Medical professional reviewing scan"
                fill
                className="object-cover brightness-[0.65]"
                priority
              />
            )}
          </div>
          <div className="relative grid md:grid-cols-2 gap-4 md:gap-8 px-4 md:px-6 py-12 md:py-16 max-w-7xl mx-auto min-h-[500px]">
            <div className="flex flex-col justify-center text-white">
              <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4">
                MRIs and CTs shouldn't cost $4,000 or take 6 weeks to schedule
              </h1>
            </div>
            <div className="bg-white/90 rounded-lg p-4 md:p-6 shadow-lg">
              <LeadForm />
            </div>
          </div>
        </section>

        {/* Stats Section - White background */}
        <section className="bg-white py-16 border-t">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">We fight for a fair scan price.</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We help you find affordable medical imaging quickly, so you can get the care you need without delay.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Average savings</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">$1,000+</p>
                <p className="text-lg">per imaging scan</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Trusted by</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">100+</p>
                <p className="text-lg">healthcare providers</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Network of</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">3,000+</p>
                <p className="text-lg">local imaging centers</p>
              </div>

              {/* New tile for deductible */}
              <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Payments</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">100%</p>
                <p className="text-lg">count toward deductible</p>
                <p className="text-xs mt-1">
                  <span className="text-gray-600">{language === "en" ? "Learn more " : "Más información "}</span>
                  <Link href="/faq#deductible" className="text-blue-600 hover:underline">
                    {language === "en" ? "here" : "aquí"}
                  </Link>
                </p>
              </div>

              {/* New tile for booking speed */}
              <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Average</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">3</p>
                <p className="text-lg">days to book scan</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-8 text-center transform transition-transform hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Helped</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">1,000+</p>
                <p className="text-lg">patients in Texas</p>
              </div>
            </div>

            {/* See the difference section - with different background color */}
            <div className="mb-16 bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-center">Same MRI, different price</h3>
              <p className="text-center text-gray-700 mb-2 max-w-3xl mx-auto">
                These two facilities use the same MRI machine, in the same zip code. Customer A paid $2,280 for their
                scan. Customer B paid $256. The difference? <span className="font-bold">Customer B used Robin</span>.
              </p>
              <p className="text-center text-gray-700 mb-8 max-w-3xl mx-auto">
                Many doctors refer patients to hospital imaging centers without discussing price—often resulting in
                bills 5-10x higher than independent centers.{" "}
                <span className="font-bold">Price shopping can save you thousands</span>.
              </p>

              <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                {/* Insurance Price */}
                <div className="bg-red-50 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-red-100 p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-bold text-gray-800">Without Robin</h4>
                      <span className="text-3xl font-bold text-red-600">$2,280</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
                      <Image
                        src="/images/insurance-bill.jpeg"
                        alt="Insurance bill showing $2,280 charge for ultrasound"
                        width={600}
                        height={800}
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      Hospital bill for ultrasound procedures with insurance
                    </p>
                  </div>
                </div>

                {/* Cash Price */}
                <div className="bg-green-50 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-green-100 p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-bold text-gray-800">With Robin</h4>
                      <span className="text-3xl font-bold text-green-600">$256</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
                      <Image
                        src="/images/cash-price.png"
                        alt="Cash price showing $128.23 per ultrasound"
                        width={600}
                        height={800}
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      Same procedures at cash-pay rates through Robin Health
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-blue-600 text-white p-6 rounded-xl text-center shadow-lg">
                  <p className="text-2xl font-bold">Save up to 90% on your medical imaging</p>
                  <p className="mt-2 text-blue-100">No hidden fees. No surprise bills. Just transparent pricing.</p>
                </div>
              </div>
            </div>

            {/* Testimonials - Updated for better desktop view */}
            <div className="bg-blue-50 p-8 rounded-xl shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">What our patients say</h3>
              </div>

              {/* Mobile view - scrollable carousel */}
              <div className="md:hidden">
                <div
                  id="testimonial-carousel"
                  className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide snap-x snap-mandatory"
                  onScroll={(e) => {
                    const container = e.currentTarget
                    const scrollPosition = container.scrollLeft
                    const testimonialWidth = container.scrollWidth / 3
                    const index = Math.round(scrollPosition / testimonialWidth)
                    setActiveTestimonial(index)
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="flex-shrink-0 w-full snap-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={`${testimonial.name} from ${testimonial.location}`}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div>
                          <p className="italic text-lg text-gray-700 mb-4">"{testimonial.quote}"</p>
                          <p className="font-medium text-gray-900 flex items-center">
                            <span className="text-blue-600 mr-2">—</span>
                            {testimonial.name} in {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop view - single testimonial at a time */}
              <div className="hidden md:block">
                <div className="relative">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`transition-opacity duration-500 ${activeTestimonial === index ? "opacity-100" : "opacity-0 absolute inset-0"}`}
                    >
                      <div className="flex flex-row items-start gap-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={`${testimonial.name} from ${testimonial.location}`}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div>
                          <p className="italic text-xl text-gray-700 mb-4">"{testimonial.quote}"</p>
                          <p className="font-medium text-gray-900 flex items-center">
                            <span className="text-blue-600 mr-2">—</span>
                            {testimonial.name} in {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Navigation Dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${activeTestimonial === index ? "bg-blue-600" : "bg-gray-300"}`}
                    onClick={() => {
                      setActiveTestimonial(index)
                      const testimonialContainer = document.getElementById("testimonial-carousel")
                      if (testimonialContainer && isMobile) {
                        const testimonialWidth = testimonialContainer.scrollWidth / 3
                        testimonialContainer.scrollTo({
                          left: testimonialWidth * index,
                          behavior: "smooth",
                        })
                      }
                    }}
                    aria-label={`View ${testimonials[index].name}'s testimonial`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How Robin Health Works - Blue background */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <h2 className="text-3xl font-bold mb-4 md:mb-0">How Robin Health works</h2>
            </div>

            <div className={`grid ${isMobile ? "" : "md:grid-cols-5"} gap-8 items-start`}>
              {/* Left side: 2x2 grid */}
              <div className={`grid grid-cols-2 gap-4 auto-rows-fr h-full ${isMobile ? "" : "md:col-span-3"}`}>
                {/* Step 1 */}
                <div className="bg-white rounded-lg p-6 relative shadow-sm">
                  <div className="absolute -top-3 -left-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-md">
                    1
                  </div>
                  <h3 className="font-bold text-3xl text-blue-800 mb-3">Get pricing fast</h3>
                  <div className="bg-blue-50 rounded-md px-3 py-1.5 text-blue-600 font-medium text-lg inline-block mb-3">
                    Instant
                  </div>
                  <p className="text-gray-700 text-xl">
                    {language === "en"
                      ? "We'll find you the best cash-pay prices at fully accredited, high-quality imaging centers near you—fast."
                      : "Te encontraremos los mejores precios de pago en efectivo en centros de imágenes de alta calidad y totalmente acreditados cerca de ti."}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-lg p-6 relative shadow-sm">
                  <div className="absolute -top-3 -left-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-md">
                    2
                  </div>
                  <h3 className="font-bold text-3xl text-blue-800 mb-3">Confirm and pay</h3>
                  <div className="bg-blue-50 rounded-md px-3 py-1.5 text-blue-600 font-medium text-lg inline-block mb-3">
                    24 hours
                  </div>
                  <p className="text-gray-700 text-xl">
                    {language === "en"
                      ? "Once we find a scan that meets your needs, you'll confirm your appointment and pay a one-time $25 booking fee. If we don't save you at least $100, we'll refund you — no questions asked."
                      : "Una vez que encontremos un escaneo que satisfaga tus necesidades, confirmarás tu cita y pagarás una tarifa única de reserva de $25. Si no te ahorramos al menos $100, te reembolsaremos, sin preguntas."}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-lg p-6 relative shadow-sm">
                  <div className="absolute -top-3 -left-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-md">
                    3
                  </div>
                  <h3 className="font-bold text-3xl text-blue-800 mb-3">Book your scan</h3>
                  <div className="bg-blue-50 rounded-md px-3 py-1.5 text-blue-600 font-medium text-lg inline-block mb-3">
                    {language === "en" ? "Average 3 days" : "Promedio 3 días"}
                  </div>
                  <p className="text-gray-700 text-xl">
                    {language === "en"
                      ? "We'll handle scheduling and make an appointment within 3 days at an imaging center near you."
                      : "Nos encargaremos de la programación y haremos una cita dentro de 3 días en un centro de imágenes cerca de ti."}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white rounded-lg p-6 relative shadow-sm">
                  <div className="absolute -top-3 -left-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-md">
                    4
                  </div>
                  <h3 className="font-bold text-3xl text-blue-800 mb-3">Get your results</h3>
                  <div className="bg-blue-50 rounded-md px-3 py-1.5 text-blue-600 font-medium text-lg inline-block mb-3">
                    24-72 hours
                  </div>
                  <p className="text-gray-700 text-xl">Results sent to your doctor and you.</p>
                </div>
              </div>

              {/* Right side: Video - Only show on desktop */}
              {!isMobile && (
                <div className="flex items-center justify-center md:col-span-2">
                  <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 w-full mx-auto relative">
                    <div className="relative" style={{ paddingBottom: "160%" }}>
                      <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-contain bg-white"
                        autoPlay
                        playsInline
                        muted
                        loop
                        poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/robin-video-screenshot-Yd9Ij9Ij0Yd9Ij9Ij0Yd9Ij9Ij0Yd9Ij9Ij0.jpg"
                      >
                        <source
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/recording-IswtifkwFkQqxnzWaADephgtarQzFc.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>

                      {/* Customer Service Agent Avatar */}
                      <div className="absolute top-4 left-4 z-10 flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <Image
                            src="/images/csragent.jpg"
                            alt="Robin Health Customer Service Agent"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-2 bg-white/90 px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                          Robin Care Team
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Section - White background */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">How much we charge</h2>
                <div className="inline-block relative mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    $25<span className="text-3xl">/scan</span>
                  </span>
                  <div className="absolute -bottom-3 left-0 right-0 h-1 bg-red-400 rounded-full opacity-70"></div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">We charge a one-time $25 fee per scan</p>
                      <p className="text-gray-600">
                        to coordinate everything for you—so you don't have to lift a finger—
                        <span className="font-bold">only once your appointment has been booked.</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-100 p-4 rounded-md mb-6">
                    <p className="text-blue-600 font-medium text-lg">
                      <span className="font-bold">100% Satisfaction Guarantee:</span> If we don't save you at least $100
                      compared to a price you've been quoted by an imaging center, we'll refund your $25 fee—no
                      questions asked.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-4">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">You save time</p>
                        <p className="text-gray-600">No more waiting on hold</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-4">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">You avoid surprise bills</p>
                        <p className="text-gray-600">Know exactly what you'll pay upfront</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 border-t">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Secure payment only after your appointment is confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve - Blue background */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-10 text-center">Who we serve</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Overwhelmed by insurance</h3>
                  <p className="text-gray-600">
                    Tired of paperwork, phone calls with endless wait times, and fighting for approvals
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">High-deductible plans</h3>
                  <p className="text-gray-600">Save money when you haven't met your deductible yet.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Need a scan ASAP</h3>
                  <p className="text-gray-600">Can't afford insurance delays when you need answers quickly.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Prior auth rejections</h3>
                  <p className="text-gray-600">Bypass insurance when they keep rejecting your scan authorization.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Limited in-network options</h3>
                  <p className="text-gray-600">Find more choices when your insurance network is restrictive.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">No insurance</h3>
                  <p className="text-gray-600">Recently lost or don't have insurance? We've got you covered.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Chat popup */}
      {showChatButton && (
        <>
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-40 transition-all duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="ml-2 font-medium">Chat with us</span>
          </button>

          <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} phoneNumber={phoneNumber} />
        </>
      )}
    </div>
  )
}
