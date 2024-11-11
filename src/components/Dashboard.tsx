"use client";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ParkingForm from "./ParkingForm";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router=useRouter();
    const [vehicles, setVehicles] = useState([]);
    const [totalCars, setTotalCars] = useState(0);
    const [totalEmptySlots, setTotalEmptySlots] = useState(0);
    const [vehicleTypeCount, setVehicleTypeCount] = useState({ Car: 0, Truck: 0, Microbus: 0 });


    useEffect(() => {
        const fetchVehicles = async () => {
            const vehicleCollection = collection(db, "vehicles");
            const vehicleSnapshot = await getDocs(vehicleCollection);
            const vehicleList = vehicleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVehicles(vehicleList);
            setTotalCars(vehicleList.length);
            setTotalEmptySlots(50 - vehicleList.length); // Assuming 50 slots
            const typeCount = vehicleList.reduce((acc, vehicle) => {
                acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
                return acc;
            }, { Car: 0, Truck: 0, Microbus: 0 });
            setVehicleTypeCount(typeCount);
        };
        fetchVehicles();
    }, []);

    
    function formatDate(dateString:string) {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleString("en-US", {
          weekday: "short",  // Mon
          month: "short",    // Nov
          day: "numeric",    // 11
          hour: "2-digit",   // 15
          minute: "2-digit", // 41
          hour12: false      // 24-hour format
      });
      
      // Remove the year and comma if present
      return formattedDate.replace(/,\s*\d{4}/, "");
  }

    const handleEdit = (vehicle) => {
        router.push(`/parkingForm/${vehicle.id}`);
    };

    const handleCreate = () => {
        router.push('/parkingForm');
    }

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "vehicles", id));
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        setTotalCars(vehicles.length - 1);
        setTotalEmptySlots(50 - vehicles.length + 1);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <button
                    className="flex items-center bg-blue-500 text-white p-2 rounded-lg"
                    onClick={handleCreate}
                >
                    <FaPlus className="mr-2" /> Add Vehicle
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-100 p-4 rounded-lg shadow-md">
                    <p className="text-xl font-semibold">Total Cars Parked</p>
                    <p className="text-3xl font-bold">{totalCars}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <p className="text-xl font-semibold">Total Empty Slots</p>
                    <p className="text-3xl font-bold">{totalEmptySlots}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                    <p className="text-xl font-semibold">Vehicle Type Info</p>
                    <p className="text-lg">
                        Car: {vehicleTypeCount.Car}, Truck: {vehicleTypeCount.Truck}, Microbus: {vehicleTypeCount.Microbus}
                    </p>
                </div>
            </div>

            {/* Table of Vehicles */}
            <div className="overflow-auto bg-white shadow rounded-lg">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-6 text-left">Owner Name</th>
                            <th className="py-3 px-6 text-left">Vehicle Type</th>
                            <th className="py-3 px-6 text-left">License No</th>
                            <th className="py-3 px-6 text-left">Entry Time</th>
                            <th className="py-3 px-6 text-left">Exit Time</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-light">
                        {vehicles.map(vehicle => (
                            <tr key={vehicle.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{vehicle.ownerName}</td>
                                <td className="py-3 px-6 text-left">{vehicle.vehicleType}</td>
                                <td className="py-3 px-6 text-left">{vehicle.licenseNumber}</td>
                                <td className="py-3 px-6 text-left">{formatDate(vehicle.entryTime.toDate().toString())}</td>
                                <td className="py-3 px-6 text-left">{vehicle.exitTime ? formatDate(vehicle.exitTime.toDate().toString()) : "N/A"}</td>
                                <td className="py-3 px-6 text-left">{vehicle.status}</td>
                                <td className="py-3 px-6 text-center flex justify-center space-x-4">
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleEdit(vehicle)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDelete(vehicle.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
