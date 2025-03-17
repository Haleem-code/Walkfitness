export const SONIC_NETWORK = "https://api.testnet.sonic.game"
// In client components, we can only access environment variables starting with NEXT_PUBLIC_
// For now, let's use the base URL directly
export const APP_URL = String(process.env.NEXT_PUBLIC_APP_URL) || "https://walkfit.vercel.app"