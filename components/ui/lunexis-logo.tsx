import Image from "next/image"

interface LunexisLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showText?: boolean
}

export function LunexisLogo({ size = "md", className = "", showText = true }: LunexisLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Image
          src="/images/lunexis-logo.png"
          alt="LUNEXIS"
          width={96}
          height={96}
          className={`${sizeClasses[size]} object-contain`}
          priority
        />
        {/* Subtle glow effect */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-full blur-lg -z-10`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1
            className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide`}
          >
            LUNEXIS
          </h1>
          {size === "xl" && <p className="text-sm text-slate-400 tracking-widest uppercase">Social Universe</p>}
        </div>
      )}
    </div>
  )
}
