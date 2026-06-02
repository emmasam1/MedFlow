import React from 'react'
import { useStore } from "../../store/store";

const PrescriptionSection = () => {
    const { darkMode } = useStore();

    return (

        <div className="space-y-5">

            <div className="grid grid-cols-4 gap-4">

                {/* Drug */}

                <div className="col-span-2">

                    <label className="text-xs font-bold uppercase text-gray-500">
                        Drug Name
                    </label>

                    <input
                        placeholder="Search medication..."
                        className={`w-full mt-2 px-4 py-3 rounded-xl border ${darkMode
                                ? "bg-gray-900 border-gray-700"
                                : "bg-white border-gray-200"
                            }`}
                    />

                </div>

                {/* Dosage */}

                <div>

                    <label className="text-xs font-bold uppercase text-gray-500">
                        Strength
                    </label>

                    <input
                        placeholder="500mg"
                        className={`w-full mt-2 px-4 py-3 rounded-xl border ${darkMode
                                ? "bg-gray-900 border-gray-700"
                                : "bg-white border-gray-200"
                            }`}
                    />

                </div>

                {/* Route */}

                <div>

                    <label className="text-xs font-bold uppercase text-gray-500">
                        Route
                    </label>

                    <select
                        className={`w-full mt-2 px-4 py-3 rounded-xl border ${darkMode
                                ? "bg-gray-900 border-gray-700"
                                : "bg-white border-gray-200"
                            }`}
                    >

                        <option>Oral</option>

                        <option>IV</option>

                        <option>IM</option>

                        <option>Topical</option>

                        <option>Inhalation</option>

                    </select>

                </div>

            </div>


            <div className="grid grid-cols-5 gap-4">

                <div>

                    <label className="text-xs font-bold uppercase text-gray-500">
                        Dose
                    </label>

                    <input
                        placeholder="1"
                        className={`w-full mt-2 px-4 py-3 rounded-xl border ${darkMode
                                ? "bg-gray-900 border-gray-700"
                                : "bg-white border-gray-200"
                            }`}
                    />

                </div>

                <div>

                    <label className="text-xs font-bold uppercase text-gray-500">
                        Unit
                    </label>

                    <select
                        className={`w-full mt-2 px-4 py-3 rounded-xl border ${darkMode
                                ? "bg-gray-900 border-gray-700"
                                : "bg-white border-gray-200"
                            }`}
                    >

                        <option>Tablet</option>

                        <option>Capsule</option>

                        <option>ml</option>

                        <option>Puff</option>

                        <option>Tube</option>

                        <option>Bag</option>

                        <option>Ampoule</option>

                    </select>

                </div>

                <div>

                    <label className="text-xs font-bold uppercase text-gray-500">
                        Frequency
                    </label>

                    <select
                        className={`w-full mt-2 px-4 py-3 rounded-xl border ${darkMode
                                ? "bg-gray-900 border-gray-700"
                                : "bg-white border-gray-200"
                            }`}
                    >

                        <option>OD</option>

                        <option>BD</option>

                        <option>TDS</option>

                        <option>QID</option>

                        <option>PRN</option>

                    </select>

                </div>

                <div>

                    <label className="text-xs font-bold uppercase text-gray-500">
                        Duration
                    </label>

                    <input
                        placeholder="5"
                        className={`w-full mt-2 px-4 py-3 rounded-xl border ${darkMode
                                ? "bg-gray-900 border-gray-700"
                                : "bg-white border-gray-200"
                            }`}
                    />

                </div>

                <div>

                    <label className="text-xs font-bold uppercase text-gray-500">
                        Days
                    </label>

                    <div
                        className={`mt-2 px-4 py-3 rounded-xl border ${darkMode
                                ? "bg-gray-900 border-gray-700"
                                : "bg-gray-100 border-gray-200"
                            }`}
                    >

                        Days

                    </div>

                </div>

            </div>


            <div>

                <label className="text-xs font-bold uppercase text-gray-500">
                    Instruction
                </label>

                <textarea
                    rows={3}
                    placeholder="Take after meals..."
                    className={`w-full mt-2 px-4 py-3 rounded-xl border ${darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                />

            </div>

        </div>

    )

}

export default PrescriptionSection
