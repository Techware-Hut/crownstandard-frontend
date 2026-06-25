"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function SupportRequests() {

    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
    });
    const limit = 10;

    useEffect(() => {
        getSupportRequests();
    }, [page]);

    const handleView = (item: any) => {
        setSelectedRequest(item);
        setOpen(true);
    };

    const getSupportRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/support?page=${page}&limit=${limit}`);
            setRequests(res.data.data || []);
            setPagination(res.data.pagination);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="rounded-xl bg-white p-6 shadow">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Support Requests
                    </h2>
                    <p className="text-sm text-gray-500">
                        Submitted support inquiries
                    </p>
                </div>
                <input placeholder="Search requests..." className="rounded-lg border px-4 py-2 outline-none focus:border-black" />
            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-4 text-left">
                                Full Name
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Type of Request
                            </th>

                            <th className="p-4 text-left">
                                Priority Level
                            </th>

                            <th className="p-4 text-left">
                                Booking ID
                            </th>

                            <th className="min-w-[300px] p-4 text-left">
                                Message
                            </th>

                            <th className="p-4 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.length > 0 ? (
                            requests.map((item) => (
                                <tr key={item._id} className="border-b hover:bg-gray-50">

                                    <td className="p-4 font-medium">
                                        {item.fullName}
                                    </td>

                                    <td className="p-4">
                                        {item.email}
                                    </td>

                                    <td className="p-4">
                                        {item.requestType}
                                    </td>

                                    <td className="p-4">
                                        <span className={`rounded-full px-3 py-1 text-sm ${item.priorityLevel === "High" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                                        >
                                            {item.priorityLevel}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {item.relatedBookingId || "N/A"}
                                    </td>
                                    <td className="max-w-[350px] truncate p-4" title={item.message}>
                                        {item.message}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() =>
                                            handleView(item)
                                        }
                                            className="rounded-lg border px-4 py-2 text-sm hover:bg-black hover:text-white transition"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-gray-500">No support requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">Page {page} {" "}of{" "}{pagination.totalPages}</p>
                <div className="flex gap-3">
                    <button disabled={!pagination.hasPrevious}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="rounded-lg border px-4 py-2 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <button disabled={!pagination.hasNext}
                        onClick={() =>
                            setPage(
                                (prev) =>
                                    prev + 1
                            )
                        }
                        className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {open && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Support Request Details</h3>
                            <button onClick={() =>
                                setOpen(false)
                            }
                                className="text-2xl text-gray-500">
                                ×
                            </button>

                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p>{selectedRequest.fullName}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p>{selectedRequest.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Request Type</p>
                                <p>{selectedRequest.requestType}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Priority</p>
                                <p>{selectedRequest.priorityLevel}</p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Booking ID</p>
                                <p>{selectedRequest.relatedBookingId || "N/A"}</p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Message</p>
                                <div className="mt-2 rounded-lg bg-gray-50 p-4">{selectedRequest.message}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}