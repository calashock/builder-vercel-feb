"use client"

import { useEffect, useState } from "react"
import { BuilderComponent } from "@builder.io/react"
import { builder } from "../lib/builder"
import { initBuilder } from "../lib/builder"

export function BuilderContent() {
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initBuilder()

    async function fetchContent() {
      try {
        const content = await builder
          .get("page", {
            url: window.location.pathname || "/",
          })
          .promise()

        setContent(content)
      } catch (error) {
        console.error("Error fetching Builder content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return content ? (
    <BuilderComponent model="page" content={content} />
  ) : (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-muted-foreground">No content found.</p>
    </div>
  )
}

