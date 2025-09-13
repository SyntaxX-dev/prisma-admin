'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Clapperboard, MonitorPlay, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CourseCreationForm } from './CourseCreationForm'
import { VideoCreationForm } from './VideoCreationForm'
import { SubCourseCreationForm } from './SubCourseCreationForm'

type RegistrationType = 'course' | 'subcourse' | 'video' | null

export function RegistrationSelector() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<RegistrationType>(null)

  const handleBackToCourses = () => {
    router.push('/courses')
  }

  const handleTypeSelection = (type: RegistrationType) => {
    setSelectedType(type)
  }

  const handleBackToSelection = () => {
    setSelectedType(null)
  }

  if (selectedType === 'course') {
    return <CourseCreationForm onBack={handleBackToSelection} />
  }

  if (selectedType === 'subcourse') {
    return <SubCourseCreationForm onBack={handleBackToSelection} />
  }

  if (selectedType === 'video') {
    return <VideoCreationForm onBack={handleBackToSelection} />
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Cadastros</h1>
        <p className="text-muted-foreground">Escolha o tipo de conteúdo que deseja cadastrar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer hover:bg-accent/50 flex flex-col"
          onClick={() => handleTypeSelection('course')}
        >
          <CardHeader className="text-center flex-1">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Curso</CardTitle>
            <CardDescription>
              Criar um novo curso no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center flex flex-col justify-end">
            <p className="text-sm text-muted-foreground mb-4">
              Cadastre cursos completos com nome, descrição e imagem
            </p>
            <Button className="w-full cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Criar Curso
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer hover:bg-accent/50 flex flex-col"
          onClick={() => handleTypeSelection('subcourse')}
        >
          <CardHeader className="text-center flex-1">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
              <Clapperboard className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Subcurso</CardTitle>
            <CardDescription>
              Criar um novo subcurso
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center flex flex-col justify-end">
            <p className="text-sm text-muted-foreground mb-4">
              Cadastre subcursos dentro de um curso existente
            </p>
            <Button className="w-full cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Criar Subcurso
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer hover:bg-accent/50 flex flex-col"
          onClick={() => handleTypeSelection('video')}
        >
          <CardHeader className="text-center flex-1">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
              <MonitorPlay className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Vídeo</CardTitle>
            <CardDescription>
              Cadastrar um novo vídeo
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center flex flex-col justify-end">
            <p className="text-sm text-muted-foreground mb-4">
              Adicione vídeos do YouTube a um subcurso
            </p>
            <Button className="w-full cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Vídeo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
