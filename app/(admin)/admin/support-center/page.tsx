"use client";

import { useState } from "react";

import SupportConfig from "./components/SupportConfig";
import SupportRequests from "./components/SupportRequests";

export default function SupportCenterPage() {
    const [showConfig, setShowConfig] =
        useState(false);

    return (
        <div className="space-y-8 p-6">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Support Center
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage support page setup and user requests
                    </p>
                </div>

                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="rounded-lg bg-black px-5 py-3 text-white">
                    {showConfig ? "Hide Configuration" : "Edit Support Information"}
                </button>
            </div>

            {showConfig && (<SupportConfig />)}
            <SupportRequests />

        </div>
    );
}