import { redirect } from "next/navigation"
import AdminPanel from "@/components/admin-panel"
import { isAuthenticatedAdmin } from "@/lib/auth-guard"

export const metadata = {
  title: "Yönetim Paneli | CD ABROAD",
  description: "CD ABROAD web sitesi içerik yönetim paneli",
}

export default async function AdminPage() {
  const isAuth = await isAuthenticatedAdmin()
  if (!isAuth) {
    redirect("/auth/login")
  }

  return <AdminPanel />
}
