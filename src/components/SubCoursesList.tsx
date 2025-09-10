'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, BookOpen, Calendar, Hash, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SubCourse {
    id: string
    courseId: string
    name: string
    description: string
    order: number
    createdAt: string
    updatedAt: string
}

interface SubCoursesResponse {
    success: boolean
    data: SubCourse[]
}

interface SubCoursesListProps {
    courseId: string
    courseName: string
}

export function SubCoursesList({ courseId, courseName }: SubCoursesListProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [subCourses, setSubCourses] = useState<SubCourse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSubCourses = async () => {
        try {
            setLoading(true)
            setError(null)

            // Obter token do localStorage ou cookie
            const token = localStorage.getItem('auth_token') || document.cookie
                .split('; ')
                .find(row => row.startsWith('auth_token='))
                ?.split('=')[1]

            if (!token) {
                throw new Error('Token de autenticação não encontrado')
            }

            const response = await fetch(`https://prisma-backend-production-4c22.up.railway.app/courses/${courseId}/sub-courses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`Erro ao buscar subcursos: ${response.status}`)
            }

            const data: SubCoursesResponse = await response.json()

            if (data.success && data.data) {
                setSubCourses(data.data)
            } else {
                throw new Error('Resposta inválida da API')
            }
        } catch (err) {
            console.error('Erro ao buscar subcursos:', err)
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubCourses()
    }, [courseId])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleSubCourseClick = (subCourseId: string) => {
        router.push(`/courses/${courseId}/subcourses/${subCourseId}/videos`)
    }

    if (loading) {
        return (
            <div className="p-4">
                <div className="mb-6">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Subcursos - {courseName}</h1>
                    <p className="text-muted-foreground">Gerencie os subcursos deste curso</p>
                </div>
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-destructive mb-4">{error}</p>
                            <Button onClick={fetchSubCourses} variant="outline">
                                Tentar Novamente
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/courses')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar aos Cursos
                    </Button>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Subcursos - {courseName}</h1>
                <p className="text-muted-foreground">Gerencie os subcursos deste curso</p>
            </div>

            <div className="mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                    {subCourses.length} subcurso{subCourses.length !== 1 ? 's' : ''} encontrado{subCourses.length !== 1 ? 's' : ''}
                </span>
            </div>

            {subCourses.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nenhum subcurso encontrado</h3>
                            <p className="text-muted-foreground">
                                Não há subcursos cadastrados para este curso
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subCourses.map((subCourse) => (
                        <Card
                            key={subCourse.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer hover:bg-accent/50"
                            onClick={() => handleSubCourseClick(subCourse.id)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{subCourse.name}</CardTitle>
                                        <CardDescription className="mt-2">
                                            {subCourse.description}
                                        </CardDescription>
                                    </div>
                                    <div className="ml-4 flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Hash className="h-4 w-4" />
                                            <span>{subCourse.order}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Criado em {formatDate(subCourse.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Atualizado em {formatDate(subCourse.updatedAt)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
