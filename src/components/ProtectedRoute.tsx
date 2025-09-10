'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, ShieldX } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Redirecionar imediatamente para a página de login
            router.replace('/')
        }
    }, [isAuthenticated, isLoading, router])

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
                </div>
            </div>
        )
    }

    // Se não estiver autenticado, mostrar mensagem de acesso negado
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <ShieldX className="h-16 w-16 text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold text-gray-900">Acesso Negado</h1>
                    <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
                    <p className="text-sm text-gray-500">Redirecionando para o login...</p>
                </div>
            </div>
        )
    }

    // Se estiver autenticado, renderizar o conteúdo
    return <>{children}</>
}
