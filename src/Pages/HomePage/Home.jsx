import React from 'react'
import theme from '../../Theme/theme';

const Login = () => {
  return (
    <div style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        fontFamily: theme.fonts.main,
        padding: '20px',
        borderRadius: '8px'
      }}>
        Welcome to the Dashboard!
      </div>
  )
}

export default Login
