const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: inline-block;
        }
        button {
            font-family: Digital;
            display: inline-block;
            width: 6rem;
            height: 6rem;
            font-size: 3rem;
            font-weight: bold;
            cursor: pointer;
            transition: scale 0.2s ease, background-color 0.2s ease;
            background-color: #1a1a1a;
            border: solid 1px #535353;
            color: #fff; 
        }
        button:hover {
            scale: 1.05;
            background-color: #3c1414;
        }
        @media (prefers-color-scheme: light) {
            button {
                background-color: #ccc;
                color: #1a1a1a; 
            } 
        } 
    </style>
    <button>
        <slot></slot>
    </button>
`;
class CalcButton extends HTMLElement {
    button: HTMLButtonElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.append(template.content.cloneNode(true));
        this.button = this.shadowRoot!.querySelector('button')!;
        this.button.addEventListener('click', this);
    }

    connectedCallback() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        this.shadowRoot!.appendChild(node);
                    }
                }
            }
        });

        observer.observe(this, {childList: true});
    }

    handleEvent(event: Event) {
        if (event instanceof MouseEvent) {
            const func = this.attributes.getNamedItem("operator")?.value;
            if (typeof func === 'string') {
                this.dispatchEvent(new CustomEvent('operator', {detail: func, bubbles: true}));
                return;
            }

            const digit = this.attributes.getNamedItem("digit")?.value;
            if (typeof digit === 'string') {
                this.dispatchEvent(new CustomEvent('digit', {detail: digit, bubbles: true}));
            }
        }
    }
}

customElements.define('calc-button', CalcButton);
