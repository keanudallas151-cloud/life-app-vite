import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Palette, Check } from '@phosphor-icons/react'
import { cn } from '../lib/utils'
import { playColorPickSound } from '../lib/sounds'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
  label?: string
  soundEnabled?: boolean
}

const PRESET_COLORS = [
  { name: 'Purple', value: 'oklch(0.55 0.18 250)' },
  { name: 'Blue', value: 'oklch(0.55 0.18 230)' },
  { name: 'Cyan', value: 'oklch(0.60 0.18 200)' },
  { name: 'Teal', value: 'oklch(0.62 0.20 180)' },
  { name: 'Green', value: 'oklch(0.62 0.20 150)' },
  { name: 'Lime', value: 'oklch(0.70 0.18 120)' },
  { name: 'Yellow', value: 'oklch(0.70 0.18 90)' },
  { name: 'Orange', value: 'oklch(0.65 0.20 30)' },
  { name: 'Red', value: 'oklch(0.60 0.22 15)' },
  { name: 'Pink', value: 'oklch(0.65 0.20 350)' },
  { name: 'Magenta', value: 'oklch(0.60 0.22 320)' },
  { name: 'Indigo', value: 'oklch(0.50 0.20 270)' },
]

const WHEEL_SIZE = 240
const WHEEL_PADDING = 12
const WHEEL_RADIUS = WHEEL_SIZE / 2 - WHEEL_PADDING
const WHEEL_INNER_RATIO = 0.28

function getWheelPoint(hue: number) {
  const angle = (hue * Math.PI) / 180
  const radius = WHEEL_RADIUS * 0.66
  return {
    x: WHEEL_SIZE / 2 + Math.cos(angle) * radius,
    y: WHEEL_SIZE / 2 + Math.sin(angle) * radius,
  }
}

export function ColorPicker({ selectedColor, onColorChange, label = 'Color', soundEnabled = true }: ColorPickerProps) {
  const [showWheel, setShowWheel] = useState(false)
  const [wheelHue, setWheelHue] = useState(250)
  const [wheelLightness, setWheelLightness] = useState(0.60)
  const [isDragging, setIsDragging] = useState(false)
  const [pickerPoint, setPickerPoint] = useState(() => getWheelPoint(250))
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!showWheel || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = WHEEL_SIZE / 2
    const centerY = WHEEL_SIZE / 2

    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE)

    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 0.5) * (Math.PI / 180)
      const endAngle = (angle + 0.5) * (Math.PI / 180)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, WHEEL_RADIUS, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = `oklch(${wheelLightness} 0.20 ${angle})`
      ctx.fill()
    }

    ctx.beginPath()
    ctx.arc(centerX, centerY, WHEEL_RADIUS * WHEEL_INNER_RATIO, 0, 2 * Math.PI)
    ctx.fillStyle = 'var(--card)'
    ctx.fill()
    ctx.strokeStyle = 'var(--border)'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [showWheel, wheelLightness])

  const updateColorFromPointer = (clientX: number, clientY: number, shouldPlaySound = false) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const innerRadius = WHEEL_RADIUS * WHEEL_INNER_RATIO
    const clampedDistance = Math.min(Math.max(distance, innerRadius), WHEEL_RADIUS)
    const angle = Math.atan2(dy, dx)
    const hue = Math.round(((angle * 180) / Math.PI + 360) % 360)
    const markerRadius = Math.max(innerRadius, Math.min(clampedDistance, WHEEL_RADIUS - 2))

    setWheelHue(hue)
    setPickerPoint({
      x: centerX + Math.cos(angle) * markerRadius,
      y: centerY + Math.sin(angle) * markerRadius,
    })
    onColorChange(`oklch(${wheelLightness} 0.20 ${hue})`)

    if (shouldPlaySound) {
      playColorPickSound(soundEnabled)
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    updateColorFromPointer(e.clientX, e.clientY, true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    e.preventDefault()
    updateColorFromPointer(e.clientX, e.clientY)
  }

  const handlePointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setIsDragging(false)
    playColorPickSound(soundEnabled)
  }

  const handleColorSelect = (color: string) => {
    onColorChange(color)
    playColorPickSound(soundEnabled)
  }

  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextLightness = parseFloat(e.target.value)
    setWheelLightness(nextLightness)
    onColorChange(`oklch(${nextLightness} 0.20 ${wheelHue})`)
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color, index) => (
          <motion.button
            key={color.value}
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.02,
              type: 'spring',
              stiffness: 500,
              damping: 25
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => handleColorSelect(color.value)}
            className={cn(
              'organized-color-swatch relative h-11 w-11 rounded-full border-2 transition-all flex-shrink-0 shadow-sm',
              selectedColor === color.value
                ? 'border-foreground ring-2 ring-ring ring-offset-2'
                : 'border-border hover:border-muted-foreground'
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {selectedColor === color.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check
                  weight="bold"
                  className="h-5 w-5 drop-shadow-md text-primary-foreground"
                />
              </motion.div>
            )}
          </motion.button>
        ))}

        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          onClick={() => setShowWheel(!showWheel)}
          className={cn(
            'organized-color-wheel-trigger h-11 w-11 rounded-full border-2 transition-all flex items-center justify-center',
            showWheel
              ? 'border-foreground bg-muted'
              : 'border-dashed border-muted-foreground hover:border-foreground hover:bg-muted/50'
          )}
          title="Color wheel"
          aria-label="Open color wheel"
        >
          <Palette weight="bold" className="h-4 w-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showWheel && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="organized-color-wheel-panel space-y-4 overflow-hidden rounded-2xl border border-border bg-card p-4"
          >
            <div className="text-center">
              <Label className="text-xs font-medium text-muted-foreground">
                Drag around the wheel to preview and select a color
              </Label>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
                <canvas
                  ref={canvasRef}
                  width={WHEEL_SIZE}
                  height={WHEEL_SIZE}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  className="organized-color-wheel-canvas cursor-crosshair rounded-full shadow-lg"
                  style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
                />
                <motion.div
                  className="pointer-events-none absolute h-8 w-8 rounded-full border-2 border-card shadow-lg"
                  animate={{
                    x: pickerPoint.x - 16,
                    y: pickerPoint.y - 16,
                    scale: isDragging ? 1.12 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  style={{ backgroundColor: selectedColor }}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Brightness</Label>
              <input
                type="range"
                min="0.35"
                max="0.80"
                step="0.01"
                value={wheelLightness}
                onChange={handleLightnessChange}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, oklch(0.35 0.20 ${wheelHue}), oklch(0.50 0.20 ${wheelHue}), oklch(0.65 0.20 ${wheelHue}), oklch(0.80 0.20 ${wheelHue}))`
                }}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border p-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-11 w-11 rounded-full border-2 border-border shadow-sm flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="text-xs min-w-0">
                  <div className="font-medium text-foreground">Current Color</div>
                  <div className="font-mono text-muted-foreground truncate">{selectedColor}</div>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowWheel(false)}
              className="w-full min-h-11"
            >
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
