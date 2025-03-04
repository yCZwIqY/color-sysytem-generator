import Header from "./components/Header.tsx";
import {Button, Input} from "jy-headless";
import {useState} from "react";
import ColorBox from "./components/ColorBox.tsx";
import EditableLabel from "./components/EditableLabel.tsx";

interface ColorMap {
    [key: string]: string[]
}

const App = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [colors, setColors] = useState<ColorMap>({});
    const [errorMsg, setErrorMsg] = useState<string>('')
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
                Math.max(0, Math.round(r * factor)),
                Math.max(0, Math.round(g * factor)),
                Math.max(0, Math.round(b * factor)),
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
                factor = (500 - step) / 500; // 50 → 0.9, 100 → 0.8, ..., 400 → 0.2
                isBrighter = true;
            } else {
                factor = (900 - step) / 400; // 600 → 0.75, 700 → 0.5, 900 → 0.0
                isBrighter = false;
            }

            scale.push(rgbToHex(adjustBrightness(baseRgb, factor, isBrighter)));
        }

        return scale;
    }


    const onClickAdd = () => {
        if (!inputValue) {
            setErrorMsg('값을 입력해주세요');
            return;
        }
        if (!/^#?[0-9A-Fa-f]{6}$/.test(inputValue)) {
            setErrorMsg('색상 값이 아닙니다.')
            return;
        }

        setErrorMsg('')
        setColors(prev => ({
            ...prev,
            [`color-0${Object.keys(colors).length}`]: generateColorScale(`#${inputValue.replace('#', '')}`)
        }))
    }

    const onChangeColorName = (targetIdx: number, newName: string) => {
      const newColors =  Object.fromEntries(
            Object.entries(colors).map(([key, value], idx) =>
                targetIdx === idx ? [newName, value] : [key, value]
            )
        )
        setColors(newColors as ColorMap);
    }

    return (
        <>
            <Header/>
            <main className={'max-w-[1200px] mx-auto'}>
                <div className={'flex justify-center mb-12'}>
                    <input value={`#${inputValue.replace('#', '')}`}
                           className={'w-20 h-10 border-none outline-none block rounded-md shadow-md'}
                           onChange={e => setInputValue(e.target.value)}
                           type={'color'}/>
                    <Input value={inputValue} onChange={e => setInputValue(e.target.value)}
                           error={<div className={'absolute top-[100%] text-red-600'}>{errorMsg}</div>}
                           showError={!!errorMsg}
                           className={'text-black'}
                           containerClassName={`border ${errorMsg ? 'border-red-600' : 'border-black'} rounded-md px-2 py-1`}/>
                    <Button className={'px-6 py-2 bg-violet-300 font-bold rounded-md mx-2'}
                            onClick={onClickAdd}
                    > ADD </Button>
                </div>
                <div>
                    {Object.keys(colors).map((key, idx) =>
                        <div className={'flex my-2 gap-2 items-center'}>
                            <div className={'w-24'}>
                                <EditableLabel name={key} onChange={(newValue) => onChangeColorName(idx, newValue)}/>
                            </div>
                            {colors[key].map((color, idx2) =>
                                <ColorBox colorName={key} color={color} idx={idx2}/>)}
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

export default App
