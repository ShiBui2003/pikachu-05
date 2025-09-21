"use client";

import VapiWidget from "@/components/VapiWidget";
import React from "react";

export default function VAPIPage() {
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY as string | undefined;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID as
        | string
        | undefined;

    if (!apiKey || !assistantId) {
        return (
            <div className="p-4 text-sm text-red-600">
                Missing Vapi env vars. Set NEXT_PUBLIC_VAPI_API_KEY and
                NEXT_PUBLIC_VAPI_ASSISTANT_ID in your .env.local.
            </div>
        );
    }

    return <VapiWidget apiKey={apiKey} assistantId={assistantId} />;
}
