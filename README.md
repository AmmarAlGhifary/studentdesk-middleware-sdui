# StudentDesk SDUI Middleware

Welcome to the **Server-Driven UI (SDUI)** Middleware for the StudentDesk Android application.

This repository is a Node.js / TypeScript application hosted on Vercel. It acts as the "Brain" of the StudentDesk mobile app, completely dictating what the user sees, how the UI is laid out, and how components are styled—all without requiring any updates to the Android app on the Google Play Store.

## 🏗️ Architecture: How it Works

The SDUI architecture splits the traditional mobile app into two strict roles:

1. **The Middleware (This Repo):** The Brain.
   - Fetches raw data from the legacy UAI APIs.
   - Transforms the raw data into an array of UI components (JSON).
   - Injects styling (margins, padding, colors) using a central `SduiTheme`.
   - Sends the finalized "Screen Payload" to the mobile app.

2. **The Android Client:** The "Dumb" Renderer.
   - Knows nothing about business logic or what a "Profile Screen" is.
   - Simply downloads the JSON payload from this middleware.
   - Recursively loops through the `children` arrays and draws the UI using its registry of "LEGO blocks" (Jetpack Compose components like `info_card`, `column`, `score_card`).

## 🎨 Theming and Modifiers

The Android client implements a CSS-style Box Model. The middleware controls how every component looks using the `modifier` object. 

Instead of hardcoding modifiers everywhere, we use a central theme file:
**`utils/theme.ts`**

Whenever you build a UI component, inject its modifier from the theme:
```typescript
import { SduiTheme } from '../../utils/theme';

{
    type: "score_card",
    title: "Sesi Ujian",
    date_text: "Tanggal: 01 Juli",
    modifier: SduiTheme.modifiers.scoreCard // Applies padding, colors, radius!
}
```

---

## 📖 Tutorial: Working with Components

Because of SDUI, adding, modifying, or deleting UI on the mobile app is incredibly easy.

### 1. Modifying an Existing Screen
To change what the Android app displays, simply edit the JSON being returned in the `handlers/` directory.

**Goal:** Change an existing vertical list of items into a horizontal scrolling row.
- Open the handler (e.g., `home.ts`).
- Change `type: "column"` to `type: "horizontal_list"`.
- Push to Vercel. The Android app will instantly update!

### 2. Deleting a Component
**Goal:** Remove an outdated banner from the Home screen.
- Open `handlers/home/home.ts`.
- Find the JSON block with `type: "warning_banner"`.
- Delete it from the `children` array.
- Push to Vercel. The banner disappears from the app instantly.

### 3. Adding a Brand New Component (Full Stack)
If you need a completely new type of UI (e.g., a `video_player`), you must update both the Middleware and the Android App.

**Step A: Define it in the Middleware**
Return your new component type in your Vercel handler:
```typescript
{
    type: "video_player",
    video_url: "https://example.com/video.mp4",
    auto_play: true,
    modifier: SduiTheme.modifiers.defaultCard
}
```

**Step B: Register it in Android**
Open `SduiModels.kt` in Android Studio and add your data class:
```kotlin
@Serializable
@SerialName("video_player")
data class SduiVideoPlayer(
    @SerialName("video_url") val videoUrl: String,
    @SerialName("auto_play") val autoPlay: Boolean = false,
    override val modifier: SduiModifier? = null
) : SduiComponent()
```

**Step C: Draw it in Android**
Open `WidgetComponents.kt` and create the Compose UI:
```kotlin
@Composable
fun SduiVideoPlayerComponent(model: SduiVideoPlayer, modifier: Modifier = Modifier) {
    Box(modifier = modifier) {
        // Draw the video using model.videoUrl
    }
}
```

**Step D: Add it to the Registry**
Open `UiComponentRenderer.kt` and link them together:
```kotlin
is SduiVideoPlayer -> SduiVideoPlayerComponent(component, appliedModifier)
```

You are now ready to dynamically render video players anywhere in your app just by adding them to the middleware JSON!
