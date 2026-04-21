import type { ThemeConfig } from 'antd';

const designTheme: ThemeConfig = {
  token: {
    colorPrimary: '#4096ff',
    borderRadius: 12,
    colorText: '#5C6166',
    colorTextHeading: '#1F1E33',
    colorTextDescription: '#5C6166',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  },
  components: {
    Button: {
      controlHeight: 48,
      borderRadius: 12,
      fontWeight: 600,
    },
    Input: {
      controlHeight: 48,
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 32,
    },
  },
};

export { designTheme };
