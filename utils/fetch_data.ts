/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function fetcher(endpoint: string, revalidate?: string) {

    try {
        const res = await fetch(`${process.env.NEXT_DEMO_BACKEND_URL}${endpoint}`);
        const responseText = await res.text();

        try {
            const data = JSON.parse(responseText);
            console.log(data)
            if (!res.ok) {
                return {
                    error: "Error fetching data: " + res.statusText,
                    error_status: res.status,
                    details: data
                };
            }
            return data
        }
        catch (jsonError) {
            return {
                error: `Could not parse response! Error code: ${res.status}`,
                raw_response: responseText
            };
        }
    }
    catch (fetchError: any) {
        return {
            error: `Something went wrong! ${fetchError.message}`
        };
    }


}