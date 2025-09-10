import ProtectedRoute from '@/components/ProtectedRoute'
import { VideosList } from '@/components/VideosList'

interface VideosPageProps {
    params: Promise<{
        courseId: string
        subCourseId: string
    }>
}

export default async function VideosPage({ params }: VideosPageProps) {
    const { courseId, subCourseId } = await params
    return (
        <ProtectedRoute>
            <VideosList
                subCourseId={subCourseId}
                subCourseName="Subcurso" // Será atualizado quando tivermos o nome do subcurso
                courseName="Curso" // Será atualizado quando tivermos o nome do curso
            />
        </ProtectedRoute>
    )
}
