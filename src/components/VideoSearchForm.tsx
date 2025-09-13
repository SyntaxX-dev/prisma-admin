'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, Play, Eye, Calendar, User, Copy, Check } from 'lucide-react'

interface VideoSearchResult {
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

export function VideoSearchForm() {
    const [query, setQuery] = useState('')
    const [maxResults, setMaxResults] = useState(10)
    const [order, setOrder] = useState('relevance')
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<VideoSearchResult[]>([])
    const [error, setError] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setResults([])

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setError('Token de autenticação não encontrado')
                return
            }

            const response = await fetch('https://prisma-backend-production-4c22.up.railway.app/youtube/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query,
                    maxResults,
                    order
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setResults(data)
            } else {
                const errorData = await response.json()
                setError(errorData.message || 'Erro ao buscar vídeos')
            }
        } catch (error) {
            console.error('Erro na busca:', error)
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
        return new Date(dateString).toLocaleDateString('pt-BR')
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
        <div className="max-w-6xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Search className="h-5 w-5" />
                        <span>Buscar Vídeos no YouTube</span>
                    </CardTitle>
                    <CardDescription>
                        Digite uma consulta para encontrar vídeos relacionados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="query">Termo de Busca *</Label>
                                <Input
                                    id="query"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Digite o que você quer buscar..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxResults">Máximo de Resultados</Label>
                                <Input
                                    id="maxResults"
                                    type="number"
                                    value={maxResults}
                                    onChange={(e) => setMaxResults(Number(e.target.value))}
                                    placeholder="Digite a quantidade..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Ordenação</Label>
                                <Select value={order} onValueChange={setOrder}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">Relevância</SelectItem>
                                        <SelectItem value="date">Data</SelectItem>
                                        <SelectItem value="rating">Avaliação</SelectItem>
                                        <SelectItem value="title">Título</SelectItem>
                                        <SelectItem value="viewCount">Visualizações</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar Vídeos
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

            {results.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Resultados da Busca ({results.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((video) => (
                                <div key={video.videoId} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                                        <img
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                            {formatDuration(video.duration)}
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <h3 className="font-semibold line-clamp-2 text-sm">
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                <User className="h-3 w-3" />
                                                <span className="truncate">{video.channelTitle}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Eye className="h-3 w-3" />
                                                <span>{formatViewCount(video.viewCount)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(video.publishedAt)}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {video.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {(video.tags || []).slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs font-medium text-muted-foreground">ID do Vídeo:</span>
                                                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {video.videoId}
                                                    </code>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => copyToClipboard(video.videoId)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    {copiedId === video.videoId ? (
                                                        <Check className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-3 w-3" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
