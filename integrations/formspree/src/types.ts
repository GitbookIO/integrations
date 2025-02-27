import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type FormspreeBodyData = {
    email: string;
    name: string;
    message: string;
};

export type FormspreeConfiguration = FormspreeBodyData & {
    formspree_id: string;
};

type FormspreeResponseSuccess = {
    formSubmitted: true;
};

type FormspreeResponseFailure = FormspreeBodyData & {
    formSubmitted: boolean;
};

export type FormspreeActionResponse = FormspreeResponseSuccess | FormspreeResponseFailure;

export type FormspreeEnvironment = RuntimeEnvironment<FormspreeConfiguration>;
export type FormspreeContext = RuntimeContext<FormspreeEnvironment>;

export type FormspreeAction = {
    action: 'submit';
};
