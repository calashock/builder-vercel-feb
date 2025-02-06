"use client"

import { Builder } from "@builder.io/react"
import { Header } from "./components/header"

if (typeof window !== "undefined") {
  Builder.registerComponent(Header, {
    name: "Header",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Welcome",
      },
    ],
  })
}

