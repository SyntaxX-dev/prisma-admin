'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Video, Play, Info, ArrowLeft } from 'lucide-react'
import { VideoSearchForm } from './VideoSearchForm'
import { VideoDetailsForm } from './VideoDetailsForm'
import { PlaylistVideosForm } from './PlaylistVideosForm'
import { PlaylistInfoForm } from './PlaylistInfoForm'

type YouTubeAction = 'search' | 'video-details' | 'playlist-videos' | 'playlist-info' | null

export function YouTubeSelector() {
    const [selectedAction, setSelectedAction] = useState<YouTubeAction>(null)

    if (selectedAction) {
        return (
            <div className="space-y-6">
                <Button
                    variant="outline"
                    onClick={() => setSelectedAction(null)}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>

                {selectedAction === 'search' && <VideoSearchForm />}
                {selectedAction === 'video-details' && <VideoDetailsForm />}
                {selectedAction === 'playlist-videos' && <PlaylistVideosForm />}
                {selectedAction === 'playlist-info' && <PlaylistInfoForm />}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedAction('search')}>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle>Buscar Vídeos</CardTitle>
                            <CardDescription>
                                Pesquisar vídeos no YouTube por termo
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Digite uma consulta para encontrar vídeos relacionados no YouTube
                    </p>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedAction('video-details')}>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Video className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <CardTitle>Detalhes do Vídeo</CardTitle>
                            <CardDescription>
                                Obter informações detalhadas de um vídeo específico
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Insira o ID do vídeo para obter todos os detalhes
                    </p>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedAction('playlist-videos')}>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <CardTitle>Vídeos da Playlist</CardTitle>
                            <CardDescription>
                                Listar todos os vídeos de uma playlist
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Digite o ID da playlist para ver todos os vídeos
                    </p>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedAction('playlist-info')}>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Info className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <CardTitle>Informações da Playlist</CardTitle>
                            <CardDescription>
                                Obter dados gerais de uma playlist
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Insira o ID da playlist para ver suas informações
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
