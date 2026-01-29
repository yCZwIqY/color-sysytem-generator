import Header from './components/Header.tsx';
import { useRef, useState } from 'react';
import ColorBox from './components/ColorBox.tsx';
import EditableLabel from './components/EditableLabel.tsx';
import { Alert, Box, Button, Container, Input, Snackbar, Typography } from '@mui/material';
import Footer from './components/Footer.tsx';
import { Analytics } from '@vercel/analytics/react';

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

    const hexToRgb = (hex: string): [number, number, number] => {
        hex = hex.replace(/^#/, "");
        const bigint = parseInt(hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    const rgbToHex = ([r, g, b]: number[]) => {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    }

    const adjustBrightness = ([r, g, b]: number[], factor: number, isBrighter: boolean) => {
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

    const generateColorScale = (baseHex: string): string[] => {
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

            if (step === 500) {
                scale.push(baseHex.toUpperCase());
            } else {
                if (step < 500) {
                    factor = (500 - step) / 500;
                    isBrighter = true;
                } else {
                    factor = (900 - step) / 500 + 0.1;
                    isBrighter = false;
                }
                scale.push(rgbToHex(adjustBrightness(baseRgb as [number, number, number], factor, isBrighter)));
            }
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
            Object.entries(colors).filter((color) => {
                const [key] = color;
                return targetKey !== key
            })
        );
        setColors(newColors as ColorMap);
    }

    const copyToJson = () => {
        const result = `{\t\n${Object.keys(colors).map((key) => {
            return `\t'${key}': {\n${colors[key].map((color, idx) => `\t\t${(idx + 1) * 100}: '${color}',`).join('\n')}\n\t}`
        }).join(',\n')}\n}`

        showCopySuccessNotice(result);
    }

    const copyToCss = () => {
        const result = `@theme {\n${Object.keys(colors).map((key) =>
          colors[key].map((color, idx) => `\t--color-${key}-${(idx + 1) * 100}: '${color}';\n`).join(''),
        ).join('\n\n')}\n}`;
        showCopySuccessNotice(result);
    };

    const showCopySuccessNotice = async (text: string) => {
        await navigator.clipboard.writeText(text);
        noticeKey.current = text;
        setShowNotice(true);
        setNoticeMessage('Copy Success');
    }

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header/>
            <Box sx={{ mb: 3, p: 8 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    • 입력된 컬러를 기반으로 일관된 컬러 스케일을 자동 생성합니다.
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    • 색상 이름을 클릭하여 컬러 스케일의 이름을 변경할 수 있습니다.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    • Tailwind CSS 3/4 설정 파일에 바로 복사하여 사용 가능합니다.
                </Typography>
            </Box>
            <Container component="main"  sx={{ flex: 1,my: 10, mx: 'auto'}}>
                <Box display={'flex'} gap={'12px'} justifyContent={'center'} sx={{marginBottom: 8, flexWrap: 'wrap'}}>
                    <input value={`#${inputValue.replace('#', '')}`}
                           style={{
                               color: `#${inputValue.replace('#', '')}`,
                               width: '40px',
                               height: '40px',
                               borderRadius: '100px',
                               border: 'none',
                               outline:'none',
                           }}
                           onChange={e => setInputValue(e.target.value)}
                           type={'color'}/>
                    <Box position={'relative'}>
                        <Input sx={{fontFamily: '양진체'}} value={inputValue} onChange={e => setInputValue(e.target.value)}/>
                        {errorMsg &&
                          <Box position={'absolute'} marginTop={'10px'}>
                            <Alert variant="outlined" severity="error">
                                {errorMsg}
                            </Alert>
                          </Box>}
                    </Box>
                    <Button variant="outlined"
                            sx={{
                                paddingY: '8px',
                                fontWeight: 'Bold',
                                borderRadius: '20px',
                                fontFamily: '양진체'
                            }}
                            onClick={onClickAdd}
                    > Add </Button>
                </Box >
                <Box display={'flex'} flexDirection={'column'} gap={4}>
                    {Object.keys(colors).map((key, idx) =>
                        <Box key={key} display={'flex'} marginTop={'2px'} marginBottom={'4px'} gap={'15px'} alignItems={'center'}>
                            <EditableLabel name={key} onChange={(newValue) => onChangeColorName(idx, newValue)}/>
                            {colors[key].map((color, idx2) =>
                                <ColorBox showCopySuccessNotice={showCopySuccessNotice} colorName={key} color={color} idx={idx2}/>)}
                            <Button color="error"
                                    sx={{
                                        p: '10px',
                                        borderRadius: '20px',
                                        margin: '0 4px',
                                        marginTop: '-25px',
                                        fontFamily: '양진체'
                                    }}
                                    onClick={() => onRemove(key)}
                            > Remove </Button>
                        </Box>
                    )}
                </Box>
                <Box display={'flex'}
                     justifyContent={'center'}
                     marginY={'48px'}
                     sx={{ gap: '10px' }}>
                    <Button sx={{
                        paddingY: '8px',
                        borderRadius: '20px',
                        fontFamily: '양진체'
                    }}
                            variant="outlined"
                            onClick={() => copyToJson()}
                    >Json으로 복사하기 (TailwindCSS 3)</Button>
                    <Button sx={{
                        paddingY: '8px',
                        borderRadius: '20px',
                        fontFamily: '양진체',
                    }}
                            variant='outlined'
                            onClick={() => copyToCss()}
                    >CSS 로 복사하기 (TailwindCSS 4)</Button>
                </Box>
            </Container>
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
            <Footer/>
            <Analytics/>
        </Box>
    )
}

export default App
