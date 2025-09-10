'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
    id: string
    email: string
    nome: string
    perfil: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const validateToken = async () => {
            let token = localStorage.getItem('auth_token')

            if (!token) {
                const cookies = document.cookie.split(';')
                const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='))
                if (authCookie) {
                    token = authCookie.split('=')[1]
                }
            }

            if (!token) {
                console.log('Nenhum token encontrado')
                setIsLoading(false)
                return
            }

            console.log('Token encontrado, validando...')

            try {
                const response = await fetch('https://prisma-backend-production-4c22.up.railway.app/auth/validate', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                console.log('Response status:', response.status)

                if (response.ok) {
                    const data = await response.json()
                    console.log('Dados do usuário:', data)
                    
                    // Verificar se o usuário é administrador
                    if (data.user && data.user.perfil === 'ADMINISTRADOR') {
                        setUser({
                            id: data.user.id,
                            email: data.user.email,
                            nome: data.user.nome,
                            perfil: data.user.perfil
                        })
                        console.log('Usuário autenticado com sucesso')
                    } else {
                        console.log('Usuário não é administrador')
                        // Se não for administrador, deslogar
                        localStorage.removeItem('auth_token')
                        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                        setUser(null)
                    }
                } else if (response.status === 401) {
                    // Token expirado ou inválido
                    console.log('Token inválido ou expirado')
                    localStorage.removeItem('auth_token')
                    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    setUser(null)
                } else {
                    // Outros erros do servidor - não deslogar automaticamente
                    console.log('Erro do servidor na validação, mantendo sessão local')
                    
                    // Tentar decodificar o JWT para obter informações básicas
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]))
                        console.log('Payload do token:', payload)
                        
                        // Verificar se o token não expirou
                        if (payload.exp && payload.exp * 1000 > Date.now()) {
                            // Token ainda válido, manter usuário logado
                            setUser({
                                id: payload.sub || '1',
                                email: payload.email || 'admin@admin.com',
                                nome: 'Administrador',
                                perfil: 'ADMINISTRADOR'
                            })
                            console.log('Mantendo sessão baseada no token local')
                        } else {
                            console.log('Token expirado localmente')
                            localStorage.removeItem('auth_token')
                            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                            setUser(null)
                        }
                    } catch (decodeError) {
                        console.error('Erro ao decodificar token:', decodeError)
                        localStorage.removeItem('auth_token')
                        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                        setUser(null)
                    }
                }
            } catch (error) {
                console.error('Erro na requisição de validação:', error)
                
                // Se houve erro de rede, tentar manter a sessão baseada no token local
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]))
                    console.log('API indisponível, verificando token local:', payload)
                    
                    // Verificar se o token não expirou
                    if (payload.exp && payload.exp * 1000 > Date.now()) {
                        // Token ainda válido, manter usuário logado
                        setUser({
                            id: payload.sub || '1',
                            email: payload.email || 'admin@admin.com',
                            nome: 'Administrador',
                            perfil: 'ADMINISTRADOR'
                        })
                        console.log('Mantendo sessão local devido à indisponibilidade da API')
                    } else {
                        console.log('Token expirado')
                        localStorage.removeItem('auth_token')
                        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                        setUser(null)
                    }
                } catch (decodeError) {
                    console.error('Erro ao decodificar token offline:', decodeError)
                    // Se não conseguir decodificar, remover token inválido
                    localStorage.removeItem('auth_token')
                    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    setUser(null)
                }
            } finally {
                setIsLoading(false)
            }
        }

        validateToken()
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true)
            console.log('Tentando fazer login...')

            const response = await fetch('https://prisma-backend-production-4c22.up.railway.app/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            console.log('Response do login:', response.status)

            if (response.ok) {
                const data = await response.json()
                console.log('Dados do login:', data)

                // Verificar se o usuário é administrador
                if (data.user.perfil !== 'ADMINISTRADOR') {
                    console.log('Usuário não é administrador')
                    return false
                }

                // Salvar o accessToken correto
                localStorage.setItem('auth_token', data.accessToken)
                document.cookie = `auth_token=${data.accessToken}; path=/; max-age=86400; secure; samesite=strict`

                setUser({
                    id: data.user.id,
                    email: data.user.email,
                    nome: data.user.nome,
                    perfil: data.user.perfil
                })

                console.log('Login realizado com sucesso')
                return true
            } else {
                const errorData = await response.json()
                console.error('Erro no login:', errorData.message)
                return false
            }
        } catch (error) {
            console.error('Erro na requisição de login:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        console.log('Fazendo logout...')
        localStorage.removeItem('auth_token')
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        setUser(null)
    }

    const isAuthenticated = !!user && user.perfil === 'ADMINISTRADOR'

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}
