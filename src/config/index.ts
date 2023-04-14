import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT || 4000
export const POSTGRES_URL = process.env.POSTGRES_URL || ""
export const JWT_SECRET_KET = process.env.JWT_SECRET_KET || ""
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ""
export const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || ""
