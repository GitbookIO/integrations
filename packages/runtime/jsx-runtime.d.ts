import {
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
    ContentKitSwitch,
    ContentKitRadio,
    ContentKitCheckbox,
    ContentKitModal,
    ContentKitInput,
} from '@gitbook/api';

// eslint-disable-next-line import/no-internal-modules
import { jsx, jsxDEV, jsxs, Fragment } from './src/contentkit-jsx';

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
            children: {}; // specify children name to use
        }

        interface IntrinsicElements {
            block: OmitType<ContentKitBlock>;
            button: OmitType<ContentKitButton>;
            box: OmitType<ContentKitBox>;
            vstack: OmitType<ContentKitVStack>;
            hstack: OmitType<ContentKitHStack>;
            divider: OmitType<ContentKitDivider>;
            text: OmitType<ContentKitText>;
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
        }
    }
}
