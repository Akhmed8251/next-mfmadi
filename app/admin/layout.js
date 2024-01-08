"use client"

import HeaderAdmin from "@/components/admin/HeaderAdmin";
import Sidebar from "@/components/ui/Sidebar";
import '@/assets/css/admin.css'
import getLocalStorage from "@/storage";
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
    const router = useRouter()
    const { isAuth } = getLocalStorage()
    if (!isAuth) {
        router.push("/login")
    }
    
    return (
        <>
            <HeaderAdmin />
            <main style={{ backgroundColor: "#f9fbfb" }}>
            <div className="admin-wrapper">
                <Sidebar />
                {children}
            </div>
            </main>
        </>

    )
  }
  