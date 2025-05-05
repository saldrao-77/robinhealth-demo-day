"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"

const phoneNumber = "(262) 501-8982"

interface AccordionItemProps {
  value: string
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: (value: string) => void
  id?: string
}

function AccordionItem({ value, title, children, isOpen, onToggle, id }: AccordionItemProps) {
  return (
    <div className="border-b">
      <h3>
        <button
          className="flex justify-between w-full py-4 text-left font-medium"
          onClick={() => onToggle(value)}
          aria-expanded={isOpen}
        >
          {title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>
      <div className={`pb-4 pr-4 ${isOpen ? "block" : "hidden"}`}>{children}</div>
    </div>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [language, setLanguage] = useState("en")

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

  const toggleItem = (value: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [value]: !prev[value],
    }))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-12">
              {language === "en" ? "Frequently asked questions" : "Preguntas frecuentes"}
            </h1>

            {/* Cost, Payment, and Insurance */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">
                {language === "en" ? "Cost, payment, and insurance" : "Costo, pago y seguro"}
              </h3>
              <div className="space-y-2">
                <AccordionItem
                  value="cash-with-insurance"
                  title={
                    language === "en"
                      ? "Can I pay with cash even if I have insurance?"
                      : "¿Puedo pagar en efectivo aunque tenga seguro?"
                  }
                  isOpen={!!openItems["cash-with-insurance"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "Yes! Even if you have insurance, you can choose to pay the cash-pay price instead of using your insurance. Many people do this to:"
                      : "¡Sí! Incluso si tienes seguro, puedes elegir pagar el precio en efectivo en lugar de usar tu seguro. Muchas personas hacen esto para:"}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      {language === "en"
                        ? "Avoid high deductibles – If you haven't met your deductible, cash prices may be cheaper than going through insurance."
                        : "Evitar deducibles altos – Si no has alcanzado tu deducible, los precios en efectivo pueden ser más baratos que usar el seguro."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Skip prior authorizations – Some insurance plans require approvals, while cash payments allow you to book immediately."
                        : "Omitir autorizaciones previas – Algunos planes de seguro requieren aprobaciones, mientras que los pagos en efectivo te permiten reservar inmediatamente."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Keep it simple – No paperwork, no claims, and no surprise bills later."
                        : "Mantenerlo simple – Sin papeleo, sin reclamos y sin facturas sorpresa más tarde."}
                    </li>
                  </ul>
                </AccordionItem>

                <AccordionItem
                  value="deductible"
                  title={
                    language === "en"
                      ? "Will my payment count toward my deductible?"
                      : "¿Mi pago contará para mi deducible?"
                  }
                  isOpen={!!openItems["deductible"]}
                  onToggle={toggleItem}
                  id="deductible"
                >
                  <p>
                    {language === "en"
                      ? "Yes! In most cases, your cash-pay medical expenses can count toward your deductible. Recent legislation in Texas (HB 2002), Arizona, and Tennessee specifically requires insurance companies to apply cash payments toward deductibles."
                      : "¡Sí! En la mayoría de los casos, tus gastos médicos de pago en efectivo pueden contar para tu deducible. La legislación reciente en Texas (HB 2002), Arizona y Tennessee específicamente requiere que las compañías de seguros apliquen los pagos en efectivo a los deducibles."}
                  </p>
                  <div className="mt-4 bg-blue-50 p-4 rounded-md">
                    <h4 className="font-bold mb-2">
                      {language === "en" ? "How the process works:" : "Cómo funciona el proceso:"}
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        {language === "en"
                          ? 'You receive a detailed receipt ("superbill") for your cash payment.'
                          : 'Recibes un recibo detallado ("superfactura") por tu pago en efectivo.'}
                      </li>
                      <li>
                        {language === "en"
                          ? "We help you file this receipt with your insurance company without you having to put in the effort."
                          : "Te ayudamos a presentar este recibo a tu compañía de seguros sin que tengas que esforzarte."}
                      </li>
                      <li>
                        {language === "en"
                          ? "Your dedicated care coordinator walks you through the process one-on-one."
                          : "Tu coordinador de atención dedicado te guía a través del proceso individualmente."}
                      </li>
                      <li>
                        {language === "en"
                          ? "The amount is typically applied to your deductible within 2-4 weeks."
                          : "La cantidad generalmente se aplica a tu deducible dentro de 2-4 semanas."}
                      </li>
                    </ol>
                  </div>
                  <p className="mt-4">
                    {language === "en"
                      ? "Even in states without specific legislation, many insurance companies will still apply these payments to your deductible. Our team will guide you through the specific requirements for your insurance plan."
                      : "Incluso en estados sin legislación específica, muchas compañías de seguros seguirán aplicando estos pagos a tu deducible. Nuestro equipo te guiará a través de los requisitos específicos para tu plan de seguro."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="payment-security"
                  title={language === "en" ? "When do I pay, and is it secure?" : "¿Cuándo pago y es seguro?"}
                  isOpen={!!openItems["payment-security"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "You'll only be charged the $25 booking fee after we've found and confirmed your scan. All payments are securely processed, and we never store your card information."
                      : "Solo se te cobrará la tarifa de reserva de $25 después de que hayamos encontrado y confirmado tu escaneo. Todos los pagos se procesan de forma segura y nunca almacenamos la información de tu tarjeta."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="how-much-save"
                  title={language === "en" ? "How much will I save?" : "¿Cuánto ahorraré?"}
                  isOpen={!!openItems["how-much-save"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "Patients save an average of 40–90%+ compared to hospital and insurance prices. Prices vary by location and scan type, but we always show upfront, transparent pricing—no surprise bills."
                      : "Los pacientes ahorran un promedio de 40–90%+ en comparación con los precios de hospitales y seguros. Los precios varían según la ubicación y el tipo de escaneo, pero siempre mostramos precios transparentes por adelantado, sin facturas sorpresa."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="hidden-fees"
                  title={language === "en" ? "Are there any hidden fees?" : "¿Hay tarifas ocultas?"}
                  isOpen={!!openItems["hidden-fees"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "No. The price listed includes the scan and any associated facility fees. If additional scans or contrast are needed, the imaging center will inform you of any extra costs."
                      : "No. El precio indicado incluye el escaneo y cualquier tarifa de instalación asociada. Si se necesitan escaneos adicionales o contraste, el centro de imágenes te informará de cualquier costo adicional."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="hsa-fsa"
                  title={language === "en" ? "Can I use an HSA or FSA card?" : "¿Puedo usar una tarjeta HSA o FSA?"}
                  isOpen={!!openItems["hsa-fsa"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "Yes! Most Health Savings Accounts (HSA) and Flexible Spending Accounts (FSA) allow imaging purchases. Be sure to check with your HSA / FSA administrator for eligibility."
                      : "¡Sí! La mayoría de las cuentas de ahorro para la salud (HSA) y las cuentas de gastos flexibles (FSA) permiten compras de imágenes. Asegúrate de consultar con tu administrador de HSA / FSA para verificar la elegibilidad."}
                  </p>
                </AccordionItem>
              </div>
            </div>

            {/* General Questions */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">
                {language === "en" ? "General questions" : "Preguntas generales"}
              </h3>
              <div className="space-y-2">
                <AccordionItem
                  value="what-is-service"
                  title={language === "en" ? "What is this service?" : "¿Qué es este servicio?"}
                  isOpen={!!openItems["what-is-service"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "We provide an easy way to find and book affordable imaging services (e.g., MRI, CT scan, X-ray) at cash-pay prices. By bypassing insurance, you can save hundreds—even thousands—on medical imaging."
                      : "Proporcionamos una manera fácil de encontrar y reservar servicios de imágenes asequibles (por ejemplo, resonancia magnética, tomografía computarizada, rayos X) a precios de pago en efectivo. Al evitar el seguro, puedes ahorrar cientos, incluso miles, en imágenes médicas."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="how-does-work"
                  title={language === "en" ? "How does this work?" : "¿Cómo funciona esto?"}
                  isOpen={!!openItems["how-does-work"]}
                  onToggle={toggleItem}
                >
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      {language === "en"
                        ? "Search for a scan – Enter your ZIP code and select the imaging service you need."
                        : "Busca un escaneo – Ingresa tu código postal y selecciona el servicio de imágenes que necesitas."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Compare prices – See upfront costs from local imaging centers."
                        : "Compara precios – Ve los costos por adelantado de los centros de imágenes locales."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Submit your request – We help coordinate your order and confirm your appointment."
                        : "Envía tu solicitud – Te ayudamos a coordinar tu pedido y confirmar tu cita."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Get your scan – Show up at your scheduled time, pay the listed price, and receive your results."
                        : "Obtén tu escaneo – Preséntate a la hora programada, paga el precio indicado y recibe tus resultados."}
                    </li>
                  </ol>
                </AccordionItem>

                <AccordionItem
                  value="doctor-order"
                  title={
                    language === "en"
                      ? "How do you work with my doctor to get an order?"
                      : "¿Cómo trabajan con mi médico para obtener una orden?"
                  }
                  isOpen={!!openItems["doctor-order"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "If your scan requires a doctor's order, we help coordinate it. You can:"
                      : "Si tu escaneo requiere una orden médica, te ayudamos a coordinarla. Puedes:"}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      {language === "en"
                        ? "Upload your order if you already have one."
                        : "Sube tu orden si ya tienes una."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Provide your doctor's details, and we'll reach out to your doctor to handle the request for you."
                        : "Proporciona los detalles de tu médico y nos comunicaremos con él para gestionar la solicitud por ti."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Get connected to a provider if you need a new order."
                        : "Conéctate con un proveedor si necesitas una nueva orden."}
                    </li>
                  </ul>
                </AccordionItem>

                <AccordionItem
                  value="process-time"
                  title={language === "en" ? "How long does this process take?" : "¿Cuánto tiempo toma este proceso?"}
                  isOpen={!!openItems["process-time"]}
                  onToggle={toggleItem}
                >
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{language === "en" ? "Finding a scan – 24 hours" : "Encontrar un escaneo – 24 horas"}</li>
                    <li>
                      {language === "en"
                        ? "Coordinating your order – 24–48 hours (if needed)"
                        : "Coordinar tu orden – 24–48 horas (si es necesario)"}
                    </li>
                    <li>
                      {language === "en"
                        ? "Scheduling your scan – Average of 3 days from initial request to appointment"
                        : "Programar tu escaneo – Promedio de 3 días desde la solicitud inicial hasta la cita"}
                    </li>
                  </ul>
                </AccordionItem>
              </div>
            </div>

            {/* Other Questions */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {language === "en" ? "Other questions" : "Otras preguntas"}
              </h3>
              <div className="space-y-2">
                <AccordionItem
                  value="cancel-reschedule"
                  title={
                    language === "en"
                      ? "What happens if I need to cancel or reschedule?"
                      : "¿Qué sucede si necesito cancelar o reprogramar?"
                  }
                  isOpen={!!openItems["cancel-reschedule"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "Our care coordination team is here to help. Email or text us at anytime and we'll help you with any scheduling needs."
                      : "Nuestro equipo de coordinación de atención está aquí para ayudar. Envíanos un correo electrónico o un mensaje de texto en cualquier momento y te ayudaremos con cualquier necesidad de programación."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="referral"
                  title={language === "en" ? "Do I need a referral?" : "¿Necesito una referencia?"}
                  isOpen={!!openItems["referral"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "Some imaging services (e.g., MRI, CT) require a doctor's order, but many basic scans (e.g., X-rays) do not, especially when paying with cash. Our care coordination team can guide you through the process based on the scan you need."
                      : "Algunos servicios de imágenes (por ejemplo, resonancia magnética, tomografía computarizada) requieren una orden médica, pero muchos escaneos básicos (por ejemplo, radiografías) no la requieren, especialmente cuando se paga en efectivo. Nuestro equipo de coordinación de atención puede guiarte a través del proceso según el escaneo que necesites."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="results"
                  title={language === "en" ? "How do I get my results?" : "¿Cómo obtengo mis resultados?"}
                  isOpen={!!openItems["results"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "Your imaging results will be sent directly to your referring provider. Additionally, most imaging centers share a copy with patients. If you'd like a copy for yourself, be sure ask the imaging center at the time of your scan. Our care coordination team can help you at every step of the way."
                      : "Tus resultados de imágenes se enviarán directamente a tu proveedor remitente. Además, la mayoría de los centros de imágenes comparten una copia con los pacientes. Si deseas una copia para ti, asegúrate de preguntarle al centro de imágenes en el momento de tu escaneo. Nuestro equipo de coordinación de atención puede ayudarte en cada paso del camino."}
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="more-questions"
                  title={language === "en" ? "What if I have more questions?" : "¿Qué pasa si tengo más preguntas?"}
                  isOpen={!!openItems["more-questions"]}
                  onToggle={toggleItem}
                >
                  <p>
                    {language === "en"
                      ? "Reach out to us anytime—we're happy to help!"
                      : "Contáctanos en cualquier momento, ¡estaremos encantados de ayudarte!"}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>{language === "en" ? "Phone / SMS: (262) 501-8982" : "Teléfono / SMS: (262) 501-8982"}</li>
                    <li>
                      {language === "en" ? "Email: support@rbnhealth.com" : "Correo electrónico: support@rbnhealth.com"}
                    </li>
                  </ul>
                </AccordionItem>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">
              {language === "en" ? "Why patients love Robin Health" : "Por qué los pacientes aman a Robin Health"}
            </h2>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-blue-200/70 p-6 rounded-lg">
                <div className="flex justify-start mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {language === "en" ? "Deductible-friendly savings" : "Ahorros compatibles con deducibles"}
                </h3>
                <p className="text-lg">
                  {language === "en"
                    ? "We help you file your cash-price imaging bill toward your deductible."
                    : "Te ayudamos a presentar tu factura de imágenes de precio en efectivo para tu deducible."}
                </p>
              </div>

              <div className="bg-blue-200/70 p-6 rounded-lg">
                <div className="flex justify-start mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {language === "en" ? "Locked-in pricing." : "Precios fijos."}
                </h3>
                <p className="text-lg">
                  {language === "en"
                    ? "No hidden fees / extra charges. The scan price you see is what you pay."
                    : "Sin tarifas ocultas / cargos adicionales. El precio del escaneo que ves es lo que pagas."}
                </p>
              </div>

              <div className="bg-blue-200/70 p-6 rounded-lg">
                <div className="flex justify-start mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {language === "en" ? "Fast scheduling." : "Programación rápida."}
                </h3>
                <p className="text-lg">
                  {language === "en"
                    ? "Scan pricing sent in 24 hours. Appointments typically scheduled within 3 days."
                    : "Precios de escaneo enviados en 24 horas. Citas típicamente programadas dentro de 3 días."}
                </p>
              </div>

              <div className="bg-blue-200/70 p-6 rounded-lg">
                <div className="flex justify-start mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-600"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {language === "en" ? "Live care support." : "Soporte de atención en vivo."}
                </h3>
                <p className="text-lg">
                  {language === "en"
                    ? "Our care coordination team is here to help before, during, and after."
                    : "Nuestro equipo de coordinación de atención está aquí para ayudar antes, durante y después."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How Robin Saves You Money */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {language === "en" ? "How Robin saves you money" : "Cómo Robin te ahorra dinero"}
            </h2>

            <div className="flex flex-col max-w-4xl mx-auto">
              {/* Pricing Table */}
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-6 text-center">
                  {language === "en" ? "We have industry-low pricing" : "Tenemos precios bajos en la industria"}
                </h3>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ROBIN%2BHEALTH%2BRates%2Bstarting%2Bfrom.jpg-OJ6RPc4V0d0ClMGKcy51XLWHwfSyDx.jpeg"
                  alt={language === "en" ? "Robin Health Pricing Comparison" : "Comparación de precios de Robin Health"}
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-lg border border-gray-200 shadow-md"
                />
              </div>

              <div className="bg-blue-100 p-6 rounded-lg text-center">
                <p className="text-xl font-bold text-blue-800">
                  {language === "en"
                    ? "Save up to 90% on your medical imaging with Robin Health"
                    : "Ahorra hasta un 90% en tus imágenes médicas con Robin Health"}
                </p>
                <p className="mt-2">
                  {language === "en"
                    ? "No hidden fees. No surprise bills. Just transparent pricing."
                    : "Sin tarifas ocultas. Sin facturas sorpresa. Solo precios transparentes."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-blue-600 rounded-xl overflow-hidden shadow-xl">
              <div className="md:flex">
                <div className="md:w-2/3 p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {language === "en"
                      ? "Ready to save on your medical imaging?"
                      : "¿Listo para ahorrar en tus imágenes médicas?"}
                  </h2>
                  <p className="text-blue-100 text-lg mb-8">
                    {language === "en"
                      ? "Get started today and find affordable, high-quality imaging centers near you."
                      : "Comienza hoy y encuentra centros de imágenes asequibles y de alta calidad cerca de ti."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/#hero"
                      className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-md transition-colors text-center"
                    >
                      {language === "en" ? "Get started" : "Comenzar"}
                    </Link>
                    <a
                      href={`tel:${phoneNumber.replace(/[^0-9]/g, "")}`}
                      className="border border-white text-white hover:bg-blue-700 font-medium py-3 px-6 rounded-md transition-colors text-center"
                    >
                      {language === "en" ? `Call us: ${phoneNumber}` : `Llámanos: ${phoneNumber}`}
                    </a>
                  </div>
                </div>
                <div className="md:w-1/3 bg-blue-700 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-white"
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
                    <p className="text-3xl font-bold text-white mb-2">$1,000+</p>
                    <p className="text-blue-100">
                      {language === "en" ? "Average savings per scan" : "Ahorro promedio por escaneo"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
