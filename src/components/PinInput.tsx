import { useRef, useEffect, useState, useCallback } from "react";

type IPinInputProp = {
    length: number;
    secret: boolean;
    pinDefault?: string;
    regex: string;
    handleFillFull: (pinValue: string) => void
}

const BACKSPACE_KEY = 'Backspace';

export function PinInput({ length, secret, regex, pinDefault, handleFillFull }: IPinInputProp) {
    const inputsRef = useRef<HTMLInputElement[]>([])

    const [pin, setPin] = useState<Array<string | undefined>>(
        pinDefault?.split("") || new Array(length).fill(undefined)
    );

    const onPinChanged = useCallback((pinItemValue: string | undefined, index: number) => {
        setPin((previousPin) => {
            return previousPin.map((pinItem, idx) => {
                if (idx === index) {
                    return pinItemValue;
                }

                return pinItem
            })
        });
    }, []);

    const changeFocus = (index: number) => {
        inputsRef.current[index]?.focus()
    }

    useEffect(() => {
        inputsRef.current = inputsRef.current.slice(0, length);
    }, [length]);

    useEffect(() => {
        changeFocus(0)
    }, []);

    useEffect(() => {
        const isFullFilled = pin.every(pinItem => pinItem !== undefined);
        if (isFullFilled) {
            handleFillFull(pin.join(""))
        }
    }, [handleFillFull, pin]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const keyboardKeyCode = event.nativeEvent.code;
        if (keyboardKeyCode !== BACKSPACE_KEY) {
            return;
        }

        if (pin[index] === undefined) {
            changeFocus(index - 1);
        } else {
            onPinChanged(undefined, index);
        }
    }, [onPinChanged, pin]);

    const onChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = event.target.value;
        if (!value) {
            return;
        }
        if (new RegExp(regex).test(value.trim())) {
            onPinChanged(value.trim(), index);
            if (index < length - 1) {
                changeFocus(index + 1);
            }
        }
    }, [length, onPinChanged, regex]);

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        const value = event.clipboardData.getData('text');
        value?.split("")
            .filter(inputPin => inputPin && new RegExp(regex).test(inputPin.trim()))
            .forEach((inputPin, idx) => onPinChanged(inputPin, index + idx));
        return false;
    }

    return (
        <div className="flex">
            {
                pin.map((value, index) => (
                    <input
                        onPaste={(event) => handlePaste(event, index)}
                        key={`input_${index}`}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        onChange={(event) => onChange(event, index)}
                        value={value}
                        type={secret ? "password" : "text"}
                        maxLength={1}
                        className="text-center w-[40px] mx-2 p-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        ref={el => {
                            if (el) {
                                inputsRef.current[index] = el
                            }
                        }}
                    />
                ))
            }
        </div>
    )
}