# 🎨 Wallpaper Colorizer

A modern web app that lets you upload any wallpaper and instantly colorize it using 13 different color schemes. All processing happens in your browser—no server uploads.

## Featuring:

- **13 Color Schemes**: Dracula, Catppuccin, Dawnfox, Everforest, Gruvbox, Kanagawa, Nord, Rose Pine Dawn, Solarized, Thorn, Tokyo Night, One Dark, and Synthwave 84
- **Live Preview**: See original vs colorized
- **Intensity Control**: Adjust the colorization strength from 0-100% blend with original
- **Drag & Drop Upload**: Easy image upload with drag-and-drop support
- **PNG Download**: Export your colorized wallpaper in lossless PNG format
- **Privacy**: 100% client-side processing—no data sent to servers
- **Responsive Design**: Works on desktop, tablet, KFC Ice Cream Machine and mobile

## Getting Started

### Prerequisites
- Node.js 18+ and npm, that's it.

### Installation

```
# Clone the repository
git clone <repository-url>
cd color-palette-wallpaper

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at \`http://localhost:5173\`

### Build for Production

```bash
npm run build
```

## How It Works

### Color Processing Algorithm

The app uses k-means clustering to:
1. Extract dominant colors from your image
2. Map them to the selected color palette
3. Apply the new colors while preserving the image structure
4. Blend with the original based on intensity setting

## Tech Stack

- **React 18**
- **Vite**
- **Canvas API**
- **CSS3**

## File Structure

```
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
```

## Future Enhancements

- Batch processing for multiple images
- WebWorker for faster processing on large images

## License

MIT License - feel free to use this project for anything!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

