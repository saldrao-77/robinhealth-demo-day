import Link from "next/link"

interface NavigationProps {
  color?: "white" | "dark"
  language?: string
}

export function Navigation({ color = "dark", language = "en" }: NavigationProps) {
  const textColor = color === "white" ? "text-white hover:text-blue-200" : "text-gray-800 hover:text-blue-600"

  return (
    <nav className="flex items-center space-x-6">
      <Link href="/" className={`${textColor} font-medium`}>
        {language === "en" ? "Home" : "Inicio"}
      </Link>
      <Link href="/about" className={`${textColor} font-medium`}>
        {language === "en" ? "About Us" : "Sobre Nosotros"}
      </Link>
      <Link href="/faq" className={`${textColor} font-medium`}>
        {language === "en" ? "FAQ" : "Preguntas Frecuentes"}
      </Link>
    </nav>
  )
}
