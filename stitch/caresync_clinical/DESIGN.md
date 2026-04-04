# Design System: Clinical Sophistication

## 1. Overview & Creative North Star
**The Creative North Star: "The Clinical Sanctuary"**

This design system moves away from the cluttered, anxiety-inducing interfaces of legacy healthcare software. Instead, it adopts the persona of a high-end, private medical practice—quiet, precise, and profoundly calm. 

We break the "standard dashboard" template by utilizing **Intentional Asymmetry** and **Tonal Depth**. By placing high-contrast, editorial typography against a landscape of soft, layered blues and whites, we create an environment that feels authoritative for doctors and soothing for patients. The layout should feel like a well-organized medical journal: expansive white space, clear hierarchies, and a total absence of visual noise.

---

## 2. Colors
Our palette is rooted in medical-grade precision. It uses "Cool Thermal" logic—warmer whites for surfaces and clinical blues for interactive elements.

### The "No-Line" Rule
**Traditional 1px borders are strictly prohibited for sectioning.** 
Structural boundaries must be defined solely through background color shifts. For example, a `surface-container-low` sidebar sitting against a `background` main area. This creates a "seamless" feel that mimics high-end physical architecture.

### Surface Hierarchy & Nesting
Depth is achieved through the physical stacking of tones. To create a "nested" effect:
1.  **Level 0 (Base):** `background` (#f7f9fb)
2.  **Level 1 (Sections):** `surface-container-low` (#f0f4f7)
3.  **Level 2 (Interactive Cards):** `surface-container-lowest` (#ffffff)
4.  **Level 3 (Popovers/Modals):** `surface-bright` (#f7f9fb) with Glassmorphism.

### The "Glass & Gradient" Rule
To elevate the UI beyond a flat template, use **Glassmorphism** for floating navigation bars or treatment summaries. 
*   **Implementation:** `bg-surface-container-lowest/60` with a `backdrop-blur-xl`.
*   **Signature Textures:** Use a subtle linear gradient for primary CTAs: `from-primary` to `to-primary-dim`. This adds a "weighted" feel to the button, suggesting importance and reliability.

---

## 3. Typography
We use a dual-font strategy to balance character with legibility. 

*   **Display & Headlines (Manrope):** A geometric sans-serif that feels modern and approachable. Use `display-lg` through `headline-sm` for page titles and section headers. High tracking (letter-spacing: -0.02em) on larger sizes conveys a premium, editorial feel.
*   **Titles & Body (Inter):** The industry standard for legibility. Used for all functional data, patient records, and instructional text. 

**The Hierarchy of Trust:**
*   **Hero Text:** `display-md` (Manrope) for welcoming patients.
*   **Data Points:** `title-md` (Inter, Medium weight) for medical metrics to ensure they are unmistakable.
*   **Labels:** `label-sm` (Inter, Bold, Uppercase) with `tracking-widest` for category tags (e.g., "BLOOD PRESSURE").

---

## 4. Elevation & Depth
We eschew the "drop shadow" defaults of the early 2010s in favor of **Tonal Layering**.

*   **The Layering Principle:** A patient’s record card (`surface-container-lowest`) should sit atop a `surface-container-low` dashboard. The 15-unit shift in hex value provides enough contrast for the eye to perceive depth without "dirtying" the UI with shadows.
*   **Ambient Shadows:** For elevated elements (like a "Book Appointment" floating button), use a multi-layered shadow:
    *   `shadow-[0px_10px_30px_rgba(42,52,57,0.04),_0px_2px_8px_rgba(42,52,57,0.02)]`
    *   The shadow is a tint of `on-surface`, never pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use `outline-variant` at `20%` opacity. 
*   **Glassmorphism Depth:** Modals should use `surface-container-highest` at `70%` opacity with a heavy blur to ensure the patient never feels "lost" from the previous screen.

---

## 5. Components

### Buttons
*   **Primary:** `bg-primary` text `on-primary`. Roundedness: `md`. Use the "Signature Gradient" (Primary to Primary-Dim).
*   **Secondary:** `bg-secondary-container` text `on-secondary-container`. No border.
*   **Tertiary:** No background. Text `primary`. Use for low-emphasis actions like "Cancel."

### Input Fields
*   **Style:** `bg-surface-container-low`, `rounded-md`, no border.
*   **Focus State:** Shift background to `surface-container-lowest` and add a `2px` ring of `surface-tint`.
*   **Error State:** Text and soft outer glow using `error`.

### Cards & Lists
*   **Forbidden:** Horizontal divider lines (`<hr>`). 
*   **Alternative:** Use `padding-y` and `surface` shifts. A list of appointments should be a series of `surface-container-lowest` cards on a `surface-container-low` background with `gap-3`.

### Clinical Chips
*   **Status:** Use `tertiary-container` for "Stable" or "Completed" and `error-container` for "Urgent."
*   **Shape:** `rounded-full` for a friendly, pill-like appearance.

### The "Vitals" Card (Special Component)
A custom component for healthcare: A `surface-container-lowest` card with a `2px` left-accent border of `primary`. Features a `display-sm` value with a `label-md` unit suffix.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Negative Space:** If a section feels crowded, double the padding. Healthcare data needs room to breathe to prevent user error.
*   **Use Tonal Transitions:** Transition hover states by shifting from `surface-container-low` to `surface-container-high`.
*   **Maintain Soft Corners:** Use the `xl` (1.5rem) radius for large layout containers and `md` (0.75rem) for smaller interactive components.

### Don't:
*   **Don't use pure black (#000):** It is too harsh for a healing environment. Use `on-surface` (#2a3439).
*   **Don't use 1px Dividers:** They create "visual fences" that stop the user's eye. Use white space or tonal blocks instead.
*   **Don't use standard "Blue":** Avoid CSS `blue-500`. Stick strictly to our `primary` (#005cba) to maintain the medical-grade specialized feel.
*   **Don't Over-Animate:** Transitions should be `duration-300` and `ease-in-out`. Avoid bouncy or "playful" easing; the UI must feel stable and reliable.