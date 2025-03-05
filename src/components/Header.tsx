import {AppBar, Toolbar, Typography} from "@mui/material";

const Header = () => {
    return  <AppBar position="static"  sx={{background: 'white', color: 'black', display: "flex", justifyContent: "center", p: 1 }}>
        <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h6" fontFamily={'양진체'} fontWeight="bold" textAlign="center">
                Color System Generator
            </Typography>
        </Toolbar>
    </AppBar>
}

export default Header;
