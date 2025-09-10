'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Play, Clock, Eye, Hash, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Video {
    id: string
    subCourseId: string
    videoId: string
    title: string
    url: string
    thumbnailUrl: string
    duration: number
    channelTitle: string
    viewCount: number
    order: number
}

interface VideosResponse {
    success: boolean
    data: Video[]
}

interface VideosListProps {
    subCourseId: string
    subCourseName: string
    courseName: string
}

export function VideosList({ subCourseId, subCourseName, courseName }: VideosListProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVideos = async () => {
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

            const response = await fetch(`https://prisma-backend-production-4c22.up.railway.app/courses/sub-courses/${subCourseId}/videos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`Erro ao buscar vídeos: ${response.status}`)
            }

            const data: VideosResponse = await response.json()

            if (data.success && data.data) {
                setVideos(data.data)
            } else {
                throw new Error('Resposta inválida da API')
            }
        } catch (err) {
            console.error('Erro ao buscar vídeos:', err)
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVideos()
    }, [subCourseId])

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        }
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const formatViewCount = (count: number | null | undefined) => {
        if (!count || count === 0) {
            return '0'
        }
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`
        }
        return count.toString()
    }

    const handleVideoClick = (video: Video) => {
        window.open(video.url, '_blank')
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
                                <Skeleton className="h-48 w-full mb-4" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Vídeos - {subCourseName}</h1>
                    <p className="text-muted-foreground">Assista aos vídeos deste subcurso</p>
                </div>
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-destructive mb-4">{error}</p>
                            <Button onClick={fetchVideos} variant="outline">
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Vídeos - {subCourseName}</h1>
                <p className="text-muted-foreground">Assista aos vídeos deste subcurso</p>
            </div>

            <div className="mb-6 flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                    {videos.length} vídeo{videos.length !== 1 ? 's' : ''} encontrado{videos.length !== 1 ? 's' : ''}
                </span>
            </div>

            {videos.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nenhum vídeo encontrado</h3>
                            <p className="text-muted-foreground">
                                Não há vídeos cadastrados para este subcurso
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className="bg-card text-card-foreground rounded-lg border shadow-sm hover:shadow-lg transition-shadow cursor-pointer hover:bg-accent/50 overflow-hidden"
                            onClick={() => handleVideoClick(video)}
                        >
                            <div className="relative">
                                <img
                                    src={video.thumbnailUrl || '/placeholder-video.jpg'}
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        // Fallback para uma imagem padrão se a thumbnail falhar
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTE4NSAxMDBMMjE1IDEyMEwxODUgMTQwVjEwMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkE1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk7Do28gZGlzcG9uw612ZWw8L3RleHQ+Cjwvc3ZnPgo=';
                                    }}
                                />
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                    {formatDuration(video.duration)}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                    <Play className="h-12 w-12 text-white" />
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="space-y-3">
                                    <div>
                                        <CardTitle className="text-lg line-clamp-2 mb-2">{video.title}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {video.channelTitle}
                                        </CardDescription>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Hash className="h-4 w-4" />
                                            <span>{video.order}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            <span>{formatViewCount(video.viewCount)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleVideoClick(video)
                                            }}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Assistir
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
