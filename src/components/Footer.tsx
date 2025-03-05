import {Box, Container, Link, Typography} from "@mui/material";

const Footer = () => {
    return <Box
        component="footer"
        sx={{
            py: 3,
            px: 2,
            mt: "auto",
            backgroundColor: (theme) => theme.palette.grey[900],
            color: (theme) => theme.palette.grey[300],
        }}
    >
        <Container maxWidth="lg">
            <Typography variant="body2" align="center">
                © {new Date().getFullYear()} Color System Generator. All rights reserved.
            </Typography>
            <Typography variant="body2" align="center">
                <Link
                    href="https://github.com/yCZwIqY/color-sysytem-generator"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="hover"
                >
                    GitHub Repository
                </Link>
            </Typography>
        </Container>
    </Box>
}

export default Footer
