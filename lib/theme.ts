export const theme = {
  colors: {
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    accent: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
    gradient: {
      from: '#6366f1', // indigo-500
      via: '#8b5cf6', // purple-500
      to: '#ec4899', // pink-500
    },
    success: '#10b981', // green-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
  },
  gradients: {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    primaryDark: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
    text: 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent',
    button: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
    card: 'bg-gradient-to-br from-purple-50 to-pink-50',
  },
  styles: {
    primaryButton: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700',
    secondaryButton: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    outlineButton: 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50',
    dangerButton: 'bg-red-500 text-white hover:bg-red-600',
    successButton: 'bg-green-500 text-white hover:bg-green-600',
    activeTab: 'border-purple-600 text-purple-600',
    inactiveTab: 'text-gray-600 hover:text-purple-600',
    card: 'bg-white shadow-sm hover:shadow-md transition-shadow',
    input: 'border-gray-300 focus:border-purple-500 focus:ring-purple-500',
  }
}