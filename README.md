# 🎨 Wallpaper Colorizer

A modern web app that lets you upload any wallpaper and instantly colorize it using 13 different color schemes. All processing happens in your browser—no server uploads.

## Features

- **13 Color Schemes**: Dracula, Catppuccin, Dawnfox, Everforest, Gruvbox, Kanagawa, Nord, Rose Pine Dawn, Solarized, Thorn, Tokyo Night, One Dark, and Synthwave 84
- **Live Preview**: See original vs colorized with a toggle button
- **Intensity Control**: Adjust the colorization strength from 0-100% blend with original
- **Drag & Drop Upload**: Easy image upload with drag-and-drop support
- **PNG Download**: Export your colorized wallpaper in lossless PNG format
- **Privacy**: 100% client-side processing—no data sent to servers
- **Responsive Design**: Works on desktop, tablet, and mobile

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd color-palette-wallpaper

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The app will be available at \`http://localhost:5173\`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

This creates an optimized production build in the \`dist/\` folder.

## How It Works

1. **Upload**: Drag and drop a wallpaper image or click to browse
2. **Select**: Choose a color scheme from the dropdown
3. **Adjust**: Use the intensity slider to control the blend
4. **Preview**: Switch between original and colorized versions
5. **Download**: Save your colorized wallpaper as PNG

### Color Processing Algorithm

The app uses k-means clustering to:
1. Extract dominant colors from your image
2. Map them to the selected color palette
3. Apply the new colors while preserving the image structure
4. Blend with the original based on intensity setting

## Tech Stack

- **React 18**: UI framework
- **Vite**: Lightning-fast build tool
- **Canvas API**: Image processing
- **CSS3**: Modern styling with gradients and animations

## Deployment

### Netlify (Recommended)

\`\`\`bash
# One-click deploy
npm run build
# Then drag the \`dist\` folder to Netlify
\`\`\`

Or connect your GitHub repo to Netlify for automatic deployments.

### Vercel

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Other Platforms

The app is a static site—deploy the \`dist/\` folder contents to any static hosting service (GitHub Pages, AWS S3, Cloudflare Pages, etc.)

## File Structure

\`\`\`
src/
├── components/           # React components
│   ├── UploadArea.jsx
│   ├── PreviewPanel.jsx
│   ├── SchemeSelector.jsx
│   └── DownloadButton.jsx
├── data/                 # Color palette definitions
│   └── colorPalettes.js
├── utils/                # Image processing logic
│   └── imageProcessing.js
├── styles/               # Component styles
│   ├── App.css
│   ├── UploadArea.css
│   ├── PreviewPanel.css
│   ├── SchemeSelector.css
│   └── DownloadButton.css
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Base styles
\`\`\`

## Browser Support

Works in all modern browsers supporting:
- Canvas API
- FileReader API
- ES6+ JavaScript

## Future Enhancements

- Batch processing for multiple images
- Custom color palette creation
- History of recent colorizations
- Social sharing
- Progressive Web App (PWA) support
- WebWorker for faster processing on large images

## License

MIT License - feel free to use this project for anything!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Made with ❤️ for creators and designers**
