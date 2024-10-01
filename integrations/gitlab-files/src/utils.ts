export const getFileExtension = async (fileName: string) => {
    const re = /(?:\.([^.]+))?$/;

    return re.exec(fileName)?.[1];
};
