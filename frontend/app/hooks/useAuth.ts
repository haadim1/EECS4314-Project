'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/api/axios'

interface AuthResult {
  loading: boolean
  isAuthenticated: boolean
  role: string | null
}

export default function useAuth(redirect: boolean = false): AuthResult {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/auth/test', {
          withCredentials: true,
        })

        const userRole = res.data?.role || 'client'
        setIsAuthenticated(true)
        setRole(userRole)

        if (redirect) {
          if (userRole === 'barber') {
            router.push('/dashboard')
          } else {
            router.push('/booking')
          }
        }
      } catch (err) {
        setIsAuthenticated(false)
        setRole(null)
        if (redirect) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, redirect])

  return { loading, isAuthenticated, role }
}