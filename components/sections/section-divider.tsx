import { cn } from "@/lib/utils"

export function SectionDivider() {
  return (
    <div className="flex justify-center items-center my-10 gap-3">
      <div
        className={
          "size-4 rounded-full bg-primary animate-bounce duration-1000 delay-100"
        }
      />
      <div
        className={
          "size-4 rounded-full bg-transparent border-2 border-primary animate-bounce duration-1000 delay-200"
        }
      />
      <div
        className={
          "size-4 rounded-full bg-primary animate-bounce duration-1000 delay-400"
        }
      />
    </div>
  )
}
