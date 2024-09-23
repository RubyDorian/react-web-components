import {useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';

import '../web-components/calcButton';

const CalculatorContainer = styled.div`
    & {
        display: inline-block;
        font-family: Digital;
    }
    & > .buttons > .block {
        display: grid;
        justify-content: start;
        grid-template-columns: repeat(4, auto);
        margin: 20px;
    }
    & > .log {
        font-size: 2rem;
        height: 14rem;
        overflow-y: auto;
        white-space: pre;
    }
    & > .current-value {
        font-size: 4rem;
    }
`;

type OperatorStack = {
    operator: string;
    value: string
};

const useCalculator = () => {
    const [operatorStack, setOperatorStack] = useState<OperatorStack | null>(null);
    const [logLines, setLogLines] = useState<string[]>([]);
    const [currentValue, setCurrentValue] = useState('');
    const stackRef = useRef(operatorStack);
    const valueRef = useRef(currentValue);

    useEffect(() => {
        stackRef.current = operatorStack;
        valueRef.current = currentValue;
    }, [currentValue]);

    const putDigit = (digit: string) => {
        setCurrentValue(val => val + digit);
    };

    const execOperator = (operator: string) => {
        const operatorStack = stackRef.current;
        const currentValue = valueRef.current;
        switch (operator) {
            case 'add':
                setLogLines(val => [...val, currentValue, '+']);
                setOperatorStack({operator, value: currentValue});
                setCurrentValue('');
                break;
            case 'sub':
                setLogLines(val => [...val, currentValue, '-']);
                setOperatorStack({operator, value: currentValue});
                setCurrentValue('');
                break;
            case 'multiply':
                setLogLines(val => [...val, currentValue, '*']);
                setOperatorStack({operator, value: currentValue});
                setCurrentValue('');
                break;
            case 'divide':
                setLogLines(val => [...val, currentValue, '/']);
                setOperatorStack({operator, value: currentValue});
                setCurrentValue('');
                break;
            case 'backspace':
                if (currentValue.length > 0) {
                    setCurrentValue(val => val.slice(0, val.length - 1));
                }
                break;
            case 'equal':
                if (!operatorStack) {
                    return;
                }
                setLogLines(val => [...val, currentValue]);
                const firstValue = parseInt(operatorStack.value, 10);
                const curValue = parseInt(currentValue, 10);
                switch (operatorStack.operator) {
                    case 'add':
                        setCurrentValue((firstValue + curValue).toString());
                        break;
                    case 'sub':
                        setCurrentValue((firstValue - curValue).toString());
                        break;
                    case 'multiply':
                        setCurrentValue((firstValue * curValue).toString());
                        break;
                    case 'divide':
                        setCurrentValue((firstValue / curValue).toString());
                        break;
                }
                setLogLines(val => [...val, `=${currentValue}`]);
                setOperatorStack(null);
                break;
            case 'reset':
                setCurrentValue('');
                break;
        }
    };

    return {
        currentValue,
        logLines,
        putDigit,
        execOperator,
    };
};

export const Calculator = () => {
    const buttonsRef = useRef<HTMLDivElement>(null);
    const {currentValue, execOperator, logLines, putDigit} = useCalculator();
    const handleDigit = (e: CustomEvent<string>) => {
        putDigit(e.detail);
    };
    const handleOperator = (e: CustomEvent<string>) => {
        execOperator(e.detail);
    };
    const logsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        buttonsRef.current?.addEventListener('digit', handleDigit as EventListener);
        buttonsRef.current?.addEventListener('operator', handleOperator as EventListener);

        return () => {
            buttonsRef.current?.removeEventListener('digit', handleDigit as EventListener);
            buttonsRef.current?.removeEventListener('operator', handleOperator as EventListener);
        };
    }, []);

    useEffect(() => {
        if (!logsRef.current) {
            return;
        }
        logsRef.current.scrollTo(0, logsRef.current.scrollHeight);
    }, [logLines]);

    return (
        <CalculatorContainer>
            <div className="log" ref={logsRef}>{logLines.join('\n')}</div>
            <div className="current-value">{currentValue === '' ? ' ' : currentValue}</div>
            <div className="buttons" ref={buttonsRef}>
                <div className="block">
                    <calc-button digit="1">1</calc-button>
                    <calc-button digit="2">2</calc-button>
                    <calc-button digit="3">3</calc-button>
                    <calc-button digit="4">4</calc-button>
                    <calc-button digit="5">5</calc-button>
                    <calc-button digit="6">6</calc-button>
                    <calc-button digit="7">7</calc-button>
                    <calc-button digit="8">8</calc-button>
                    <calc-button digit="9">9</calc-button>
                    <calc-button digit="0">0</calc-button>
                </div>
                <div className="block">
                    <calc-button operator="add">+</calc-button>
                    <calc-button operator="sub">-</calc-button>
                    <calc-button operator="multiply">*</calc-button>
                    <calc-button operator="divide">/</calc-button>
                </div>
                <div className="block">
                    <calc-button operator="backspace">◀️</calc-button>
                    <calc-button operator="reset">C</calc-button>
                    <calc-button operator="equal">=</calc-button>
                </div>
            </div>
        </CalculatorContainer>
    );
};
