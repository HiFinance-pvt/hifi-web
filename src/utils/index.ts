/**
 * Parses a JSON string representing net worth data into a JavaScript object.
 *
 * @param jsonString The input string containing the JSON data.
 * @returns A JavaScript object representing the parsed JSON.
 * @throws SyntaxError If the input string is not a valid JSON.
 */
export function parseStringToJson(jsonString: string): any {
    try {
        const parsedData: any = JSON.parse(jsonString);
        return parsedData;
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error(`Error decoding JSON: ${error.message}`);
            return jsonString
        } else {
            console.error(`An unexpected error occurred: ${error}`);
            throw error;
        }
    }
}