export {};

// https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/javascriptapi/forms-api-reference?lang=en
declare global {
    interface MarketoForm {
        getFormElem: () => Element;
    }

    interface GlobalMarketo {
        loadForm: (
            baseUrl: string,
            munchkinId: string,
            formId: string,
            callback?: (form: MarketoForm) => void,
        ) => void;

        onFormRender: (callback: (form: MarketoForm) => void) => void;
        onValidate: (callback: (valid: boolean) => void) => void;
    }

    interface Window {
        MktoForms2: GlobalMarketo;
    }
}
