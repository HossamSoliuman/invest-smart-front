import { getUser } from "@/services/api"

async function checkToken(token: string): Promise<boolean> {
  try {
    const response = await getUser(token)
    return response.status === 200
  } catch (error) {
    return false
  }
}

export const isAuthenticated = async (): Promise<boolean> => {
  const token = localStorage.getItem("userToken")
  if (!token) return false
  return await checkToken(token)
}
