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

interface SubCourse {
    id: string
    courseId: string
    name: string
    description: string
}

interface SubCourseComboboxProps {
    subCourses: SubCourse[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
    error?: boolean
}

export function SubCourseCombobox({
    subCourses,
    value,
    onValueChange,
    placeholder = "Selecione um subcurso",
    className,
    error = false
}: SubCourseComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const selectedSubCourse = subCourses.find((subCourse) => subCourse.id === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between",
                        !selectedSubCourse && "text-muted-foreground",
                        error && "border-red-500",
                        className
                    )}
                >
                    {selectedSubCourse ? selectedSubCourse.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Buscar subcurso..." />
                    <CommandList>
                        <CommandEmpty>Nenhum subcurso encontrado.</CommandEmpty>
                        <CommandGroup>
                            {subCourses.map((subCourse) => (
                                <CommandItem
                                    key={subCourse.id}
                                    value={subCourse.name}
                                    onSelect={() => {
                                        onValueChange(subCourse.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === subCourse.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{subCourse.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {subCourse.description}
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
