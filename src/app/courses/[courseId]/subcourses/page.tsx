import ProtectedRoute from '@/components/ProtectedRoute'
import { SubCoursesList } from '@/components/SubCoursesList'

interface SubCoursesPageProps {
    params: Promise<{
        courseId: string
    }>
}

export default async function SubCoursesPage({ params }: SubCoursesPageProps) {
    const { courseId } = await params

    return (
        <ProtectedRoute>
            <SubCoursesList
                courseId={courseId}
                courseName="Curso" // Será atualizado quando tivermos o nome do curso
            />
        </ProtectedRoute>
    )
}
