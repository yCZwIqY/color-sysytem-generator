interface ColorBoxProps {
    color: string;
    colorName: string;
    idx: number;
}
const ColorBox = ({colorName, color, idx}: ColorBoxProps) => {
    return <div>
        <div style={{background: color}} className={`w-24 h-24 flex justify-center items-center
                                                       text-sm
                                                    ${idx >= 5 ? 'text-white': 'text-black'}`}>
            {colorName}-{(idx+1)*100}
        </div>
        <div className={'text-center'}>{color}</div>
    </div>
}

export default ColorBox
