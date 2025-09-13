'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Video, Play, Eye, Calendar, User, Tag, Clock, Copy, Check } from 'lucide-react'

interface VideoDetails {
    videoId: string
    title: string
    description: string
    url: string
    thumbnailUrl: string
    duration: number
    channelTitle: string
    publishedAt: string
    viewCount: number
    tags: string[]
    category: string
}

export function VideoDetailsForm() {
    const [videoId, setVideoId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [video, setVideo] = useState<VideoDetails | null>(null)
    const [error, setError] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setVideo(null)

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setError('Token de autenticação não encontrado')
                return
            }

            const response = await fetch(`https://prisma-backend-production-4c22.up.railway.app/youtube/video/${videoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setVideo(data)
            } else {
                const errorData = await response.json()
                setError(errorData.message || 'Erro ao obter detalhes do vídeo')
            }
        } catch (error) {
            console.error('Erro na requisição:', error)
            setError('Erro de comunicação com o servidor')
        } finally {
            setIsLoading(false)
        }
    }

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const formatViewCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`
        }
        return count.toString()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(text)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Erro ao copiar:', err)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Video className="h-5 w-5" />
                        <span>Detalhes do Vídeo</span>
                    </CardTitle>
                    <CardDescription>
                        Digite o ID do vídeo para obter informações detalhadas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="videoId">ID do Vídeo *</Label>
                            <Input
                                id="videoId"
                                value={videoId}
                                onChange={(e) => setVideoId(e.target.value)}
                                placeholder="Ex: dQw4w9WgXcQ"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                O ID do vídeo pode ser encontrado na URL do YouTube (após v=)
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <Video className="mr-2 h-4 w-4" />
                                    Obter Detalhes
                                </>
                            )}
                        </Button>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                                {error}
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {video && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Vídeo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold">{video.title}</h2>
                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                        {video.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>Canal</span>
                                        </div>
                                        <p className="font-medium">{video.channelTitle}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Eye className="h-4 w-4" />
                                            <span>Visualizações</span>
                                        </div>
                                        <p className="font-medium">{formatViewCount(video.viewCount)}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>Duração</span>
                                        </div>
                                        <p className="font-medium">{formatDuration(video.duration)}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>Publicado</span>
                                        </div>
                                        <p className="font-medium">{formatDate(video.publishedAt)}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Tag className="h-4 w-4" />
                                        <span>Categoria</span>
                                    </div>
                                    <p className="font-medium">{video.category}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Tag className="h-4 w-4" />
                                        <span>Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(video.tags || []).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Video className="h-4 w-4" />
                                        <span>ID do Vídeo</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1">
                                            {video.videoId}
                                        </code>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => copyToClipboard(video.videoId)}
                                            className="h-8 px-3"
                                        >
                                            {copiedId === video.videoId ? (
                                                <>
                                                    <Check className="h-4 w-4 mr-1 text-green-500" />
                                                    Copiado!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4 mr-1" />
                                                    Copiar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button asChild className="w-full">
                                        <a
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center space-x-2"
                                        >
                                            <Play className="h-4 w-4" />
                                            <span>Assistir no YouTube</span>
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
