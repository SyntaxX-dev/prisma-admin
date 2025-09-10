'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Course {
    id: string
    name: string
    description: string
}

interface CourseComboboxProps {
    courses: Course[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    error?: boolean
}

export function CourseCombobox({
    courses,
    value,
    onValueChange,
    placeholder = "Selecione um curso",
    className,
    error = false
}: CourseComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const selectedCourse = courses.find((course) => course.id === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between",
                        !selectedCourse && "text-muted-foreground",
                        error && "border-red-500",
                        className
                    )}
                >
                    {selectedCourse ? selectedCourse.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Buscar curso..." />
                    <CommandList>
                        <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
                        <CommandGroup>
                            {courses.map((course) => (
                                <CommandItem
                                    key={course.id}
                                    value={course.name}
                                    onSelect={() => {
                                        onValueChange(course.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === course.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{course.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {course.description}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
