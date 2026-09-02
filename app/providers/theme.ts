import { createTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },

    secondary: {
      main: "#dc004e",
    },

    background: {
      default: "#fafafa",
      paper: "#fff",
    },

    text: {
      primary: "#333333",
      secondary: "#667085",
    },

    error: {
      main: "#BF1D39",
    },
  },

  typography: {
    fontFamily: [
      '"Noto Sans JP"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),

    h1: {
      fontSize: "22px",
      fontWeight: 400,
    },

    h2: {
      fontSize: "20px",
      fontWeight: 500,
    },

    h3: {
      fontSize: "18px",
      fontWeight: 500,
    },

    h4: {
      fontSize: "16px",
      fontWeight: 500,
    },

    h5: {
      fontSize: "18px",
      fontWeight: 400,
    },

    h6: {
      fontSize: "18px",
      fontWeight: 400,
    },

    subtitle1: {
      fontSize: "16px",
      fontWeight: 700,
    },

    subtitle2: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.3,
    },

    body1: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: 1.3,
    },

    body2: {
      fontSize: "15px",
      fontWeight: 500,
      lineHeight: 1.3,
    },

    caption: {
      fontSize: "14px",
      fontWeight: 500,
    },

    button: {
      fontSize: "16px",
      fontWeight: 500,
      textTransform: "none",
    },
  },

  components: {
    /**
     * GLOBAL INPUT LABEL
     */
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.body1,
          color: theme.palette.text.primary,
          fontWeight: 500,
        }),

        sizeSmall: ({ theme }) => ({
          ...theme.typography.body2,
          color: theme.palette.text.primary,
        }),
      },
    },

    /**
     * GLOBAL OUTLINED INPUT
     */
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.body1,

          fontWeight: 400,
          borderRadius: "8px",
          backgroundColor: theme.palette.background.paper,

          padding: "0.75em 14px",

          // Normal border
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "#D0D5DD",
            borderWidth: "1px",
          },

          // Hover
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "#98A2B3",
          },

          // Focus
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.primary.main,
            borderWidth: "1.5px",
          },

          // Error
          [`&.Mui-error .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.error.main,
          },

          // Disabled
          "&.Mui-disabled": {
            backgroundColor: "#F2F4F7",
          },

          [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "#EAECF0",
          },

          [theme.breakpoints.down("sm")]: {
            ...theme.typography.body1,
            padding: "0.67em 12px",
          },
        }),

        input: {
          padding: 0,
          height: "unset",

          "&::placeholder": {
            color: "#98A2B3",
            opacity: 1,
          },

          "&.Mui-disabled": {
            WebkitTextFillColor: "#333333",
          },
        },

        sizeSmall: ({ theme }) => ({
          ...theme.typography.body2,
        }),
      },
    },

    /**
     * GLOBAL BUTTON
     */
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "none",
          textTransform: "none",

          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  },
});
