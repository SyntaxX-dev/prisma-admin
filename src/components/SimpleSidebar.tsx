'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, User, Settings, BarChart3, Users, Home, Shield, Database, FileText, Bell, Menu, ChevronLeft, TvMinimal, Clapperboard, MonitorPlay, MonitorCog } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface SimpleSidebarProps {
    isCollapsed: boolean
    onToggle: () => void
}

export function SimpleSidebar({ isCollapsed, onToggle }: SimpleSidebarProps) {
    const { user, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className={`bg-sidebar text-sidebar-foreground transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
            } h-screen fixed left-0 top-0 z-50 border-r border-sidebar-border flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Shield className="h-4 w-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Sistema Admin</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    Painel Administrativo
                                </span>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="h-8 w-8 cursor-pointer"
                    >
                        {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 overflow-hidden">
                <div className="h-full flex flex-col">
                    {/* Navegação */}
                    <div className="flex-1">
                        <div className="space-y-6">
                            <div>
                                {!isCollapsed && (
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                        Navegação
                                    </h3>
                                )}
                                <nav className="space-y-1">
                                    <Button
                                        variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
                                        className={`w-full justify-start cursor-pointer ${isCollapsed ? 'px-2' : 'px-3'}`}
                                        size="sm"
                                        onClick={() => router.push('/dashboard')}
                                    >
                                        <Home className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Dashboard</span>}
                                    </Button>
                                    <Button
                                        variant={pathname === '/courses' ? 'secondary' : 'ghost'}
                                        className={`w-full justify-start cursor-pointer ${isCollapsed ? 'px-2' : 'px-3'}`}
                                        size="sm"
                                        onClick={() => router.push('/courses')}
                                    >
                                        <TvMinimal className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Cursos</span>}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start cursor-pointer ${isCollapsed ? 'px-2' : 'px-3'}`}
                                        size="sm"
                                        onClick={() => router.push('/registrations')}
                                    >
                                        <MonitorCog className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Cadastros</span>}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start cursor-pointer ${isCollapsed ? 'px-2' : 'px-3'}`}
                                        size="sm"
                                        onClick={() => router.push('/users')}
                                    >
                                        <Users className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Usuários</span>}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start cursor-pointer ${isCollapsed ? 'px-2' : 'px-3'}`}
                                        size="sm"
                                        onClick={() => router.push('/data')}
                                    >
                                        <Database className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Dados</span>}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start cursor-pointer ${isCollapsed ? 'px-2' : 'px-3'}`}
                                        size="sm"
                                        onClick={() => router.push('/reports')}
                                    >
                                        <FileText className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Relatórios</span>}
                                    </Button>
                                </nav>
                            </div>

                            <div>
                                {!isCollapsed && (
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                        Configurações
                                    </h3>
                                )}
                                <nav className="space-y-1">
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start cursor-pointer ${isCollapsed ? 'px-2' : 'px-3'}`}
                                        size="sm"
                                    >
                                        <Settings className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Configurações</span>}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start cursor-pointer ${isCollapsed ? 'px-2' : 'px-3'}`}
                                        size="sm"
                                    >
                                        <Bell className="h-4 w-4" />
                                        {!isCollapsed && <span className="ml-2">Notificações</span>}
                                    </Button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-sidebar-border">
                        <div className="space-y-2">
                            {!isCollapsed && (
                                <div className="flex items-center gap-2 px-2 py-1.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.nome}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {user?.perfil}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
                                size="sm"
                                onClick={logout}
                            >
                                <LogOut className="h-4 w-4" />
                                {!isCollapsed && <span className="ml-2 cursor-pointer">Sair</span>}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
