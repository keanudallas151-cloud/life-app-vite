import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { CalendarBlank, X, Plus, Trash } from '@phosphor-icons/react'
import { Priority, Category, RecurringType, Subtask, AppSettings } from '../types'
import { VoiceInputButton } from './VoiceInputButton'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { cn } from '../lib/utils'

interface AddTaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  settings?: AppSettings
  onAddTask: (
    title: string,
    categoryId: string,
    priority: Priority,
    notes?: string,
    dueDate?: number,
    recurring?: RecurringType,
    tags?: string[],
    subtasks?: Subtask[]
  ) => void
}

type KeyDownLikeEvent = {
  key: string
}

const isUsableCategory = (category: Category) =>
  Boolean(category.id && category.name && category.color)

export function AddTaskForm({
  open,
  onOpenChange,
  categories,
  settings,
  onAddTask,
}: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [recurring, setRecurring] = useState<RecurringType | undefined>(undefined)
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [dueDatePopoverOpen, setDueDatePopoverOpen] = useState(false)
  const validCategories = useMemo(
    () => categories.filter(isUsableCategory),
    [categories]
  )

  useEffect(() => {
    if (validCategories.length > 0 && !categoryId) {
      setCategoryId(validCategories[0].id)
    }
    if (categoryId && !validCategories.some((cat) => cat.id === categoryId)) {
      setCategoryId(validCategories[0]?.id || '')
    }
  }, [validCategories, categoryId])

  const handleVoiceTranscript = (transcript: string) => {
    if (title) {
      setNotes(prev => prev ? `${prev}\n${transcript}` : transcript)
      toast.success('Added to notes')
    } else {
      setTitle(transcript)
      toast.success('Task title captured')
    }
  }

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return

    const newSubtask: Subtask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: newSubtaskTitle.trim(),
      completed: false
    }

    setSubtasks([...subtasks, newSubtask])
    setNewSubtaskTitle('')
  }

  const removeSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter(st => st.id !== subtaskId))
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    if (!categoryId || !validCategories.some((cat) => cat.id === categoryId)) {
      toast.error('Please create a category first')
      return
    }

    onAddTask(
      title.trim(),
      categoryId,
      priority,
      notes.trim() || undefined,
      dueDate ? dueDate.getTime() : undefined,
      recurring,
      undefined,
      subtasks.length > 0 ? subtasks : undefined
    )

    setTitle('')
    setCategoryId(validCategories[0]?.id || '')
    setPriority('medium')
    setNotes('')
    setDueDate(undefined)
    setRecurring(undefined)
    setSubtasks([])
    setNewSubtaskTitle('')
    setDueDatePopoverOpen(false)
    onOpenChange(false)
    toast.success('Task added successfully')
  }

  const handleKeyDown = (e: KeyDownLikeEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubtaskKeyDown = (e: KeyDownLikeEvent) => {
    if (e.key === 'Enter') {
      addSubtask()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(calc(100vw-1rem),32rem)] max-w-none gap-0 overflow-hidden rounded-[24px] border border-border bg-card p-0 shadow-2xl sm:w-full sm:max-w-xl max-h-[min(90dvh,46rem)]">
        <div className="flex max-h-[min(90dvh,46rem)] flex-col">
          <DialogHeader className="border-b border-border bg-card px-4 pb-3 pt-4 text-center sm:px-5">
            <DialogTitle className="text-[1.95rem] font-bold tracking-tight sm:text-3xl">
              Add New Task
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 sm:text-[15px]">
              Create a new task and assign it to a category
            </DialogDescription>
          </DialogHeader>

          {validCategories.length === 0 ? (
            <div className="px-4 py-8 text-center sm:px-5">
              <p className="mb-4 text-sm text-muted-foreground sm:text-[15px]">
                You need to create at least one category before adding tasks.
              </p>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="task-title" className="text-[15px] font-semibold sm:text-[17px]">
                        Task Title
                      </Label>
                      <VoiceInputButton
                        onTranscript={handleVoiceTranscript}
                        hapticEnabled={settings?.hapticFeedback}
                        soundEnabled={settings?.buttonSounds}
                      />
                    </div>
                    <Input
                      id="task-title"
                      placeholder="Enter task title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="min-h-12 rounded-2xl px-4 text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="task-category" className="text-[15px] font-semibold sm:text-[17px]">
                        Category
                      </Label>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger id="task-category" className="min-h-12 rounded-2xl px-4 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
                          {validCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-priority" className="text-[15px] font-semibold sm:text-[17px]">
                        Priority
                      </Label>
                      <Select
                        value={priority}
                        onValueChange={(v) => setPriority(v as Priority)}
                      >
                        <SelectTrigger id="task-priority" className="min-h-12 rounded-2xl px-4 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
                          <SelectItem value="low">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              Low
                            </span>
                          </SelectItem>
                          <SelectItem value="medium">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              Medium
                            </span>
                          </SelectItem>
                          <SelectItem value="high">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              High
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-due-date" className="text-[15px] font-semibold sm:text-[17px]">
                      Due Date (optional)
                    </Label>
                    <div className="flex gap-2">
                      <Popover
                        open={dueDatePopoverOpen}
                        onOpenChange={setDueDatePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'min-h-12 flex-1 justify-start rounded-2xl px-4 text-left text-base font-normal',
                              !dueDate && 'text-muted-foreground',
                            )}
                          >
                            <CalendarBlank className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="center"
                          side="top"
                          sideOffset={8}
                          className="w-[min(92vw,20rem)] rounded-[20px] border border-border bg-card p-3 text-card-foreground shadow-2xl"
                        >
                          <Calendar
                            className="rounded-xl bg-card text-card-foreground"
                            mode="single"
                            selected={dueDate}
                            onSelect={(date) => {
                              setDueDate(date)
                              if (date) {
                                setDueDatePopoverOpen(false)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {dueDate && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDueDate(undefined)}
                          className="h-12 w-12 rounded-2xl"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {dueDate && (
                    <div className="space-y-2">
                      <Label htmlFor="task-recurring" className="text-[15px] font-semibold sm:text-[17px]">
                        Recurring (optional)
                      </Label>
                      <Select
                        value={recurring || 'none'}
                        onValueChange={(v) =>
                          setRecurring(v === 'none' ? undefined : (v as RecurringType))
                        }
                      >
                        <SelectTrigger id="task-recurring" className="min-h-12 rounded-2xl px-4 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="task-notes" className="text-[15px] font-semibold sm:text-[17px]">
                      Notes (optional)
                    </Label>
                    <Textarea
                      id="task-notes"
                      placeholder="Add any additional details..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="min-h-[96px] resize-none rounded-2xl px-4 py-3 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[15px] font-semibold sm:text-[17px]">
                      Subtasks (optional)
                    </Label>
                    {subtasks.length > 0 && (
                      <div className="space-y-2 rounded-2xl border border-border bg-muted/30 p-3">
                        <AnimatePresence>
                          {subtasks.map((subtask) => (
                            <motion.div
                              key={subtask.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="flex items-center justify-between gap-2 rounded-2xl bg-background px-3 py-2"
                            >
                              <span className="flex-1 text-sm leading-5">
                                {subtask.title}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                                onClick={() => removeSubtask(subtask.id)}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a subtask..."
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        onKeyDown={handleSubtaskKeyDown}
                        className="min-h-12 flex-1 rounded-2xl px-4 text-base"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addSubtask}
                        className="h-12 w-12 rounded-2xl"
                      >
                        <Plus weight="bold" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-border bg-card px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-12 rounded-2xl px-5">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="min-h-12 rounded-2xl bg-accent px-5 text-accent-foreground hover:bg-accent/90"
                  >
                    Add Task
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
