"use client"

import { builder } from "@builder.io/sdk"

// Initialize the Builder SDK with your public API key
export const initBuilder = () => {
  builder.init(process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY!)
}

export { builder }

