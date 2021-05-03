import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    color: {
      backgroundColor: string
      boxColor: string
      primaryColor: string
      primaryHoverColor: string
      textColor: string
      subTextColor: string
    }
  }
}