import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ===============================
   DATA POOLS (for variation)
================================= */

const doctors = [
  "Dr. Adeyemi",
  "Dr. Musa",
  "Dr. Okeke",
  "Dr. Bello",
  "Dr. Johnson",
];

const conditions = [
  ["Hypertension"],
  ["Asthma"],
  ["Diabetes"],
  ["Ulcer"],
  ["None"],
];

const medications = [
  ["Lisinopril"],
  ["Albuterol"],
  ["Metformin"],
  ["Omeprazole"],
  ["Paracetamol"],
];

const insuranceProviders = [
  "NHIS Nigeria",
  "AXA Mansard",
  "Hygeia HMO",
  "Leadway Health",
  "Reliance HMO",
];

const admissionReasons = [
  "Routine Checkup",
  "Asthma Attack",
  "High Blood Pressure",
  "Diabetic Review",
  "General Consultation",
];

const treatments = [
  "Medication Adjustment",
  "Respiratory Therapy",
  "Insulin Regulation",
  "Blood Pressure Monitoring",
  "General Observation",
];

/* ===============================
   BASE PATIENTS (Your original)
================================= */

const basePatients = [
    {
      id: 1,
      patientId: "PT-1001",
      fullName: "Chinedu Okafor",
      gender: "Male",
      age: 34,
      bloodGroup: "O+",
      patientType: "NHIS",
      phone: "08031245678",
      regDate: "2024-01-12",
      status: "Active",
      dob: "1990-05-12",
      address: "12 Allen Avenue, Ikeja, Lagos",
      nextOfKin: "Amaka Okafor",
      nextOfKinPhone: "08039876543",
      allergies: "None",
    },
    {
      id: 2,
      patientId: "PT-1002",
      fullName: "Aisha Bello",
      gender: "Female",
      age: 28,
      bloodGroup: "A+",
      patientType: "Single",
      phone: "08056781234",
      regDate: "2024-02-03",
      status: "Admitted",
      dob: "1996-08-21",
      address: "45 Ahmadu Bello Way, Kaduna",
      nextOfKin: "Sule Bello",
      nextOfKinPhone: "08052349876",
      allergies: "Penicillin",
    },
    {
      id: 3,
      patientId: "PT-1003",
      fullName: "Ibrahim Musa",
      gender: "Male",
      age: 41,
      bloodGroup: "B+",
      patientType: "Family",
      phone: "08087654321",
      regDate: "2023-11-20",
      status: "Active",
      dob: "1983-03-14",
      address: "8 Emir Road, Kano",
      nextOfKin: "Zainab Musa",
      nextOfKinPhone: "08083456789",
      allergies: "None",
    },
    {
      id: 4,
      patientId: "PT-1004",
      fullName: "Blessing Nwosu",
      gender: "Female",
      age: 22,
      bloodGroup: "AB+",
      patientType: "Kadcha",
      phone: "08024567891",
      regDate: "2024-03-10",
      status: "Discharged",
      dob: "2002-07-09",
      address: "23 Independence Layout, Enugu",
      nextOfKin: "Ngozi Nwosu",
      nextOfKinPhone: "08027654321",
      allergies: "Seafood",
    },
    {
      id: 5,
      patientId: "PT-1005",
      fullName: "Tunde Adeyemi",
      gender: "Male",
      age: 37,
      bloodGroup: "O-",
      patientType: "NHIS",
      phone: "08033445566",
      regDate: "2023-12-01",
      status: "Active",
      dob: "1987-09-18",
      address: "5 Ring Road, Ibadan",
      nextOfKin: "Kemi Adeyemi",
      nextOfKinPhone: "08037778899",
      allergies: "None",
    },
    {
      id: 6,
      patientId: "PT-1006",
      fullName: "Fatima Usman",
      gender: "Female",
      age: 30,
      bloodGroup: "B-",
      patientType: "Single",
      phone: "08065432109",
      regDate: "2024-01-25",
      status: "Admitted",
      dob: "1994-11-02",
      address: "17 GRA Phase 2, Port Harcourt",
      nextOfKin: "Abdullahi Usman",
      nextOfKinPhone: "08061234567",
      allergies: "Dust",
    },
    {
      id: 7,
      patientId: "PT-1007",
      fullName: "Samuel Olatunji",
      gender: "Male",
      age: 45,
      bloodGroup: "A-",
      patientType: "Family",
      phone: "08076543210",
      regDate: "2023-10-15",
      status: "Active",
      dob: "1979-04-25",
      address: "9 Marina Road, Lagos Island",
      nextOfKin: "Grace Olatunji",
      nextOfKinPhone: "08079876543",
      allergies: "None",
    },
    {
      id: 8,
      patientId: "PT-1008",
      fullName: "Ngozi Eze",
      gender: "Female",
      age: 33,
      bloodGroup: "O+",
      patientType: "NHIS",
      phone: "08045678912",
      regDate: "2024-02-18",
      status: "Active",
      dob: "1991-06-30",
      address: "14 Wetheral Road, Owerri",
      nextOfKin: "Chukwuemeka Eze",
      nextOfKinPhone: "08042345678",
      allergies: "None",
    },
    {
      id: 9,
      patientId: "PT-1009",
      fullName: "David Mensah",
      gender: "Male",
      age: 39,
      bloodGroup: "AB-",
      patientType: "Single",
      phone: "08088997766",
      regDate: "2023-09-09",
      status: "Discharged",
      dob: "1985-02-17",
      address: "21 Airport Road, Abuja",
      nextOfKin: "Linda Mensah",
      nextOfKinPhone: "08081234567",
      allergies: "Latex",
    },
    {
      id: 10,
      patientId: "PT-1010",
      fullName: "Esther Ajayi",
      gender: "Female",
      age: 26,
      bloodGroup: "A+",
      patientType: "Kadcha",
      phone: "08022334455",
      regDate: "2024-03-05",
      status: "Active",
      dob: "1998-01-11",
      address: "32 Bodija Estate, Ibadan",
      nextOfKin: "Michael Ajayi",
      nextOfKinPhone: "08021234567",
      allergies: "None",
    },
    {
      id: 11,
      patientId: "PT-1011",
      fullName: "Peter Obiagu",
      gender: "Male",
      age: 52,
      bloodGroup: "B+",
      patientType: "Family",
      phone: "08090112233",
      regDate: "2023-08-12",
      status: "Active",
      dob: "1972-12-04",
      address: "7 Aba Road, Umuahia",
      nextOfKin: "Angela Obiagu",
      nextOfKinPhone: "08093456781",
      allergies: "Hypertension medication",
    },
    {
      id: 12,
      patientId: "PT-1012",
      fullName: "Halima Garba",
      gender: "Female",
      age: 31,
      bloodGroup: "O+",
      patientType: "NHIS",
      phone: "08077889900",
      regDate: "2024-01-30",
      status: "Admitted",
      dob: "1993-05-22",
      address: "3 Tafawa Balewa Road, Bauchi",
      nextOfKin: "Garba Mohammed",
      nextOfKinPhone: "08074561234",
      allergies: "None",
    },
    {
      id: 13,
      patientId: "PT-1013",
      fullName: "Emmanuel Okoro",
      gender: "Male",
      age: 29,
      bloodGroup: "A+",
      patientType: "Single",
      phone: "08066554433",
      regDate: "2024-02-14",
      status: "Active",
      dob: "1995-09-09",
      address: "18 Aba Expressway, Port Harcourt",
      nextOfKin: "Patricia Okoro",
      nextOfKinPhone: "08062345678",
      allergies: "None",
    },
    {
      id: 14,
      patientId: "PT-1014",
      fullName: "Comfort Danladi",
      gender: "Female",
      age: 36,
      bloodGroup: "B-",
      patientType: "Family",
      phone: "08099881122",
      regDate: "2023-12-22",
      status: "Discharged",
      dob: "1988-03-01",
      address: "6 Yakubu Gowon Way, Jos",
      nextOfKin: "Daniel Danladi",
      nextOfKinPhone: "08093456789",
      allergies: "Peanuts",
    },
    {
      id: 15,
      patientId: "PT-1015",
      fullName: "Olumide Adebayo",
      gender: "Male",
      age: 44,
      bloodGroup: "O+",
      patientType: "NHIS",
      phone: "08055667788",
      regDate: "2023-07-19",
      status: "Active",
      dob: "1980-10-10",
      address: "10 Admiralty Way, Lekki, Lagos",
      nextOfKin: "Funke Adebayo",
      nextOfKinPhone: "08051234567",
      allergies: "None",
    },
    {
      id: 16,
      patientId: "PT-1016",
      fullName: "Ruth Nnamdi",
      gender: "Female",
      age: 27,
      bloodGroup: "AB+",
      patientType: "Single",
      phone: "08033441122",
      regDate: "2024-03-01",
      status: "Active",
      dob: "1997-02-13",
      address: "4 Okpara Avenue, Enugu",
      nextOfKin: "Chika Nnamdi",
      nextOfKinPhone: "08034567890",
      allergies: "None",
    },
    {
      id: 17,
      patientId: "PT-1017",
      fullName: "Kabiru Lawal",
      gender: "Male",
      age: 38,
      bloodGroup: "A-",
      patientType: "Kadcha",
      phone: "08044332211",
      regDate: "2024-01-05",
      status: "Admitted",
      dob: "1986-06-18",
      address: "11 Sokoto Road, Katsina",
      nextOfKin: "Hauwa Lawal",
      nextOfKinPhone: "08047891234",
      allergies: "None",
    },
    {
      id: 18,
      patientId: "PT-1018",
      fullName: "Jessica Okon",
      gender: "Female",
      age: 24,
      bloodGroup: "O-",
      patientType: "Single",
      phone: "08022113344",
      regDate: "2024-02-20",
      status: "Active",
      dob: "2000-04-04",
      address: "15 Calabar Road, Uyo",
      nextOfKin: "Thomas Okon",
      nextOfKinPhone: "08028765432",
      allergies: "None",
    },
    {
      id: 19,
      patientId: "PT-1019",
      fullName: "Michael Adewale",
      gender: "Male",
      age: 48,
      bloodGroup: "B+",
      patientType: "Family",
      phone: "08066778899",
      regDate: "2023-06-11",
      status: "Active",
      dob: "1976-01-29",
      address: "28 Herbert Macaulay Way, Yaba, Lagos",
      nextOfKin: "Susan Adewale",
      nextOfKinPhone: "08061239876",
      allergies: "Diabetes medication",
    },
    {
      id: 20,
      patientId: "PT-1020",
      fullName: "Grace Chukwu",
      gender: "Female",
      age: 32,
      bloodGroup: "A+",
      patientType: "NHIS",
      phone: "08099887755",
      regDate: "2024-03-08",
      status: "Active",
      dob: "1992-12-15",
      address: "19 Rumuola Road, Port Harcourt",
      nextOfKin: "Samuel Chukwu",
      nextOfKinPhone: "08095432178",
      allergies: "None",
    },
  ];

