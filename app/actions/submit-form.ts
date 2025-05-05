"use server"

import { supabase } from "@/lib/supabase-client"

export async function submitLeadForm(formData: any) {
  try {
    // Extract form data
    const zipCode = formData.zipCode
    const phone = formData.phone
    const imagingType = formData.imagingType
    const bodyPart = formData.bodyPart
    const hasOrder = formData.hasOrder
    const fullName = formData.fullName

    // Extract UTM source from the request headers
    const headers = formData.headers || {}
    const referer = headers.referer || ""
    const urlParams = new URLSearchParams(referer.includes("?") ? referer.split("?")[1] : "")
    const utmSource = urlParams.get("utm_source") || null

    // Log the data we're about to insert
    console.log("Submitting form data:", {
      zip_code: zipCode,
      phone,
      imaging_type: imagingType,
      body_part: bodyPart,
      has_order: hasOrder,
      full_name: fullName,
      utm_source: utmSource,
    })

    // Insert into Supabase
    const { data, error } = await supabase
      .from("lead_submissions")
      .insert([
        {
          zip_code: zipCode,
          phone,
          imaging_type: imagingType,
          body_part: bodyPart,
          has_order: hasOrder,
          full_name: fullName,
          processed: false,
          utm_source: utmSource,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error: `Database error: ${error.message}` }
    }

    console.log("Successfully inserted data:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Submission error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
