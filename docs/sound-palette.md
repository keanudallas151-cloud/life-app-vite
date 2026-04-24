# Sound palette & wiring rules

The app uses a procedural + MP3 hybrid sound engine in
[`src/systems/useSound.js`](../src/systems/useSound.js). This doc lists
every sound type available and the rules for adding more variety.

## Guiding principle

**Different actions should sound different.** Same actions should sound
the same. Don't put identical `play("tap")` on every button — that's
the "all-same" problem. Pick the most specific matching type, or add a
new palette entry if none fits.

**Don't put `data-sound` on every button either.** The opt-in
delegation in [`src/App.jsx`](../src/App.jsx) only fires on elements
that explicitly set `data-sound="…"` — reserve it for elements that
genuinely deserve their own unique sound and don't already have a
`play()` call in their handler.

## Defaults

- `PREF_DEFAULTS.soundVolume = 50` (used when a user first installs).
- `soundEnabled = true`, `soundMode = "focused"`, `soundScope = "balanced"`.
- AudioContext is lazy; unlocked on first user gesture (iOS rule).
- `close()` on unmount prevents memory leaks.

## Palette

### Legacy MP3 clips (preloaded once)
| Type | Sound file | Typical use |
|-|-|-|
| `home` | `home_sound.mp3` | (generic chime — prefer `home_return` now) |
| `pageturn_next` | `next_page.mp3` | Reader flip forward |
| `pageturn_prev` | `previous_page.mp3` | Reader flip back |
| `pageturn` | `next_page.mp3` | Generic page flip |

### Nav chimes (3 round-robin variants each)
| Type | Feel |
|-|-|
| `nav_forward`, `tap`, `open` | Ascending pluck (3 variants) |
| `nav_back`, `back` | Descending pluck (3 variants) |
| `ok` | Forward palette, quieter |
| `star` | Forward variant 2 — bloom with upward bend |

### iOS-style extended palette (Phase: sound variety)

Toggle/select — tiny clicks:
| `toggle_on`  | Short up-tinted click |
| `toggle_off` | Short down-tinted click |
| `select`     | Short high ping |
| `deselect`   | Short mid ping |

Sheet/modal:
| `sheet_open`  | Quick glide up |
| `sheet_close` | Quick glide down |

Feedback:
| `success`     | Three-note bright bloom |
| `warn`        | Two-note soft dip |
| `destructive` | Low two-note thud |

Flow:
| `refresh` | Rising tick |
| `swipe`   | Short glide |
| `submit`  | Two-note punch |
| `primary` | Primary-button short rise |
| `secondary` | Secondary-button single tone |

Messaging:
| `send`    | Rising puff |
| `receive` | Gentle double ping |
| `tritone` | Three-note rising launch (used for quiz start / Play Again) |
| `notif`   | Two-note bell |

Locks/long-press:
| `lock`       | Low descending thunk |
| `unlock`     | Low ascending chirp |
| `long_press` | Slow two-note rise |

Taps (granular):
| `tap_soft` | Ultra-brief high ping |
| `tap_firm` | Two-note quick pluck |

Arrivals/returns:
| `home_return` | Warm four-note descent — **back to lobby**, distinct from generic `back` |
| `lobby_enter` | Bright pentatonic climb — arriving at home after auth/onboarding |

Quiz feedback (existing):
| `correct` | Two-note rise |
| `wrong`   | Short downward chirp |
| `err`     | Two low beeps |

## How to wire a new distinct action

1. **If one of the palette types fits the action semantically, use it.**
   Example: closing a modal → `sheet_close` (not `back`).
2. **If nothing fits, add a new variant** in `useSound.js`:
   - Define a `V_MY_NEW_SOUND` chime variant.
   - Register it in `EXTRA_VARIANTS`.
   - Add a cooldown in `TYPE_COOLDOWN_MS`.
   - Document it here.
3. **Never duplicate** — if two actions should feel alike, share a type.

## Currently wired distinct actions (examples)

| Action | Sound | Location |
|-|-|-|
| Back to lobby from inside app | `home_return` | `src/App.jsx` `goHome` |
| Quiz start / Play Again | `tritone` | `src/components/QuizPage.jsx` |
| Exit Settings (back chevron) | `sheet_close` | `src/components/SettingsPage.jsx` |
| Open sub-page from Settings row | `sheet_open` | `src/components/SettingsPage.jsx` |
| Reset / restore actions | `success` | `src/components/SettingsPage.jsx` |
| Reader page flip forward / back | `pageturn_next` / `pageturn_prev` | `src/components/Reader.jsx` |
| Answer correct / wrong | `correct` / `wrong` | `src/components/QuizPage.jsx` |

## Volume

The user can adjust volume from Settings → Sound. Default is 50%.
Individual sounds have their own `peak` inside the variant so they
stay balanced relative to each other.
