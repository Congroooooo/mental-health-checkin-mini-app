import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4A8B78",
      light: "#6BA898",
      dark: "#2D6658",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E18C5F",
      light: "#EBA882",
      dark: "#C4693A",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F2F7F5", 
    },
    text: {
      primary: "#1A2E28",
      secondary: "#4A6B62",
    },
    error: {
      main: "#D64545",
    },
    divider: "#D0E2DC",
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: "#1A2E28" },
    h5: { fontWeight: 700, color: "#1A2E28" },
    h6: { fontWeight: 600, color: "#1A2E28" },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          backgroundColor: "#4A8B78",
          "&:hover": { backgroundColor: "#2D6658" },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 4px rgba(45,74,64,0.10), 0 1px 2px rgba(45,74,64,0.06)",
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            backgroundColor: "#EAF2EF",
            color: "#2D4A40",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4A8B78",
            },
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#D0E2DC" },
      },
    },

    MuiRating: {
      styleOverrides: {
        iconFilled: { color: "#E18C5F" }, 
        iconHover: { color: "#C4693A" },
      },
    },
  },
});

export default theme;
