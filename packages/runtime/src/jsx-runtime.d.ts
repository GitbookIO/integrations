import type {
    ContentKitBox,
    ContentKitButton,
    ContentKitCard,
    ContentKitCodeBlock,
    ContentKitDivider,
    ContentKitHStack,
    ContentKitMarkdown,
    ContentKitVStack,
    ContentKitWebFrame,
    ContentKitTextInput,
    ContentKitText,
    ContentKitBlock,
    ContentKitImage,
    ContentKitSelect,
    ContentKitStepper,
    ContentKitStepperStep,
    ContentKitSwitch,
    ContentKitRadio,
    ContentKitCheckbox,
    ContentKitModal,
    ContentKitInput,
    ContentKitHint,
    ContentKitLink,
    ContentKitConfiguration,
} from '@gitbook/api';

import type { jsx, jsxDEV, jsxs, Fragment } from './contentkit-jsx';

/**
 * This is a workaround for Typescript not supporting subpath exports in package.json
 * https://github.com/microsoft/TypeScript/issues/33079
 */

declare module '@gitbook/runtime/jsx-runtime' {
    export type jsx = typeof jsx;
    export type jsxs = typeof jsxs;
    export type jsxDEV = typeof jsxDEV;
    export type Fragment = typeof Fragment;
}

type OmitType<T> = Omit<T, 'type'>;

declare global {
    namespace JSX {
        interface ElementChildrenAttribute {
            children: Record<string, unknown>; // specify children name to use
        }

        interface IntrinsicElements {
            configuration: OmitType<ContentKitConfiguration>;
            block: OmitType<ContentKitBlock>;
            button: OmitType<ContentKitButton>;
            box: OmitType<ContentKitBox>;
            vstack: OmitType<ContentKitVStack>;
            hstack: OmitType<ContentKitHStack>;
            divider: OmitType<ContentKitDivider>;
            text: OmitType<ContentKitText>;
            hint: OmitType<ContentKitHint>;
            link: OmitType<ContentKitLink>;
            codeblock: OmitType<ContentKitCodeBlock>;
            markdown: OmitType<ContentKitMarkdown>;
            webframe: OmitType<ContentKitWebFrame>;
            input: OmitType<ContentKitInput>;
            textinput: OmitType<ContentKitTextInput>;
            card: OmitType<ContentKitCard>;
            image: OmitType<ContentKitImage>;
            select: OmitType<ContentKitSelect>;
            switch: OmitType<ContentKitSwitch>;
            radio: OmitType<ContentKitRadio>;
            modal: OmitType<ContentKitModal>;
            checkbox: OmitType<ContentKitCheckbox>;
            stepper: OmitType<ContentKitStepper>;
            step: OmitType<ContentKitStepperStep>;
        }
    }
}
