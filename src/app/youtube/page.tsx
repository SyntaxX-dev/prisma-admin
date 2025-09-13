'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { YouTubeSelector } from '@/components/YouTubeSelector'

export default function YouTubePage() {
    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        YouTube API
                    </h1>
                    <p className="text-muted-foreground">
                        Escolha uma das opções abaixo para interagir com a API do YouTube
                    </p>
                </div>

                <YouTubeSelector />
            </div>
        </ProtectedRoute>
    )
}
