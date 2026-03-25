// Color palettes for wallpaper colorization
// Based on industry-standard definitions from official palette repositories

export const colorPalettes = {
  dracula: {
    name: 'Dracula',
    colors: [
      '#282a36', '#21222c', '#282a36', '#f8f8f2',
      '#6272a4', '#8be9fd', '#50fa7b', '#bd93f9',
      '#ff79c6', '#ff5555', '#ffb86c', '#f1fa8c'
    ]
  },
  catppuccin: {
    name: 'Catppuccin',
    colors: [
      '#1e1e2e', '#181825', '#1e1e2e', '#cdd6f4',
      '#89b4fa', '#74c7ec', '#89dceb', '#94e2d5',
      '#b4befe', '#a6e3a1', '#fab387', '#cba6f7'
    ]
  },
  dawnfox: {
    name: 'Dawnfox',
    colors: [
      '#faf4ed', '#f2e9e1', '#eee8e3', '#575279',
      '#286983', '#569fba', '#9ccfd8', '#c4a7e7',
      '#6c77bb', '#d7827e', '#ea9d34', '#b4637a'
    ]
  },
  everforest: {
    name: 'Everforest',
    colors: [
      '#2b3339', '#232a2e', '#2b3339', '#d5c9a1',
      '#7fbbb3', '#83c092', '#8da101', '#d699b6',
      '#e69875', '#e67e80', '#dbbc7f', '#a7c080'
    ]
  },
  gruvbox: {
    name: 'Gruvbox',
    colors: [
      '#282828', '#1d2021', '#282828', '#ebdbb2',
      '#83a598', '#8ec07c', '#b8bb26', '#98971a',
      '#d3869b', '#fabd2f', '#fe8019', '#fb4934'
    ]
  },
  kanagawa: {
    name: 'Kanagawa',
    colors: [
      '#1f1f28', '#2a2a37', '#1f1f28', '#dcd7ba',
      '#7e9cd8', '#658594', '#98bb6c', '#c0a36e',
      '#ffa066', '#e46876', '#d27e99', '#957fb8'
    ]
  },
  nord: {
    name: 'Nord',
    colors: [
      '#2e3440', '#3b4252', '#2e3440', '#d8dee9',
      '#5e81ac', '#81a1c1', '#88c0d0', '#8fbcbb',
      '#a3be8c', '#ebcb8b', '#d08770', '#b48ead'
    ]
  },
  rosepinedawn: {
    name: 'Rose Pine Dawn',
    colors: [
      '#faf4ed', '#f2e9e1', '#faf4ed', '#575279',
      '#286983', '#569fba', '#9ccfd8', '#c4a7e7',
      '#6c77bb', '#d7827e', '#ea9d34', '#b4637a'
    ]
  },
  solarized: {
    name: 'Solarized',
    colors: [
      '#fdf6e3', '#eee8d5', '#fdf6e3', '#657b83',
      '#268bd2', '#2aa198', '#859900', '#6c71c4',
      '#d33682', '#b58900', '#cb4b16', '#dc322f'
    ]
  },
  thorn: {
    name: 'Thorn',
    colors: [
      '#c9e4d4', '#b4d0bf', '#b4d0bf', '#3c6746',
      '#0e747b', '#4f8fa1', '#73a08d', '#6fa791',
      '#bf7021', '#c98a5a', '#fa5056', '#913069'
    ]
  },
  tokyonight: {
    name: 'Tokyo Night',
    colors: [
      '#1a1b26', '#16161e', '#12131b', '#a9b1d6',
      '#7aa2f7', '#7dcfff', '#2ac3de', '#9ece6a',
      '#e0af68', '#ff9e64', '#f7768e', '#bb9af7'
    ]
  },
  onedark: {
    name: 'One Dark',
    colors: [
      '#232b39', '#21252b', '#282c34', '#abb2bf',
      '#61afef', '#98c379', '#e5c07b', '#d19a66',
      '#e06c75', '#c678dd', '#528bcc', '#bb814f'
    ]
  },
  synthwave84: {
    name: 'Synthwave 84',
    colors: [
      '#2b213a', '#241b30', '#262335', '#f4eee4',
      '#2c75e7', '#5ed7ff', '#3e6af8', '#72f1b8',
      '#fede5d', '#ff8b39', '#d92c95', '#b399ff'
    ]
  }
};

export const paletteNames = Object.keys(colorPalettes).map(key => ({
  id: key,
  label: colorPalettes[key].name
}));
