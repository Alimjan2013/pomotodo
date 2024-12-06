import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface ReflectionFormProps {
  onComplete: (focusRating: number, notes: string) => void
}

export default function ReflectionForm({ onComplete }: ReflectionFormProps) {
  const [focusRating, setFocusRating] = useState(5)
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(focusRating, notes)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <h2 className="text-xl font-semibold text-white">Session Reflection</h2>
      <div>
        <label htmlFor="focus-rating" className="block text-sm font-medium text-white">
          Rate your focus (1-10)
        </label>
        <Slider
          id="focus-rating"
          min={1}
          max={10}
          step={1}
          value={[focusRating]}
          onValueChange={(value) => setFocusRating(value[0])}
          className="mt-2"
        />
        <span className="block mt-1 text-sm text-white">{focusRating}</span>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-white">
          Session Notes
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1"
          placeholder="What did you accomplish? Any distractions?"
        />
      </div>
      <Button type="submit" className="w-full">
        Complete Reflection
      </Button>
    </form>
  )
}

