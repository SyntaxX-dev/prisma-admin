'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface CourseData {
    name: string
    description: string
    imageUrl: string
}

interface CourseCreationFormProps {
    onBack?: () => void
}

export function CourseCreationForm({ onBack }: CourseCreationFormProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [formData, setFormData] = useState<CourseData>({
        name: '',
        description: '',
        imageUrl: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleInputChange = (field: keyof CourseData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Limpar mensagens de erro quando o usuário começar a digitar
        if (error) setError(null)
    }

    const validateForm = (): string | null => {
        if (!formData.name.trim()) {
            return 'Nome do curso é obrigatório'
        }
        if (!formData.description.trim()) {
            return 'Descrição do curso é obrigatória'
        }
        if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
            return 'URL da imagem deve ser válida'
        }
        return null
    }

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
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

            // Obter token do localStorage ou cookie
            const token = localStorage.getItem('auth_token') || document.cookie
                .split('; ')
                .find(row => row.startsWith('auth_token='))
                ?.split('=')[1]

            if (!token) {
                throw new Error('Token de autenticação não encontrado')
            }

            const response = await fetch('https://prisma-backend-production-4c22.up.railway.app/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    imageUrl: formData.imageUrl.trim() || null
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Erro ao criar curso: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                setSuccess(true)
                // Limpar formulário após sucesso
                setFormData({
                    name: '',
                    description: '',
                    imageUrl: ''
                })
                // Redirecionar para a lista de cursos após 2 segundos
                setTimeout(() => {
                    router.push('/courses')
                }, 2000)
            } else {
                throw new Error(data.message || 'Erro desconhecido ao criar curso')
            }
        } catch (err) {
            console.error('Erro ao criar curso:', err)
            setError(err instanceof Error ? err.message : 'Erro desconhecido ao criar curso')
        } finally {
            setLoading(false)
        }
    }

    const handleBackToCourses = () => {
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
                        onClick={handleBackToCourses}
                        className="flex items-center gap-2 cursor-pointer mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar aos Cursos
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Cursos</h1>
                    <p className="text-muted-foreground">Criar novos cursos no sistema</p>
                </div>

                <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                                Curso criado com sucesso!
                            </h3>
                            <p className="text-green-700 dark:text-green-300 mb-4">
                                O curso foi criado e adicionado ao sistema.
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Redirecionando para a lista de cursos...
                            </p>
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
                    onClick={handleBackToCourses}
                    className="flex items-center gap-2 cursor-pointer mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar aos Cursos
                </Button>
                <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Cursos</h1>
                <p className="text-muted-foreground">Criar novos cursos no sistema</p>
            </div>

            <div className="max-w-4xl w-full mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Novo Curso
                        </CardTitle>
                        <CardDescription>
                            Preencha os dados abaixo para criar um novo curso
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome do Curso *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Ex: PRF, Polícia Rodoviária Federal"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={error && !formData.name.trim() ? 'border-red-500' : ''}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="imageUrl">URL da Imagem (Opcional)</Label>
                                    <Input
                                        id="imageUrl"
                                        type="url"
                                        placeholder="https://exemplo.com/imagem.png"
                                        value={formData.imageUrl}
                                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                                        className={error && formData.imageUrl && !isValidUrl(formData.imageUrl) ? 'border-red-500' : ''}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        URL da imagem que será exibida como capa do curso
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição *</Label>
                                <textarea
                                    id="description"
                                    placeholder="Descreva o curso e seus objetivos..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className={`flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error && !formData.description.trim() ? 'border-red-500' : ''
                                        }`}
                                />
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
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Criar Curso
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBackToCourses}
                                    disabled={loading}
                                    className='cursor-pointer'
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
