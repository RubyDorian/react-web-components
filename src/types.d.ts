import {DetailedHTMLProps, HTMLAttributes} from 'react';

interface CalcButtonProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    operator?: string;
    digit?: string;
    onDigit?: (e: CustomEvent<string>) => void;
    onOperator?: (e: CustomEvent<string>) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'calc-button': CalcButtonProps
        }
    }
}
