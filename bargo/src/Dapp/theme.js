import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: "#763df2",
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
      },
      fightClub:{
        main: '#f5f542',
      }
    },

    components: {
        MuiTypography: {
            styleOverrides: {
              // Name of the slot
              root: {
                // Some CSS
                fontSize: '50px',
                fontFamily: 'fightThis',
               
              },
            },
          },
    }
  });