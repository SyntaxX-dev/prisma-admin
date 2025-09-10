'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, BarChart3, Users, Activity } from 'lucide-react'

export default function Dashboard() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 bg-background min-h-[calc(100vh-4rem)]">
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Visão geral do sistema administrativo
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Usuários
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Vendas
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R$ 45,231</div>
                            <p className="text-xs text-muted-foreground">
                                +15.3% em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Configurações
                            </CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                Configurações ativas
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Atividade Recente</CardTitle>
                            <CardDescription>
                                Últimas ações realizadas no sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">
                                            Login realizado com sucesso
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date().toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">
                                            Dashboard carregado
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date().toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Estatísticas Rápidas</CardTitle>
                            <CardDescription>
                                Resumo das principais métricas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Sessões Ativas</span>
                                    <span className="text-2xl font-bold">42</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Uptime</span>
                                    <span className="text-2xl font-bold">99.9%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Alertas</span>
                                    <span className="text-2xl font-bold text-green-600">0</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
