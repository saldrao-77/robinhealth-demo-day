"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Sparkles,
  Upload,
  CreditCard,
  Calendar,
  CheckCircle,
  Building2,
  MapPin,
  Clock,
  Phone,
  Star,
  Check,
  AlertCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConfirmPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [availabilityText, setAvailabilityText] = useState("")
  const [processedAvailability, setProcessedAvailability] = useState("")
  const [hasOrder, setHasOrder] = useState<string | null>(null)
  const [orderProvider, setOrderProvider] = useState("")
  const [orderPractice, setOrderPractice] = useState("")
  const [orderLocation, setOrderLocation] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [billingZipCode, setBillingZipCode] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderUnderstood, setOrderUnderstood] = useState(false)
  const [fileSelected, setFileSelected] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [activeTab, setActiveTab] = useState("upload")

  // Imaging center details (would come from previous page in real implementation)
  const imagingCenter = {
    name: "Bay Area Medical Imaging Center",
    address: "123 Medical Plaza Dr, San Francisco, CA 94107",
    phone: "(415) 555-1234",
    hours: "Open 8am-6pm Mon-Fri",
    rating: "4.8 (124 reviews)",
    costRange: "$250 - $350",
  }

  const handleAIProcess = () => {
    // Simulate AI processing
    const processed = `Based on your input, we'll avoid scheduling on:
    - Monday afternoons
    - All day Wednesday
    - Friday before 10am
    
    We'll prioritize Tuesday and Thursday mornings.`

    setProcessedAvailability(processed)
  }

  const validateForm = () => {
    // Basic validation
    if (!availabilityText.trim()) {
      setValidationError("Please provide your availability information")
      return false
    }

    if (!cardholderName || !cardNumber || !billingZipCode || !expiry || !cvc) {
      setValidationError("Please complete all payment fields")
      return false
    }

    // Doctor's order validation
    if (hasOrder === null) {
      setValidationError("Please indicate whether you have a doctor's order")
      return false
    }

    if (hasOrder === "yes") {
      if (activeTab === "upload" && !fileSelected) {
        setValidationError("Please upload your doctor's order")
        return false
      }
      if (activeTab === "info" && (!orderProvider || !orderPractice || !orderLocation)) {
        setValidationError("Please provide complete doctor's order information")
        return false
      }
    } else if (hasOrder === "no" && !orderUnderstood) {
      setValidationError("Please acknowledge that you will obtain a doctor's order")
      return false
    }

    setValidationError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to the error message
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setShowConfirmation(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setValidationError("There was an error submitting your booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReturnHome = () => {
    router.push("/")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileSelected(e.target.files !== null && e.target.files.length > 0)
  }

  const handleUnderstandClick = () => {
    setOrderUnderstood(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 container max-w-4xl py-12 px-4 md:pl-12 md:pr-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Scan Booking</h1>

        {validationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          {/* Selected Imaging Center Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Selected Imaging Center
              </CardTitle>
              <CardDescription>You've selected the following imaging center for your scan.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{imagingCenter.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{imagingCenter.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{imagingCenter.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{imagingCenter.hours}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span>{imagingCenter.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      In-Network
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      MRI Available
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                      Same-Week Availability
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                <p className="font-medium">Your estimated out-of-pocket cost: {imagingCenter.costRange}</p>
                <p className="text-gray-500 mt-1">
                  Final price depends on your specific insurance coverage and deductible status.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                1. Availability Information
              </CardTitle>
              <CardDescription>
                Our team will work with your imaging center behind the scenes to book your appointment based on your
                availability. No more waiting on hold or dealing with scheduling hassles—we'll handle everything so you
                can focus on your health.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="availability" className="text-base font-medium">
                  Are there any days/times that don't work for you, or times you prefer over the next few weeks?*
                </Label>
                <div className="mt-2 relative">
                  <Textarea
                    id="availability"
                    name="availability"
                    placeholder="E.g., I can't do Mondays, prefer mornings, available after 3pm on weekdays..."
                    className="min-h-[120px]"
                    value={availabilityText}
                    onChange={(e) => setAvailabilityText(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute bottom-3 right-3 flex items-center gap-1"
                    onClick={handleAIProcess}
                  >
                    <Sparkles className="h-4 w-4" />
                    Process
                  </Button>
                </div>
              </div>

              {processedAvailability && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Processed Availability
                  </div>
                  <div className="whitespace-pre-line text-sm">{processedAvailability}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                2. Payment Information
              </CardTitle>
              <CardDescription>
                To move forward, please enter your card information below. We'll only place a $1 hold—our $25
                coordination fee is only charged after your scan is complete.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cardName">Name on card*</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Smith"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cardNumber">Card number*</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="zipCode">Billing zip code*</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="12345"
                  value={billingZipCode}
                  onChange={(e) => setBillingZipCode(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="expiry">Expiry date*</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cvc">CVC*</Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm">
                <p className="font-medium mb-2">Secure Payment</p>
                <p>
                  Your card information is encrypted and secure. We'll only place a $1 authorization hold to verify your
                  card. This hold will be removed within 7 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Doctor's Order */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                3. Doctor's Order Information
              </CardTitle>
              <CardDescription>
                Medical imaging procedures require a doctor's order. Please let us know if you have one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={hasOrder || ""}
                onValueChange={(value) => {
                  setHasOrder(value)
                  setOrderUnderstood(false) // Reset when changing selection
                }}
                name="hasOrder"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-order-yes" />
                  <Label htmlFor="has-order-yes">Yes, I have a doctor's order</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="has-order-no" />
                  <Label htmlFor="has-order-no">No, I don't have a doctor's order yet</Label>
                </div>
              </RadioGroup>

              {hasOrder === "yes" && (
                <Tabs defaultValue="upload" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Order</TabsTrigger>
                    <TabsTrigger value="info">Enter Provider Info</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="space-y-4 pt-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm font-medium">Drag and drop your order PDF here</p>
                      <p className="text-xs text-gray-500 mt-1">Or click to browse files</p>
                      <input
                        type="file"
                        id="orderFile"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => document.getElementById("orderFile")?.click()}
                      >
                        Select File
                      </Button>
                      {fileSelected && (
                        <div className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                          <Check className="h-4 w-4" />
                          File selected
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="info" className="space-y-4 pt-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="providerName">Ordering Provider's Name*</Label>
                      <Input
                        id="providerName"
                        name="providerName"
                        placeholder="Dr. John Smith"
                        value={orderProvider}
                        onChange={(e) => setOrderProvider(e.target.value)}
                        required={activeTab === "info"}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="practiceName">Practice Name*</Label>
                      <Input
                        id="practiceName"
                        name="practiceName"
                        placeholder="Smith Medical Group"
                        value={orderPractice}
                        onChange={(e) => setOrderPractice(e.target.value)}
                        required={activeTab === "info"}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="location">Location*</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, State"
                        value={orderLocation}
                        onChange={(e) => setOrderLocation(e.target.value)}
                        required={activeTab === "info"}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {hasOrder === "no" && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium mb-2">This Procedure Requires a Physician's Order</h3>
                  <p className="mb-2">
                    I acknowledge that this procedure cannot be performed without an order from my physician.
                  </p>
                  <p className="mb-2">
                    I confirm that I will obtain a physician's order to present at my appointment or upon scheduling if
                    needed.
                  </p>
                  <p className="mb-4">
                    Need an order? We recommend visiting a primary care physician or urgent care physician to obtain an
                    order. If you have questions or need help, feel free to reach out to our care coordination team at{" "}
                    <a href="tel:2625018982" className="text-blue-600 hover:underline">
                      (262) 501-8982
                    </a>{" "}
                    or{" "}
                    <a href="mailto:support@rbnhealth.com" className="text-blue-600 hover:underline">
                      support@rbnhealth.com
                    </a>{" "}
                    and we can help you from there.
                  </p>
                  <Button
                    type="button"
                    className={`w-full mb-4 ${orderUnderstood ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={handleUnderstandClick}
                  >
                    {orderUnderstood ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="h-5 w-5" />I Understand and Will Obtain an Order
                      </span>
                    ) : (
                      "I Understand and Will Obtain an Order"
                    )}
                  </Button>

                  <div className="flex justify-center gap-4 mt-4">
                    <Button type="button" variant="outline" className="border border-gray-300" asChild>
                      <a href="tel:2625018982">Call Us</a>
                    </Button>
                    <Button type="button" variant="outline" className="border border-gray-300" asChild>
                      <a href="sms:2625018982">Text Us</a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" className="px-8 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Complete Booking"}
            </Button>
          </div>
        </form>
      </main>

      <SiteFooter />

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Booking Confirmed!</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center pt-2 pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="mb-4">
              Thank you for your booking! Our Robin Health care coordination team will contact you shortly to confirm
              your appointment details.
            </p>
            <p className="text-sm text-gray-500 mb-6">A confirmation email has been sent to your email address.</p>
            <Button className="w-full" onClick={handleReturnHome}>
              Return to Home
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}
