"use client"

export function Header({ title }: { title: string }) {
  return (
    <header className="w-full py-6 px-4 bg-background border-b">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
    </header>
  )
}