/* ===============================
   ENHANCE PATIENTS
================================= */

const enhancedPatients = basePatients.map((patient, index) => {
  const i = index % 5;

  return {
    ...patient,

    personalInfo: {
      maritalStatus: index % 2 === 0 ? "Married" : "Single",
      nationalId: `NAT-${100000 + index}`,
    },

    medicalInfo: {
      allergies:
        patient.allergies !== "None"
          ? [patient.allergies]
          : ["None"],
      chronicConditions: conditions[i],
      currentMedications: medications[i],
      pastMedicalHistory:
        index % 3 === 0
          ? "Minor surgery in 2020"
          : "No major medical history",
    },

    admissionDetails: {
      admissionDate: patient.regDate,
      dischargeDate:
        patient.status === "Discharged"
          ? "2024-03-20"
          : null,
      doctorAssigned: doctors[i],
      ward: `W-${101 + index} / R-${201 + index}`,
      reason: admissionReasons[i],
      treatment: treatments[i],
    },

    insuranceDetails: {
      provider: insuranceProviders[i],
      policyNumber: `POL-${patient.patientId}`,
      policyType: patient.patientType,
      coveragePeriod: "2024-01-01 - 2025-01-01",
      coverageAmount: 500000 + index * 10000,
      copayment: `${10 + i}%`,
    },

    emergencyContact: {
      name: patient.nextOfKin,
      relation: "Relative",
      phone: patient.nextOfKinPhone,
    },

    visitHistory: [
      {
        date: patient.regDate,
        doctor: doctors[i],
        treatment: treatments[i],
        charges: 150 + index * 20,
        outcome: index % 2 === 0 ? "Improved" : "Stable",
      },
      {
        date: "2024-02-15",
        doctor: doctors[(i + 1) % 5],
        treatment: "Follow-up Visit",
        charges: 120 + index * 10,
        outcome: "Healthy",
      },
    ],
  };
});

/* ===============================
   ZUSTAND STORE
================================= */

export const useStore = create(
  persist(
    (set, get) => ({
      /* ========= YOUR ORIGINAL STATE ========= */

      darkMode: false,
      isSidebarOpen: true,
      sidebarTheme: "light",
      topbarColor: "bg-white",
      isRTL: false,

      setDarkMode: (val) => set({ darkMode: val }),
      setSidebarTheme: (val) => set({ sidebarTheme: val }),
      setTopbarColor: (val) => set({ topbarColor: val }),
      setIsRTL: (val) => set({ isRTL: val }),
      toggleSidebar: () =>
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),

      /* ========= PATIENT STATE ========= */

      patients: enhancedPatients,

      getPatientById: (id) =>
        get().patients.find((p) => p.id === Number(id)),

      addPatient: (newPatient) =>
        set((state) => ({
          patients: [...state.patients, newPatient],
        })),

      updatePatient: (id, updatedData) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p
          ),
        })),

      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
        })),
    }),
    { name: "cliniva-full-store" }
  )
);
