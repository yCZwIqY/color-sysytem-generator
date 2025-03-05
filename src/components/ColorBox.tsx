import {Box, Chip} from "@mui/material";

interface ColorBoxProps {
    color: string;
    colorName: string;
    idx: number;
    showCopySuccessNotice: (text: string) => void
}
const ColorBox = ({colorName, color, idx, showCopySuccessNotice}: ColorBoxProps) => {
    const colorCodeName = `${colorName}-${(idx+1)*100}`;
    const codyToClipboard = async (text: string) => {
        showCopySuccessNotice(text);
        await navigator.clipboard.writeText(text);
    }

    return <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={1}>
        <Box style={{background: color}}
             sx={{
                 background: color,
                 cursor: 'pointer',
                 ":hover": {
                     scale: 1.05
                 },
                 transition: 'scale .15s cubic-bezier(0.4, 0, 0.2, 1)'
             }}
             width={'74px'}
             height={'74px'}
             p={'12px'}
             borderRadius={'12px'}
             fontSize={'11px'}
             fontFamily={'양진체'}
             textAlign={'center'}
             display={'flex'}
             justifyContent={'center'}
             alignItems={'center'}
             onClick={() => codyToClipboard(colorCodeName)}
             color={idx >= 5 ? 'white': 'black'}>
            {colorCodeName}
        </Box>
        <Chip sx={{fontFamily: '양진체'}} label={color} variant="outlined" onClick={() => codyToClipboard(color)}/>
    </Box>
}

export default ColorBox
