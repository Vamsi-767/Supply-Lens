# Frontend Design System

## 🎨 Color Palette

### Gradients
```
Primary Gradient: from-purple-600 via-purple-700 to-indigo-900
Button Gradient: from-blue-500 to-cyan-500
Text Gradient: from-blue-200 to-cyan-200
```

### Status Colors
- **Success/Completed**: green-400 / green-300
- **Warning/Pending**: yellow-400 / yellow-300
- **Info/In Transit**: blue-400 / blue-300
- **Alert/Critical**: red-400 / red-300
- **Secondary**: purple-400 / purple-300

## 🌟 Glass Effect Classes

### Utility Classes

```css
.glass
- Background: rgba(255, 255, 255, 0.08)
- Backdrop Filter: blur(10px)
- Border: 1px solid rgba(255, 255, 255, 0.2)

.glass-dark
- Background: rgba(0, 0, 0, 0.08)
- Backdrop Filter: blur(10px)
- Border: 1px solid rgba(255, 255, 255, 0.1)

.glass-hover
- Transition: all 0.3s ease-in-out
- Hover Background: rgba(255, 255, 255, 0.12)
- Hover Transform: translateY(-2px)
- Hover Shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37)
```

## 🎭 Component Patterns

### Glass Card
```jsx
<div className="glass glass-hover rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold">Title</h3>
  <p>Content</p>
</div>
```

### Glass Button
```jsx
<button className="glass-hover px-6 py-3 rounded-lg font-semibold">
  Action
</button>
```

### Glass Input
```jsx
<input
  className="w-full glass rounded-lg px-4 py-3 text-white placeholder-gray-400"
  placeholder="Enter text"
/>
```

### Status Badge
```jsx
<span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-400 bg-opacity-20 text-green-200">
  Completed
</span>
```

### Table with Glass
```jsx
<div className="glass rounded-xl overflow-hidden">
  <table className="w-full text-sm">
    <thead className="border-b border-white border-opacity-10 bg-white bg-opacity-5">
      {/* Headers */}
    </thead>
    <tbody>
      <tr className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5">
        {/* Cells */}
      </tr>
    </tbody>
  </table>
</div>
```

## 📐 Spacing & Layout

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Common Padding
- **Small**: p-4 (1rem)
- **Medium**: p-6 (1.5rem)
- **Large**: p-8 (2rem)

### Common Gaps
- **Small**: gap-2 (0.5rem)
- **Medium**: gap-4 (1rem)
- **Large**: gap-6 (1.5rem)

## 🔤 Typography

### Headings
- **Page Title**: text-3xl font-bold
- **Section Title**: text-xl font-semibold
- **Card Title**: text-lg font-semibold
- **Label**: text-sm font-medium

### Body Text
- **Regular**: text-sm / text-base
- **Muted**: text-gray-300 / text-gray-400

### Special
- **Gradient Text**: `bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent`
- **Monospace (SKU/ID)**: font-mono text-cyan-300

## 🎬 Animations

### Transitions
```css
/* All elements */
transition: all 0.3s ease-in-out

/* Smooth scroll */
scroll-behavior: smooth

/* Hover effects */
hover:-translate-y-0.5 hover:shadow-lg

/* Active effects */
active:scale-95
```

### Keyframes
- Pulse: Used for loading states and emphasis
- Bounce: Can be added for notifications

## 📊 Data Visualization

### Charts
- Bar Chart: Simple div height-based
- Progress Bar: Full-width with gradient
- Pie/Donut: Can use SVG or dedicated library

### Icons/Emojis
- Dashboard: 📊
- Products: 📦
- Inventory: 📋
- Orders: 🛒
- Suppliers: 🏢
- Reports: 📈
- Settings: ⚙️
- Logout: 🚪

## 🎯 Best Practices

1. **Always use glass classes** for consistency
2. **Maintain 12px grid** for alignment
3. **Use semantic HTML** for accessibility
4. **Keep contrast ratio** ≥ 4.5:1
5. **Test on multiple devices** before deployment
6. **Use gradients** for visual hierarchy
7. **Add hover states** to interactive elements
8. **Use appropriate status colors** for clarity

## 🔧 Customization

### Change Primary Gradient
Edit `src/index.css`:
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjust Backdrop Blur
Edit `tailwind.config.js`:
```js
backdropFilter: {
  'glass': 'blur(10px)', // Change blur amount
}
```

### Modify Glass Opacity
Edit the utility classes in `src/index.css`
```css
@apply bg-white bg-opacity-10; /* Change 10 to desired value */
```

## 📱 Responsive Utilities

```jsx
// Mobile-first approach
<div className="text-center md:text-left lg:text-left">
  {/* Stacked on mobile, aligned on larger screens */}
</div>

// Grid that adapts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 col on mobile, 2 on tablet, 4 on desktop */}
</div>
```

---

**Design System Version**: 1.0.0  
**Compatible with**: Tailwind CSS 3.x, React 18.x
