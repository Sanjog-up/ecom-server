import ENV_CONFIG from "../config/env.config";

const KHALTI_BASE_URL = ENV_CONFIG.node_env === "development" 
    ? "https://dev.khalti.com/api/v2"
    : "https://khalti.com/api/v2";


type TInitiatePayymentInput = {
        amount: number;
        purchase_order_id: string;
        purchase_order_name: string;
        return_url: string;
    };

type TInitiatePaymentResponse = {
    pidx: string;
    payment_url: string;
    expires_at: string;
};    

type TLookupResponse = {
    pidx: string;
    status: "Completed" | "Failed" | "Pending" | "Initiated" | "Refunded" | "User cancelled" | "Expired";
    total_amount: number;
    transaction_id: string | null;
}

export const initiateKhaltiPayment = async (
    input: TInitiatePayymentInput,
    ): Promise<TInitiatePaymentResponse> => {
        const response = await fetch(`${KHALTI_BASE_URL}/epayment/initiate/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Key ${ENV_CONFIG.khalti_secret_key}`,
            },
            body: JSON.stringify({
                ...input,
                website_url: ENV_CONFIG.frontend_url,
            }),
        });
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.detail || "Failed to initiate Khalti payment");
        }
        return data;
    };

export const lookupKhaltiPayment = async (
    pidx: string,
    ): Promise<TLookupResponse> => { 
        const response = await fetch(`${KHALTI_BASE_URL}/epayment/lookup/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Key ${ENV_CONFIG.khalti_secret_key}`,
            },
            body: JSON.stringify({ pidx }),
        });
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.detail || "Failed to lookup Khalti payment");
        }
        return data;
    }