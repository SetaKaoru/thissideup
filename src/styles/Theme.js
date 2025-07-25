// File: src/styles/theme.js
export const theme = {
  colors: {
    primaryPurple: '#5D3FD3', // A vibrant purple, adjust as needed
    primaryPurpleLight: '#7A5FD3',
    secondaryPeach: '#FFDAB9', // Peachpuff like
    secondaryPeachDark: '#FFA07A', // Light Salmon for contrast
    textLight: '#FFFFFF',
    textDark: '#333333',
    textGray: '#757575', // For placeholder text or secondary info
    backgroundLight: '#F8F8F8', // Very light gray for page backgrounds
    backgroundDark: '#1A1A1A', // Dark background for main content areas
    backgroundDarkLighter: '#2C2C2C', // For cards on dark background
    accentGreen: '#A0C888', // From design page
    accentPink: '#F2C2CE',   // From design page
    accentYellowGreen: '#BDCE62', // From design page
    errorRed: '#D32F2F',
    successGreen: '#388E3C',
    lightGrayBorder: '#E0E0E0',
    neutralGray: '#BDBDBD', // For icons, subtle text
    inputBackground: '#FFFFFF',
    inputPlaceholder: '#A0A0A0',
  },
  fonts: {
    main: 'Helvetica, Arial, sans-serif', // Fallback sans-serif
    heading: '"Times New Roman", Times, serif', // Fallback for "Inrai Serif"
  },
  fontSizes: {
    small: '0.875rem', // 14px
    medium: '1rem',    // 16px
    large: '1.25rem',  // 20px
    xlarge: '1.5rem',  // 24px
    xxlarge: '2rem',   // 32px
    hero: '3rem',      // 48px
  },
  spacing: {
    xs: '0.25rem', // 4px
    s: '0.5rem',  // 8px
    m: '1rem',    // 16px
    l: '1.5rem',  // 24px
    xl: '2rem',   // 32px
    xxl: '3rem',  // 48px
  },
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  headerHeight: '70px',
  footerHeight: '200px', // Approximate
  // Add breakpoints for responsiveness if needed
  // breakpoints: {
  //   mobile: '576px',
  //   tablet: '768px',
  //   desktop: '992px',
  // },
};

