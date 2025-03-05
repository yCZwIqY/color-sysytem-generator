import {useState} from "react";
import {Box, Button, Input} from "@mui/material";
interface EditableLabelProps {
    name: string;
    onChange: (newValue: string) => void;
}

const EditableLabel = ({name, onChange}: EditableLabelProps) => {
    const [inputValue, setInputValue] = useState(name);
    const [isEditMode, setIsEditMode] = useState(false);

    const onClick = () => {
        onChange(inputValue);
        setIsEditMode(false);
    }

    return <Box >
        {isEditMode ? <Box width={'100px'} display={'flex'} flexDirection={'column'} gap={'10px'}>
                <Input value={inputValue}
                       className={'w-24'}
                       fullWidth
                       onBlur={onClick}
                       style={{all: 'revert-layer'}}
                       sx={{
                           fontFamily: '양진체'
                       }}
                       onChange={e => setInputValue(e.target.value)}/>
            <Button variant="outlined"
                    sx={{
                        paddingY: '8px',
                        fontWeight: 'Bold',
                        borderRadius: '20px',
                        fontFamily: '양진체'
                    }}
                    onClick={onClick}>Edit</Button>
            </Box>
            : <Box  width={'100px'} onClick={() => setIsEditMode(true)}>{name}</Box>}

    </Box>
}

export default EditableLabel
