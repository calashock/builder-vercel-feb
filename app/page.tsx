import { Suspense } from "react"
import { BuilderContent } from "../components/builder-content"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuilderContent />
    </Suspense>
  )
}

