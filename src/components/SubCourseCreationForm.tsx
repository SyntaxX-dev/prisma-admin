'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CourseCombobox } from '@/components/CourseCombobox'
import { ArrowLeft, Loader2, CheckCircle, XCircle, Clapperboard } from 'lucide-react'

interface Course {
    id: string
    name: string
    description: string
    imageUrl?: string
}

interface SubCourseData {
    courseId: string
    name: string
    description: string
    order: number
}

interface SubCourseCreationFormProps {
    onBack?: () => void
}

export function SubCourseCreationForm({ onBack }: SubCourseCreationFormProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [courses, setCourses] = useState<Course[]>([])
    const [formData, setFormData] = useState<SubCourseData>({
        courseId: '',
        name: '',
        description: '',
        order: 1
    })
    const [loading, setLoading] = useState(false)
    const [loadingCourses, setLoadingCourses] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true)
            const token = localStorage.getItem('auth_token') || document.cookie
                .split('; ')
                .find(row => row.startsWith('auth_token='))
                ?.split('=')[1]

            if (!token) {
                throw new Error('Token de autenticação não encontrado')
            }

            const response = await fetch('https://prisma-backend-production-4c22.up.railway.app/courses', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`Erro ao buscar cursos: ${response.status}`)
            }

            const data = await response.json()
            if (data.success && data.data) {
                setCourses(data.data)
            } else {
                throw new Error('Nenhum curso encontrado')
            }
        } catch (err) {
            setError('Erro ao carregar lista de cursos')
        } finally {
            setLoadingCourses(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    const handleInputChange = (field: keyof SubCourseData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        if (error) setError(null)
    }

    const validateForm = (): string | null => {
        if (!formData.courseId) {
            return 'Selecione um curso'
        }
        if (!formData.name.trim()) {
            return 'Nome do subcurso é obrigatório'
        }
        if (!formData.description.trim()) {
            return 'Descrição do subcurso é obrigatória'
        }
        if (formData.order < 1) {
            return 'Ordem deve ser maior que 0'
        }
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem('auth_token') || document.cookie
                .split('; ')
                .find(row => row.startsWith('auth_token='))
                ?.split('=')[1]

            if (!token) {
                throw new Error('Token de autenticação não encontrado')
            }

            const response = await fetch(`https://prisma-backend-production-4c22.up.railway.app/courses/${formData.courseId}/sub-courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    order: formData.order
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Erro ao cadastrar subcurso: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                setSuccess(true)
                setFormData({
                    courseId: '',
                    name: '',
                    description: '',
                    order: 1
                })
                setTimeout(() => {
                    if (onBack) {
                        onBack()
                    } else {
                        router.push('/courses')
                    }
                }, 2000)
            } else {
                throw new Error(data.message || 'Erro desconhecido ao cadastrar subcurso')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido ao cadastrar subcurso')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            router.push('/courses')
        }
    }

    if (success) {
        return (
            <div className="p-4">
                <div className="mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBack}
                        className="flex items-center gap-2 cursor-pointer mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Subcursos</h1>
                    <p className="text-muted-foreground">Cadastrar novos subcursos no sistema</p>
                </div>

                <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                                Subcurso cadastrado com sucesso!
                            </h3>
                            <p className="text-green-700 dark:text-green-300 mb-4">
                                O subcurso foi cadastrado e adicionado ao curso selecionado.
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Redirecionando...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (loadingCourses) {
        return (
            <div className="p-4">
                <div className="mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBack}
                        className="flex items-center gap-2 cursor-pointer mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Subcursos</h1>
                    <p className="text-muted-foreground">Carregando cursos...</p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Carregando lista de cursos...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    className="flex items-center gap-2 cursor-pointer mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
                <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Subcursos</h1>
                <p className="text-muted-foreground">Cadastrar novos subcursos no sistema</p>
            </div>

            <div className="max-w-4xl w-full mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clapperboard className="h-5 w-5" />
                            Novo Subcurso
                        </CardTitle>
                        <CardDescription>
                            Preencha os dados abaixo para cadastrar um novo subcurso
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="courseId">Curso *</Label>
                                <CourseCombobox
                                    courses={courses}
                                    value={formData.courseId}
                                    onValueChange={(value) => handleInputChange('courseId', value)}
                                    placeholder="Selecione um curso"
                                    error={!!(error && !formData.courseId)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Subcurso *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Ex: Língua Portuguesa - Módulo 1"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={error && !formData.name.trim() ? 'border-red-500' : ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Descreva o conteúdo e objetivos deste subcurso..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className={error && !formData.description.trim() ? 'border-red-500' : ''}
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Ordem *</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    value={formData.order}
                                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                                    className={error && formData.order < 1 ? 'border-red-500' : ''}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Ordem de exibição do subcurso dentro do curso
                                </p>
                            </div>

                            {error && (
                                <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                                            <XCircle className="h-4 w-4" />
                                            <span className="text-sm">{error}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Cadastrando...
                                        </>
                                    ) : (
                                        <>
                                            <Clapperboard className="h-4 w-4" />
                                            Cadastrar Subcurso
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
