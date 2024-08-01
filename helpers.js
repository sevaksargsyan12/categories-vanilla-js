function convertSingleQuotesToDoubleQuotes(jsonStr) {
    // Replace single quotes around keys and values with double quotes
    const correctedStr = jsonStr.replace(/'/g, '"');
    return correctedStr;
}

export function parseToJSON(jsonStr) {
    const correctedStr = convertSingleQuotesToDoubleQuotes(jsonStr);
    try {
        const parsedData = JSON.parse(correctedStr);
        return parsedData;
    } catch (error) {
        console.error(error);
        return null;
    }
}
