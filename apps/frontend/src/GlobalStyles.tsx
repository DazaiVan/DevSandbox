import { Global, css, CSSObject } from '@emotion/react'

const styles: Record<string, CSSObject> = {
  root: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    lineHeight: 1.5,
    fontWeight: 400,
    colorScheme: 'light dark',
    color: 'rgba(255, 255, 255, 0.87)',
    backgroundColor: '#242424',
    fontSynthesis: 'none',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  },
  a: {
    fontWeight: 500,
    color: '#646cff',
    textDecoration: 'inherit',
    '&:hover': {
      color: '#535bf2'
    }
  },
  body: {
    margin: 0,
    display: 'flex',
    placeItems: 'center',
    minWidth: '320px',
    minHeight: '100vh'
  },
  h1: {
    fontSize: '3.2em',
    lineHeight: 1.1
  },
  button: {
    borderRadius: '8px',
    border: '1px solid transparent',
    padding: '0.6em 1.2em',
    fontSize: '1em',
    fontWeight: 500,
    fontFamily: 'inherit',
    backgroundColor: '#1a1a1a',
    cursor: 'pointer',
    transition: 'border-color 0.25s',
    '&:hover': {
      borderColor: '#646cff'
    },
    '&:focus, &:focus-visible': {
      outline: '4px auto -webkit-focus-ring-color'
    }
  },

  lightScheme: {
    '@media (prefers-color-scheme: light)': {
      ':root': {
        color: '#213547',
        backgroundColor: '#ffffff'
      },
      'a:hover': {
        color: '#747bff'
      },
      button: {
        backgroundColor: '#f9f9f9'
      }
    }
  },
  appContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  canvasContainer: {
    width: '100%', // изменено с flex: 1
    height: '100vh',
    position: 'relative', // важно для позиционирования правой панели
    overflow: 'hidden'
  },
  rightPanel: {
    width: '300px',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    borderLeft: '1px solid #333',
    padding: '20px',
    overflowY: 'auto',
    color: 'white',
    position: 'absolute', // абсолютное позиционирование
    right: 0, // прижимаем к правому краю
    top: 0, // прижимаем к верхнему краю
    zIndex: 10, // поверх других элементов
    '& h2': {
      marginTop: 0,
      paddingBottom: '10px',
      borderBottom: '1px solid #333'
    },
    '& .panel-content': {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    '& button': {
      width: '100%',
      padding: '10px',
      backgroundColor: '#333',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#444'
      }
    }
  },
}

const GlobalStyles = () => (
  <Global
    styles={css({
      ':root': styles.root,
      a: styles.a,
      body: styles.body,
      h1: styles.h1,
      button: styles.button,
      '.app-container': styles.appContainer,
      '.canvas-container': styles.canvasContainer,
      '.right-panel': styles.rightPanel,
      ...styles.lightScheme
    })}
  />
)

export default GlobalStyles