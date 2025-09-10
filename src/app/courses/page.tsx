import ProtectedRoute from '@/components/ProtectedRoute'
import { CoursesList } from '@/components/CoursesList'

export default function CoursesPage() {
    return (
        <ProtectedRoute>
            <CoursesList />
        </ProtectedRoute>
    )
}
