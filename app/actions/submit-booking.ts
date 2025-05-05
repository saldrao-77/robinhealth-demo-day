"use server"

import { supabase } from "@/lib/supabase-client"

export async function submitBookingConfirmation(formData: FormData) {
  try {
    // Extract form data
    const imagingCenterName = formData.get("imagingCenterName") as string
    const imagingCenterAddress = formData.get("imagingCenterAddress") as string
    const imagingCenterPhone = formData.get("imagingCenterPhone") as string
    const estimatedCostRange = formData.get("estimatedCostRange") as string

    const availabilityText = formData.get("availabilityText") as string
    const processedAvailability = formData.get("processedAvailability") as string

    const cardholderName = formData.get("cardholderName") as string
    const billingZipCode = formData.get("billingZipCode") as string
    const cardNumber = formData.get("cardNumber") as string
    // Only store last 4 digits for security
    const lastFourDigits = cardNumber ? cardNumber.slice(-4) : ""

    const hasOrder = formData.get("hasOrder") === "yes"
    const orderProviderName = formData.get("orderProviderName") as string
    const orderPracticeName = formData.get("orderPracticeName") as string
    const orderLocation = formData.get("orderLocation") as string
    const willObtainOrder = formData.get("willObtainOrder") === "true"

    // Insert into Supabase
    const { data, error } = await supabase
      .from("booking_confirmations")
      .insert([
        {
          imaging_center_name: imagingCenterName,
          imaging_center_address: imagingCenterAddress,
          imaging_center_phone: imagingCenterPhone,
          estimated_cost_range: estimatedCostRange,

          availability_text: availabilityText,
          processed_availability: processedAvailability,

          cardholder_name: cardholderName,
          billing_zip_code: billingZipCode,
          last_four_digits: lastFourDigits,

          has_order: hasOrder,
          order_provider_name: orderProviderName,
          order_practice_name: orderPracticeName,
          order_location: orderLocation,
          will_obtain_order: willObtainOrder,

          status: "submitted",
          processed: false,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error: `Database error: ${error.message}` }
    }

    console.log("Successfully inserted booking confirmation:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Submission error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
