"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { demoEmployees, type Employee } from "./demo-data"

interface AuthContextType {
  user: Employee | null
  login: (employeeCode: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("nccaims-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    } else {
      // Auto-login with first active employee
      const defaultUser = demoEmployees.find((emp) => emp.status === "active")
      if (defaultUser) {
        setUser(defaultUser)
        setIsAuthenticated(true)
        localStorage.setItem("nccaims-user", JSON.stringify(defaultUser))
      }
    }
  }, [])

  const login = (employeeCode: string, password: string): boolean => {
    // Demo authentication - accept any password for demo purposes
    const employee = demoEmployees.find((emp) => emp.employeeCode === employeeCode && emp.status === "active")

    if (employee) {
      setUser(employee)
      setIsAuthenticated(true)
      localStorage.setItem("nccaims-user", JSON.stringify(employee))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("nccaims-user")
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
