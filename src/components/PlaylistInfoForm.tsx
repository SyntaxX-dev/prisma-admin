'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Info, Play, User, Calendar, Image, Copy, Check } from 'lucide-react'

interface PlaylistInfo {
    playlistId: string
    title: string
    description: string
    thumbnailUrl: string
    itemCount: number
    channelTitle: string
}

export function PlaylistInfoForm() {
    const [playlistId, setPlaylistId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [playlist, setPlaylist] = useState<PlaylistInfo | null>(null)
    const [error, setError] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setPlaylist(null)

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setError('Token de autenticação não encontrado')
                return
            }

            const response = await fetch(`https://prisma-backend-production-4c22.up.railway.app/youtube/playlist/${playlistId}/info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setPlaylist(data)
            } else {
                const errorData = await response.json()
                setError(errorData.message || 'Erro ao obter informações da playlist')
            }
        } catch (error) {
            console.error('Erro na requisição:', error)
            setError('Erro de comunicação com o servidor')
        } finally {
            setIsLoading(false)
        }
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
                        <Info className="h-5 w-5" />
                        <span>Informações da Playlist</span>
                    </CardTitle>
                    <CardDescription>
                        Digite o ID da playlist para obter suas informações gerais
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="playlistId">ID da Playlist *</Label>
                            <Input
                                id="playlistId"
                                value={playlistId}
                                onChange={(e) => setPlaylistId(e.target.value)}
                                placeholder="Ex: PLrAXtmRdnEQy6nuLMOVuF4g4ei0U0e5PZ"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                O ID da playlist pode ser encontrado na URL do YouTube (após list=)
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
                                    <Info className="mr-2 h-4 w-4" />
                                    Obter Informações
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

            {playlist && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Playlist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <img
                                        src={playlist.thumbnailUrl}
                                        alt={playlist.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold">{playlist.title}</h2>
                                    <p className="text-muted-foreground">
                                        {playlist.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>Canal</span>
                                        </div>
                                        <p className="font-medium">{playlist.channelTitle}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Play className="h-4 w-4" />
                                            <span>Total de Vídeos</span>
                                        </div>
                                        <p className="font-medium text-2xl">{playlist.itemCount}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Image className="h-4 w-4" />
                                        <span>ID da Playlist</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1">
                                            {playlist.playlistId}
                                        </code>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => copyToClipboard(playlist.playlistId)}
                                            className="h-8 px-3"
                                        >
                                            {copiedId === playlist.playlistId ? (
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
                                            href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center space-x-2"
                                        >
                                            <Play className="h-4 w-4" />
                                            <span>Ver Playlist no YouTube</span>
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
