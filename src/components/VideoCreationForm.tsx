'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubCourseCombobox } from '@/components/SubCourseCombobox'
import { ArrowLeft, Loader2, CheckCircle, XCircle, MonitorPlay, FileText } from 'lucide-react'

interface SubCourse {
  id: string
  courseId: string
  name: string
  description: string
}

interface VideoData {
  subCourseId: string
  videoId: string
  title: string
  url: string
  order: number
  description?: string
  thumbnailUrl?: string
  duration?: number
  channelTitle?: string
  publishedAt?: string
  viewCount?: number
  tags?: string[]
  category?: string
}

interface VideoCreationFormProps {
  onBack?: () => void
}

export function VideoCreationForm({ onBack }: VideoCreationFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [subCourses, setSubCourses] = useState<SubCourse[]>([])
  const [formData, setFormData] = useState<VideoData>({
    subCourseId: '',
    videoId: '',
    title: '',
    url: '',
    order: 1
  })
  const [loading, setLoading] = useState(false)
  const [loadingSubCourses, setLoadingSubCourses] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [showJsonInput, setShowJsonInput] = useState(false)
  const [jsonImported, setJsonImported] = useState(false)

  const fetchSubCourses = async () => {
    try {
      setLoadingSubCourses(true)
      const token = localStorage.getItem('auth_token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      if (!token) {
        throw new Error('Token de autenticação não encontrado')
      }

      // Buscar todos os cursos primeiro
      const coursesResponse = await fetch('https://prisma-backend-production-4c22.up.railway.app/courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      })

      if (!coursesResponse.ok) {
        throw new Error(`Erro ao buscar cursos: ${coursesResponse.status}`)
      }

      const coursesData = await coursesResponse.json()
      if (!coursesData.success || !coursesData.data) {
        throw new Error('Nenhum curso encontrado')
      }

      // Buscar subcursos de cada curso
      const allSubCourses: SubCourse[] = []
      for (const course of coursesData.data) {
        try {
          const subCoursesResponse = await fetch(`https://prisma-backend-production-4c22.up.railway.app/courses/${course.id}/sub-courses`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include'
          })

          if (subCoursesResponse.ok) {
            const subCoursesData = await subCoursesResponse.json()
            if (subCoursesData.success && subCoursesData.data) {
              allSubCourses.push(...subCoursesData.data)
            }
          }
        } catch (err) {
          // Ignorar erros de subcursos individuais
        }
      }

      setSubCourses(allSubCourses)
    } catch (err) {
      setError('Erro ao carregar lista de subcursos')
    } finally {
      setLoadingSubCourses(false)
    }
  }

  useEffect(() => {
    fetchSubCourses()
  }, [])


  const handleInputChange = (field: keyof VideoData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError(null)
  }

  const handleJsonInput = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      let video

      // Verificar se é um array de vídeos
      if (parsed.videos && Array.isArray(parsed.videos) && parsed.videos.length > 0) {
        video = parsed.videos[0] // Pega o primeiro vídeo do array
      }
      // Verificar se é um objeto de vídeo único
      else if (parsed.title && parsed.url) {
        video = parsed
      }
      // Verificar se é um array direto de vídeos
      else if (Array.isArray(parsed) && parsed.length > 0) {
        video = parsed[0]
      }
      else {
        throw new Error('JSON deve conter um array "videos" ou um objeto de vídeo com title e url')
      }

      if (!video.title || !video.url) {
        throw new Error('Vídeo deve conter title e url')
      }

      // Extrair videoId da URL se não estiver presente
      let videoId = video.videoId

      if (!videoId && video.url) {
        const urlMatch = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
        if (urlMatch) {
          videoId = urlMatch[1]
        }
      }

      // Se ainda não tem videoId, tentar extrair de outras formas
      if (!videoId && video.url) {
        const patterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          /youtube\.com\/v\/([^&\n?#]+)/
        ]

        for (const pattern of patterns) {
          const match = video.url.match(pattern)
          if (match) {
            videoId = match[1]
            break
          }
        }
      }

      const newFormData = {
        ...formData,
        videoId: videoId || '',
        title: video.title || '',
        url: video.url || '',
        order: video.order || formData.order,
        description: video.description || '',
        thumbnailUrl: video.thumbnailUrl || '',
        duration: video.duration || 0,
        channelTitle: video.channelTitle || '',
        publishedAt: video.publishedAt || '',
        viewCount: video.viewCount || 0,
        tags: video.tags || [],
        category: video.category || ''
      }

      setFormData(newFormData)
      setShowJsonInput(false)
      setJsonInput('')
      setError(null)
      setJsonImported(true)
    } catch (err) {
      setError(`Erro ao processar JSON: ${err instanceof Error ? err.message : 'Formato inválido'}`)
    }
  }

  const extractVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return url // Se não conseguir extrair, retorna a URL original
  }

  const handleUrlChange = (url: string) => {
    const videoId = extractVideoId(url)
    setFormData(prev => ({
      ...prev,
      url,
      videoId
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.subCourseId) {
      return 'Selecione um subcurso'
    }

    // No modo JSON, título e URL são preenchidos automaticamente
    if (!showJsonInput) {
      if (!formData.title.trim()) {
        return 'Título do vídeo é obrigatório'
      }
      if (!formData.url.trim()) {
        return 'URL do vídeo é obrigatória'
      }
      if (!isValidYouTubeUrl(formData.url)) {
        return 'URL deve ser do YouTube válida'
      }
    } else {
      // No modo JSON, verificar se os dados foram importados
      if (!formData.title.trim()) {
        return 'Importe os dados do JSON primeiro'
      }
      if (!formData.url.trim()) {
        return 'Importe os dados do JSON primeiro'
      }
    }

    if (formData.order < 1) {
      return 'Ordem deve ser maior que 0'
    }
    return null
  }

  const isValidYouTubeUrl = (url: string): boolean => {
    const patterns = [
      /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/,
      /^https?:\/\/(www\.)?youtube\.com\/v\//
    ]

    return patterns.some(pattern => pattern.test(url))
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

      const requestBody = {
        videos: [{
          videoId: formData.videoId,
          title: formData.title.trim(),
          url: formData.url.trim(),
          order: formData.order,
          description: formData.description || null,
          thumbnailUrl: formData.thumbnailUrl || null,
          duration: formData.duration || null,
          channelTitle: formData.channelTitle || null,
          publishedAt: formData.publishedAt || null,
          viewCount: formData.viewCount || null,
          tags: formData.tags || null,
          category: formData.category || null
        }]
      }


      const response = await fetch(`https://prisma-backend-production-4c22.up.railway.app/courses/sub-courses/${formData.subCourseId}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao cadastrar vídeo: ${response.status}`)
      }

      const data = await response.json()


      if (data.success) {
        setSuccess(true)
        setFormData({
          subCourseId: '',
          videoId: '',
          title: '',
          url: '',
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
        throw new Error(data.message || 'Erro desconhecido ao cadastrar vídeo')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao cadastrar vídeo')
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Vídeos</h1>
          <p className="text-muted-foreground">Cadastrar novos vídeos no sistema</p>
        </div>

        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                Vídeo cadastrado com sucesso!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                O vídeo foi cadastrado e adicionado ao subcurso selecionado.
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

  if (loadingSubCourses) {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Vídeos</h1>
          <p className="text-muted-foreground">Carregando subcursos...</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando lista de subcursos...</p>
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Vídeos</h1>
        <p className="text-muted-foreground">Cadastrar novos vídeos no sistema</p>
      </div>

      <div className="max-w-4xl w-full mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MonitorPlay className="h-5 w-5" />
                  Novo Vídeo
                </CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para cadastrar um novo vídeo
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJsonInput(!showJsonInput)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {showJsonInput ? 'Modo Manual' : 'Importar JSON'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subCourseId">Subcurso *</Label>
                <SubCourseCombobox
                  subCourses={subCourses}
                  value={formData.subCourseId}
                  onValueChange={(value) => handleInputChange('subCourseId', value)}
                  placeholder="Selecione um subcurso"
                  error={!!(error && !formData.subCourseId)}
                />
              </div>

              {showJsonInput ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="jsonInput">JSON do Vídeo</Label>
                    <div className="space-y-2">
                      <textarea
                        id="jsonInput"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={`Cole aqui o JSON do vídeo:

Formatos aceitos:

1. Array de vídeos:
{
  "videos": [
    {
      "videoId": "aZLiNLvnzSE",
      "title": "RACIOCÍNIO LÓGICO MATEMÁTICO PARA CONCURSOS 2024",
      "description": "Aula completa de raciocínio lógico...",
      "url": "https://www.youtube.com/watch?v=aZLiNLvnzSE",
      "thumbnailUrl": "https://i.ytimg.com/vi/aZLiNLvnzSE/hqdefault.jpg",
      "duration": 3806,
      "channelTitle": "AlfaCon",
      "publishedAt": "2024-01-04T22:00:10Z",
      "viewCount": 127867,
      "tags": ["alfacon", "concurso publico", "aula gratuita"],
      "category": "27",
      "order": 1
    }
  ]
}

2. Objeto único:
{
  "videoId": "aZLiNLvnzSE",
  "title": "RACIOCÍNIO LÓGICO MATEMÁTICO PARA CONCURSOS 2024",
  "description": "Aula completa de raciocínio lógico...",
  "url": "https://www.youtube.com/watch?v=aZLiNLvnzSE",
  "thumbnailUrl": "https://i.ytimg.com/vi/aZLiNLvnzSE/hqdefault.jpg",
  "duration": 3806,
  "channelTitle": "AlfaCon",
  "publishedAt": "2024-01-04T22:00:10Z",
  "viewCount": 127867,
  "tags": ["alfacon", "concurso publico", "aula gratuita"],
  "category": "27",
  "order": 1
}

3. Array direto:
[
  {
    "videoId": "aZLiNLvnzSE",
    "title": "RACIOCÍNIO LÓGICO MATEMÁTICO PARA CONCURSOS 2024",
    "url": "https://www.youtube.com/watch?v=aZLiNLvnzSE",
    "order": 1
  }
]`}
                        className="w-full min-h-[120px] px-3 py-2 border border-input bg-background text-sm rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleJsonInput}
                          disabled={!jsonInput.trim()}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Importar Dados
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setJsonInput('')
                            setShowJsonInput(false)
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Mensagem de sucesso da importação */}
                  {jsonImported && (
                    <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <CheckCircle className="h-4 w-4" />
                          <p className="text-sm font-medium">Dados importados com sucesso!</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Campos preenchidos automaticamente - apenas para visualização */}
                  {formData.title && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm text-muted-foreground">Dados importados do JSON:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Título:</Label>
                            <p className="text-sm font-medium line-clamp-2">{formData.title}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">URL:</Label>
                            <p className="text-sm font-medium break-all">{formData.url}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Video ID:</Label>
                            <p className="text-sm font-medium">{formData.videoId}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Canal:</Label>
                            <p className="text-sm font-medium">{formData.channelTitle || 'N/A'}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Duração:</Label>
                            <p className="text-sm font-medium">
                              {formData.duration ? `${Math.floor(formData.duration / 60)}:${(formData.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Visualizações:</Label>
                            <p className="text-sm font-medium">
                              {formData.viewCount ? formData.viewCount.toLocaleString('pt-BR') : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Publicado em:</Label>
                            <p className="text-sm font-medium">
                              {formData.publishedAt ? new Date(formData.publishedAt).toLocaleDateString('pt-BR') : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Categoria:</Label>
                            <p className="text-sm font-medium">{formData.category || 'N/A'}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Thumbnail:</Label>
                            <p className="text-sm font-medium">
                              {formData.thumbnailUrl ? (
                                <a href={formData.thumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  Ver imagem
                                </a>
                              ) : 'N/A'}
                            </p>
                          </div>
                          {formData.tags && formData.tags.length > 0 && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Tags:</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {formData.tags.slice(0, 5).map((tag, index) => (
                                  <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                    {tag}
                                  </span>
                                ))}
                                {formData.tags.length > 5 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{formData.tags.length - 5} mais
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {formData.description && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Descrição:</Label>
                          <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                            {formData.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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
                      Ordem de exibição do vídeo dentro do subcurso
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Vídeo *</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Ex: Concurso PRF 2024 - Aula de Língua Portuguesa"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={error && !formData.title.trim() ? 'border-red-500' : ''}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="url">URL do YouTube *</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=DsAJ18o6sco"
                        value={formData.url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className={error && (!formData.url.trim() || !isValidYouTubeUrl(formData.url)) ? 'border-red-500' : ''}
                      />
                      <p className="text-xs text-muted-foreground">
                        Cole a URL completa do vídeo do YouTube
                      </p>
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
                        Ordem de exibição do vídeo dentro do subcurso
                      </p>
                    </div>
                  </div>
                </>
              )}

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
                      <MonitorPlay className="h-4 w-4" />
                      Cadastrar Vídeo
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
