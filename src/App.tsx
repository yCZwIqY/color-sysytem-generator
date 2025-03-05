import Header from "./components/Header.tsx";
import {useRef, useState} from "react";
import ColorBox from "./components/ColorBox.tsx";
import EditableLabel from "./components/EditableLabel.tsx";
import {Alert, Button, Input, Snackbar} from "@mui/material";

interface ColorMap {
    [key: string]: string[]
}

const App = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [colors, setColors] = useState<ColorMap>({});
    const [errorMsg, setErrorMsg] = useState<string>('');
    const lastNum = useRef(0);
    const [noticeMessage, setNoticeMessage] = useState('');
    const [showNotice, setShowNotice] = useState(false);
    const noticeKey = useRef('');

    const hexToRgb = (hex) => {
        hex = hex.replace(/^#/, "");
        let bigint = parseInt(hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    const rgbToHex = ([r, g, b]) => {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    }

    const adjustBrightness = ([r, g, b], factor, isBrighter) => {
        return isBrighter
            ? [
                Math.min(255, Math.round(r + (255 - r) * factor)),
                Math.min(255, Math.round(g + (255 - g) * factor)),
                Math.min(255, Math.round(b + (255 - b) * factor)),
            ]
            : [
                Math.max(0, Math.round(r * factor + 10)),
                Math.max(0, Math.round(g * factor + 10)),
                Math.max(0, Math.round(b * factor + 10)),
            ];
    }

    const generateColorScale = (baseHex, minFactor = 1.4, maxFactor = 0.6): string[] => {
        const baseRgb = hexToRgb(baseHex);

        if (baseHex.toUpperCase() === "#000000") {
            return [
                "#E0E0E0",
                "#C0C0C0",
                "#A0A0A0",
                "#808080",
                "#606060",
                "#404040",
                "#303030",
                "#202020",
                "#101010"
            ]
        }

        if (baseHex.toUpperCase() === "#FFFFFF") {
            return [
                "#FFFFFF",
                "#E6E6E6",
                "#CCCCCC",
                "#B3B3B3",
                "#999999",
                "#808080",
                "#666666",
                "#4D4D4D",
                "#333333"
            ]
        }

        const scale = [];
        for (let step = 100; step <= 900; step += 100) {
            let factor;
            let isBrighter;

            if (step < 500) {
                factor = (500 - step) / 500;
                isBrighter = true;
            } else {
                factor = (900 - step) / 500 + 0.1;
                isBrighter = false;
            }

            scale.push(rgbToHex(adjustBrightness(baseRgb, factor, isBrighter)));
        }

        return scale;
    }


    const onClickAdd = () => {
        if (!inputValue) {
            setErrorMsg('Please enter a value.');
            return;
        }
        if (!/^#?[0-9A-Fa-f]{6}$/.test(inputValue)) {
            setErrorMsg('It\'s not the Hex code value.')
            return;
        }

        setErrorMsg('');
        setColors(prev => ({
            ...prev,
            [`color-${lastNum.current}`]: generateColorScale(`#${inputValue.replace('#', '')}`)
        }));
        lastNum.current++
    }

    const onChangeColorName = (targetIdx: number, newName: string) => {
        if (Object.keys(colors).find(key => key === newName)) {
            alert('The name already exists.');
            return;
        }
        const newColors = Object.fromEntries(
            Object.entries(colors).map(([key, value], idx) =>
                targetIdx === idx ? [newName, value] : [key, value]
            )
        )
        setColors(newColors as ColorMap);
    }

    const onRemove = (targetKey: string) => {
        const newColors = Object.fromEntries(
            Object.entries(colors).filter(([key, value]) => targetKey !== key)
        );
        setColors(newColors as ColorMap);
    }

    const copyToJson = () => {
        const result = `{\t\n${Object.keys(colors).map((key) => {
            return `\t'${key}': {\n${colors[key].map((color, idx) => `\t\t${(idx + 1) * 100}: '${color}',`).join('\n')}\n\t}`
        }).join(',\n')}\n}`

        showCopySuccessNotice(result);
    }

    const showCopySuccessNotice = async (text: string) => {
        await navigator.clipboard.writeText(text);
        noticeKey.current = text;
        setShowNotice(true);
        setNoticeMessage('Copy Success');
    }

    return (
        <>
            <Header/>
            <main className={'max-w-[1200px] mx-auto'}>
                <div className={'flex justify-center mb-18'}>
                    <input value={`#${inputValue.replace('#', '')}`}
                           className={'w-20 h-10 border-none outline-none block rounded-md shadow-md'}
                           onChange={e => setInputValue(e.target.value)}
                           type={'color'}/>
                    <div className={'relative'}>
                        <Input value={inputValue} onChange={e => setInputValue(e.target.value)}
                               className={`${errorMsg ? 'border-red-600' : 'border-black'} rounded-md mx-2 px-2 py-1`}/>
                        {errorMsg && <Alert className={'absolute mt-2 w-full'} variant="outlined" severity="error">
                            {errorMsg}
												</Alert>}
                    </div>
                    <Button className={'px-6 py-2  font-bold rounded-md mx-2 text-white '}
                            variant="outlined"
                            onClick={onClickAdd}
                    > Add </Button>
                </div>
                <div>
                    {Object.keys(colors).map((key, idx) =>
                        <div key={key} className={'flex my-2 gap-3 items-center mb-4'}>
                            <div className={'w-24'}>
                                <EditableLabel name={key} onChange={(newValue) => onChangeColorName(idx, newValue)}/>
                            </div>
                            {colors[key].map((color, idx2) =>
                                <ColorBox showCopySuccessNotice={showCopySuccessNotice} colorName={key} color={color} idx={idx2}/>)}
                            <Button color="error"
                                    className={'p-2 bg-red-300 font-bold rounded-md mx-2 text-white'}
                                    onClick={() => onRemove(key)}
                            > Remove </Button>
                        </div>
                    )}
                </div>
                <div className={'flex justify-end mt-12'}>
                    <Button className={'p-2 font-bold rounded-md mx-2 text-white'}
                            variant="outlined"
                            onClick={() => copyToJson()}
                    >Copy in Json </Button>
                </div>
            </main>
            <Snackbar
                open={showNotice}
                autoHideDuration={10000}
                key={noticeKey.current}
                onClose={() => setShowNotice(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert style={{background: 'white'}}
                       severity="success" variant="outlined" onClose={() => setShowNotice(false)}>
                    {noticeMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default App
