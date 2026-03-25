// Color palettes for wallpaper colorization
// Based on industry-standard definitions from official palette repositories

export const colorPalettes = {
  dracula: {
    name: 'Dracula',
    colors: [
      '#282a36', '#44475a', '#6272a4', '#f8f8f2',
      '#ff79c6', '#ff5555', '#ffb86c', '#50fa7b',
      '#8be9fd', '#bd93f9', '#f1fa8c'
    ]
  },
  catppuccin: {
    name: 'Catppuccin',
    colors: [
      '#1e1e2e', '#45475a', '#585b70', '#cdd6f4',
      '#f38ba8', '#eba0ac', '#fab387', '#a6e3a1',
      '#94e2d5', '#89b4fa', '#cba6f7', '#f5c2e7'
    ]
  },
  dawnfox: {
    name: 'Dawnfox',
    colors: [
      '#faf4ed', '#f2ede5', '#e6ddd7', '#9e9b93',
      '#ce5d97', '#c16743', '#d7935e', '#829400',
      '#4a7c59', '#477593', '#5e409d', '#9e8ba9'
    ]
  },
  everforest: {
    name: 'Everforest',
    colors: [
      '#2d3f34', '#374239', '#424855', '#d3c6aa',
      '#e67e22', '#be3f48', '#ef7b45', '#a7c957',
      '#83c092', '#7fbbb3', '#7ec7a0', '#d699b6'
    ]
  },
  gruvbox: {
    name: 'Gruvbox',
    colors: [
      '#282828', '#3c3836', '#504945', '#ebdbb2',
      '#fb4934', '#cc241d', '#fe8019', '#b8bb26',
      '#8ec07c', '#83a598', '#d3869b', '#d65d0e'
    ]
  },
  kanagawa: {
    name: 'Kanagawa',
    colors: [
      '#1f1f28', '#2d2d3d', '#38383f', '#c5c9c5',
      '#f7768e', '#ff9e64', '#e0af68', '#9ece6a',
      '#7aa2f7', '#bb9af7', '#7dcfff', '#b4f9f8'
    ]
  },
  nord: {
    name: 'Nord',
    colors: [
      '#2e3440', '#3b4252', '#434c5e', '#d8dee9',
      '#bf616a', '#d08770', '#ebcb8b', '#a3be8c',
      '#81a1c1', '#5e81ac', '#88c0d0', '#b48ead'
    ]
  },
  rosepinedawn: {
    name: 'Rose Pine Dawn',
    colors: [
      '#faf4ed', '#fffaf3', '#f2ede5', '#b7a1a6',
      '#d7827e', '#d7827e', '#d5a021', '#286983',
      '#56949f', '#757399', '#c4a7e7', '#ea9d34'
    ]
  },
  solarized: {
    name: 'Solarized',
    colors: [
      '#002b36', '#073642', '#586e75', '#93a1a1',
      '#dc322f', '#cb4b16', '#b58900', '#859900',
      '#2aa198', '#268bd2', '#6c71c4', '#d33682'
    ]
  },
  thorn: {
    name: 'Thorn',
    colors: [
      '#010101', '#1a1a1a', '#323232', '#d5d5d5',
      '#a30000', '#d5005d', '#d57a35', '#5e8700',
      '#00807d', '#106ba3', '#7030a0', '#c06c84'
    ]
  },
  tokyonight: {
    name: 'Tokyo Night',
    colors: [
      '#1a1b26', '#16161e', '#292e42', '#c0caf5',
      '#f7768e', '#ff7a8f', '#ffa500', '#9ece6a',
      '#7aa2f7', '#ad8ee1', '#449dab', '#41a6b5'
    ]
  },
  onedark: {
    name: 'One Dark',
    colors: [
      '#282c34', '#3c3f4d', '#3c3f4d', '#abb2bf',
      '#e06c75', '#d19a66', '#e5c07b', '#98c379',
      '#56b6c2', '#61afef', '#c678dd', '#be5046'
    ]
  },
  synthwave84: {
    name: 'Synthwave 84',
    colors: [
      '#0a0e27', '#16213e', '#1d3a5c', '#72f1eb',
      '#ff006e', '#ff10f0', '#ffd60a', '#06ffa5',
      '#00d9ff', '#00a9ff', '#c400ff', '#ff4365'
    ]
  }
};

export const paletteNames = Object.keys(colorPalettes).map(key => ({
  id: key,
  label: colorPalettes[key].name
}));
