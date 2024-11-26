import { UserEditFormData } from "@/pages/settings"
import axios from "axios"

import { siteConfig } from "@/config/site"
import { LoginFormDataSchemaType } from "@/components/auth/login-form-dialog"
import { RegisterFormDataSchemaType } from "@/components/auth/register-form-dialog"

const api = axios.create({
  baseURL: siteConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = (data: RegisterFormDataSchemaType) =>
  api.post("/register", data)
export const loginUser = (data: LoginFormDataSchemaType) =>
  api.post("/login", data)
export const logoutUser = (token: string) =>
  api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

export const emailVerificationSend = (token: string, recaptcha: string) =>
  api.post(
    "/auth/verify/send",
    {
      recaptcha,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

export const emailVerificationCheck = (
  token: string,
  code: string,
  recaptcha: string
) =>
  api.post(
    "/auth/verify/check",
    {
      code,
      recaptcha,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

export const contactUs = (
  name: string,
  email: string,
  phone: string,
  country: string,
  amount_of_invest: number,
  recaptcha: string
) =>
  api.post("/contact-us", {
    name,
    email,
    phone,
    country,
    amount_of_invest,
    recaptcha,
  })

export const getUser = (token: string) =>
  api.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const getTransactions = (
  token: string,
  page: number = 1,
  perPage: number = 10
) =>
  api.get(`/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      per_page: perPage,
    },
  })

export const depositAmount = (
  amount: number,
  address: string,
  imgFile: File,
  currency: string,
  token: string
) => {
  const formData = new FormData()
  formData.append("amount", amount.toString())
  formData.append("address", address)
  formData.append("img", imgFile)
  formData.append("currency", currency)

  return api.post("/deposit", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

export const withdrawAmount = (
  amount: number,
  address: string,
  currency: string,
  token: string
) =>
  api.post(
    "/withdraw",
    {
      amount,
      address,
      currency,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

export const updateUser = (data: UserEditFormData) => {
  const token = localStorage.getItem("userToken")
  return api.post("/auth/update", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const supportMissage = (message: string, token: string) =>
  api.post(
    "/support",
    {
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

export const gitSupportMissages = (token: string) =>
  api.get("/tickets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export default api
