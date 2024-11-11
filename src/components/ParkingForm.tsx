"use client";
import { db } from "@/config/firebaseConfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState, useEffect } from "react";

interface FormState {
    licenseNumber: string;
    vehicleType: string;
    ownerName: string;
    ownerPhone: string;
    status: boolean; // true = in, false = out
    address: string;
    entryTime: string;
    exitTime: string;
    parkingCharge: number;
}

interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

export default function ParkingForm() {
    const [form, setForm] = useState<FormState>({
        licenseNumber: "",
        vehicleType: "Car",
        ownerName: "",
        ownerPhone: "",
        status: true, // Default to "in" status
        address: "",
        entryTime: "",
        exitTime: "",
        parkingCharge: 0,
    });

    useEffect(() => {
        if (form.entryTime && form.exitTime) {
            const calculatedCharge = handleParkingCharge(form.entryTime, form.exitTime);
            setForm((prevForm) => ({ ...prevForm, parkingCharge: calculatedCharge }));
        }
    }, [form.entryTime, form.exitTime]);

    // Function to calculate parking charge based on entry and exit time
    const handleParkingCharge = (entryTime: string, exitTime: string): number => {
        const entry = new Date(entryTime);
        const exit = new Date(exitTime);
        const diff = Math.abs(exit.getTime() - entry.getTime());
        const hours = Math.ceil(diff / (1000 * 60 * 60));
        return hours * 10; // Example rate: $10 per hour
    };

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
        e.preventDefault();
        
        try {
            await addDoc(collection(db, "vehicles"), {
                ...form,
                status: form.status ? "in" : "out",
                entryTime: Timestamp.fromDate(new Date(form.entryTime)),
                exitTime: form.exitTime ? Timestamp.fromDate(new Date(form.exitTime)) : null,
            });
            alert("Vehicle added successfully");
            setForm({
                licenseNumber: "",
                vehicleType: "Car",
                ownerName: "",
                ownerPhone: "",
                status: true,
                address: "",
                entryTime: "",
                exitTime: "",
                parkingCharge: 0,
            });
        } catch (err) {
            console.error(err);
            alert("Error adding vehicle");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-5xl font-bold text-center p-5">Parking Form</h1>
            <input
                name="licenseNumber"
                type="number"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="License Number"
                className="border p-2 rounded w-full"
                required
            />
            <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className="border p-2 rounded w-full"
            >
                <option value="Car">Car</option>
                <option value="Truck">Truck</option>
                <option value="Microbus">Microbus</option>
            </select>
            <input
                name="ownerName"
                type="text"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Owner Name"
                className="border p-2 rounded w-full"
                required
            />
            <input
                name="ownerPhone"
                type="number"
                value={form.ownerPhone}
                onChange={handleChange}
                placeholder="Owner Phone"
                className="border p-2 rounded w-full"
                required
            />
            
            <label className="flex items-center">
                <span className="mr-2">Status:</span>
                <input
                    type="checkbox"
                    name="status"
                    checked={form.status}
                    onChange={handleChange}
                    className="mr-2"
                />
                {form.status ? "In" : "Out"}
            </label>

            <input
                name="entryTime"
                value={form.entryTime}
                onChange={handleChange}
                type="datetime-local"
                className="border p-2 rounded w-full"
                required
            />
            <input
                name="exitTime"
                value={form.exitTime}
                onChange={handleChange}
                type="datetime-local"
                className="border p-2 rounded w-full"
            />

            <label className="flex items-center">
                <span className="mr-2">Parking Charge:</span>
            </label>
            <input
                name="parkingCharge"
                value={form.parkingCharge}
                readOnly
                placeholder="Parking Charge"
                className="border p-2 rounded w-full bg-gray-200 cursor-not-allowed"
            />

            <textarea
                name="address"
                typeof="text"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded w-full"
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">
                Add Vehicle
            </button>
        </form>
    );
}
