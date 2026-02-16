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
   BASE PATIENTS
================================= */

export const basePatients = [
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
    allergies: "None",
    nextOfKin: {
      name: "Amaka Okafor",
      relationship: "Wife",
      phone: "08039876543",
      address: "12 Allen Avenue, Ikeja, Lagos",
    },
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
    allergies: "Penicillin",
    nextOfKin: {
      name: "Sule Bello",
      relationship: "Father",
      phone: "08052349876",
      address: "45 Ahmadu Bello Way, Kaduna",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Zainab Musa",
      relationship: "Wife",
      phone: "08083456789",
      address: "8 Emir Road, Kano",
    },
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
    allergies: "Seafood",
    nextOfKin: {
      name: "Ngozi Nwosu",
      relationship: "Mother",
      phone: "08027654321",
      address: "23 Independence Layout, Enugu",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Kemi Adeyemi",
      relationship: "Wife",
      phone: "08037778899",
      address: "5 Ring Road, Ibadan",
    },
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
    allergies: "Dust",
    nextOfKin: {
      name: "Abdullahi Usman",
      relationship: "Husband",
      phone: "08061234567",
      address: "17 GRA Phase 2, Port Harcourt",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Grace Olatunji",
      relationship: "Wife",
      phone: "08079876543",
      address: "9 Marina Road, Lagos Island",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Chukwuemeka Eze",
      relationship: "Husband",
      phone: "08042345678",
      address: "14 Wetheral Road, Owerri",
    },
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
    allergies: "Latex",
    nextOfKin: {
      name: "Linda Mensah",
      relationship: "Wife",
      phone: "08081234567",
      address: "21 Airport Road, Abuja",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Michael Ajayi",
      relationship: "Father",
      phone: "08021234567",
      address: "32 Bodija Estate, Ibadan",
    },
  },

  // -------- Remaining 10 Patients --------

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
    allergies: "Hypertension medication",
    nextOfKin: {
      name: "Angela Obiagu",
      relationship: "Wife",
      phone: "08093456781",
      address: "7 Aba Road, Umuahia",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Garba Mohammed",
      relationship: "Father",
      phone: "08074561234",
      address: "3 Tafawa Balewa Road, Bauchi",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Patricia Okoro",
      relationship: "Sister",
      phone: "08062345678",
      address: "18 Aba Expressway, Port Harcourt",
    },
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
    allergies: "Peanuts",
    nextOfKin: {
      name: "Daniel Danladi",
      relationship: "Husband",
      phone: "08093456789",
      address: "6 Yakubu Gowon Way, Jos",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Funke Adebayo",
      relationship: "Wife",
      phone: "08051234567",
      address: "10 Admiralty Way, Lekki, Lagos",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Chika Nnamdi",
      relationship: "Brother",
      phone: "08034567890",
      address: "4 Okpara Avenue, Enugu",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Hauwa Lawal",
      relationship: "Wife",
      phone: "08047891234",
      address: "11 Sokoto Road, Katsina",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Thomas Okon",
      relationship: "Father",
      phone: "08028765432",
      address: "15 Calabar Road, Uyo",
    },
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
    allergies: "Diabetes medication",
    nextOfKin: {
      name: "Susan Adewale",
      relationship: "Wife",
      phone: "08061239876",
      address: "28 Herbert Macaulay Way, Yaba, Lagos",
    },
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
    allergies: "None",
    nextOfKin: {
      name: "Samuel Chukwu",
      relationship: "Husband",
      phone: "08095432178",
      address: "19 Rumuola Road, Port Harcourt",
    },
  },
];

const dummyNotifications = [
  {
    id: 1,
    type: "success",
    title: "Patient Admitted",
    message: "Chinedu Okafor has been admitted to Ward W-101 / R-201",
    duration: 5000,
  },
  {
    id: 2,
    type: "error",
    title: "Payment Failed",
    message: "Payment for Aisha Bello could not be processed",
    duration: 5000,
  },
  {
    id: 3,
    type: "info",
    title: "New Appointment",
    message: "Ibrahim Musa has a scheduled appointment tomorrow",
    duration: 5000,
  },
  {
    id: 4,
    type: "success",
    title: "Test Result Ready",
    message: "Fatima Usman's lab results are now available",
    duration: 5000,
  },
  {
    id: 5,
    type: "info",
    title: "Reminder",
    message: "Samuel Olatunji has an appointment today at 2 PM",
    duration: 5000,
  },
  {
    id: 6,
    type: "error",
    title: "Alert",
    message: "Payment for Tunde Adeyemi is overdue",
    duration: 5000,
  },
  {
    id: 7,
    type: "success",
    title: "Discharged",
    message: "Blessing Nwosu has been discharged successfully",
    duration: 5000,
  },
  {
    id: 8,
    type: "info",
    title: "New Patient",
    message: "Jessica Okon has registered today",
    duration: 5000,
  },
];

/* ===============================
   BALANCE GENERATOR
================================= */

const generateRunningBalance = (index) => {
  // Rotate between 3 types
  const type = index % 3;

  if (type === 0) {
    // Credit (advance payment)
    const amount = 20000 + index * 1000;
    return {
      runningBalance: amount,
      balanceStatus: "CR",
      balanceLabel: `₦${amount.toLocaleString()} CR`,
    };
  }

  if (type === 1) {
    // Outstanding
    const amount = 10000 + index * 500;
    return {
      runningBalance: -amount,
      balanceStatus: "OS",
      balanceLabel: `₦${amount.toLocaleString()} OS`,
    };
  }

  // Settled
  return {
    runningBalance: 0,
    balanceStatus: "ZERO",
    balanceLabel: "₦0.00",
  };
};

/* ===============================
   ENHANCE PATIENTS
================================= */

const enhancedPatients = basePatients.map((patient, index) => {
  const i = index % 5;

  const balance = generateRunningBalance(index);

  return {
    ...patient,

    ...balance, // <-- NEW RUNNING BALANCE ADDED HERE

    personalInfo: {
      maritalStatus: index % 2 === 0 ? "Married" : "Single",
      nationalId: `NAT-${100000 + index}`,
    },

    medicalInfo: {
      allergies: patient.allergies !== "None" ? [patient.allergies] : ["None"],
      chronicConditions: conditions[i],
      currentMedications: medications[i],
      pastMedicalHistory:
        index % 3 === 0 ? "Minor surgery in 2020" : "No major medical history",
    },

    admissionDetails: {
      admissionDate: patient.regDate,
      dischargeDate: patient.status === "Discharged" ? "2024-03-20" : null,
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

      getPatientById: (id) => get().patients.find((p) => p.id === Number(id)),

      addPatient: (newPatient) =>
        set((state) => ({
          patients: [...state.patients, newPatient],
        })),

      updatePatient: (id, updatedData) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p,
          ),
        })),

      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
        })),

      /* ========= NOTIFICATIONS ========= */
      notifications: dummyNotifications,

      addNotification: (notif) =>
        set((state) => ({
          notifications: [...state.notifications, { id: Date.now(), ...notif }],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // ---------- Other actions ----------
      setDarkMode: (val) => set({ darkMode: val }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),

    { name: "cliniva-full-store-v2.0" },
  ),
);
