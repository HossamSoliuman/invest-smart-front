// InputWithError.tsx

import { InputHTMLAttributes, forwardRef } from "react"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputWithErrorProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
}

const InputWithError = forwardRef<HTMLInputElement, InputWithErrorProps>(
  ({ label, error, className, ...props }, ref) => {
    const { lang } = useTranslation()

    return (
      <div className={clsx("flex gap-4 w-full justify-between", className)}>
        <Label
          htmlFor={props.id}
          className={clsx(
            "max-sm:!text-xs pt-3 w-[100px] sm:w-[150px]",
            lang === "en" ? "text-left" : "text-right"
          )}
        >
          {label}
        </Label>
        <div className="flex flex-col gap-2 w-full">
          <Input className="max-sm:!text-xs" ref={ref} {...props} />
          {error && (
            <p className="text-red-600 text-[10px]">
              {error.message as string}
            </p>
          )}
        </div>
      </div>
    )
  }
)

InputWithError.displayName = "InputWithError"

export default InputWithError
