'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { SimpleSidebar } from '@/components/SimpleSidebar'
import { ThemeToggle } from '@/components/ThemeToggle'

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const pathname = usePathname()

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    // Se for a página de login, não mostrar a sidebar
    if (pathname === '/') {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <SimpleSidebar
                isCollapsed={sidebarCollapsed}
                onToggle={toggleSidebar}
            />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'
                    }`}
            >
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <div className="flex items-center gap-2 ml-auto">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex flex-1 flex-col bg-background min-h-[calc(100vh-4rem)]">
                    {children}
                </div>
            </div>
        </div>
    )
}
