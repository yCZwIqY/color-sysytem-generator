import {Chip} from "@mui/material";

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

    return <div className={'flex flex-col items-center gap-1'}>
        <button style={{background: color}}
             onClick={() => codyToClipboard(colorCodeName)}
             className={`w-24 h-24 flex justify-center items-center text-xs rounded-xl p-3 
                        text-center cursor-pointer transition-transform hover:scale-[1.05] active:scale-[0.95]
                        ${idx >= 5 ? 'text-white': 'text-black'}`}>
            {colorCodeName}
        </button>
        <Chip label={color} variant="outlined" onClick={() => codyToClipboard(color)}/>
    </div>
}

export default ColorBox
