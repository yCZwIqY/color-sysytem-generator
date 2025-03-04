import {useState} from "react";
import {Button, Input} from "jy-headless";

interface EditableLabelProps {
    name: string;
    onChange: (newValue: string) => void;
}

const EditableLabel = ({name, onChange}: EditableLabelProps) => {
    const [inputValue, setInputValue] = useState(name);
    const [isEditMode, setIsEditMode] = useState(false);

    const onClick = (e) => {
        onChange(inputValue);
        setIsEditMode(false);
    }

    return <div>
        {isEditMode ? <div className={'flex flex-col gap-2'}>
                <Input value={inputValue}
                       className={'w-24'}
                       onBlur={onClick}
                       style={{all: 'revert-layer'}}
                       onChange={e => setInputValue(e.target.value)}/>
            <Button className={'border border-violet-300 font-bold rounded-md justify-center text-violet-300 '} onClick={onClick}>수정</Button>
            </div>
            : <div onClick={() => setIsEditMode(true)}>{name}</div>}

    </div>
}

export default EditableLabel
