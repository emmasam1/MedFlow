// import React from "react";
// import { FiEdit, FiTrash2, FiEye  } from "react-icons/fi";
// import DataTable from "../../components/Table";

// const patients = [
//   {
//     id: 1,
//     patientId: "PT-1001",
//     fullName: "Chinedu Okafor",
//     gender: "Male",
//     age: 34,
//     bloodGroup: "O+",
//     patientType: "NHIS",
//     phone: "08031245678",
//     regDate: "2024-01-12",
//     status: "Active",
//     dob: "1990-05-12",
//     address: "12 Allen Avenue, Ikeja, Lagos",
//     nextOfKin: "Amaka Okafor",
//     nextOfKinPhone: "08039876543",
//     allergies: "None",
//   },
//   {
//     id: 2,
//     patientId: "PT-1002",
//     fullName: "Aisha Bello",
//     gender: "Female",
//     age: 28,
//     bloodGroup: "A+",
//     patientType: "Single",
//     phone: "08056781234",
//     regDate: "2024-02-03",
//     status: "Admitted",
//     dob: "1996-08-21",
//     address: "45 Ahmadu Bello Way, Kaduna",
//     nextOfKin: "Sule Bello",
//     nextOfKinPhone: "08052349876",
//     allergies: "Penicillin",
//   },
//   {
//     id: 3,
//     patientId: "PT-1003",
//     fullName: "Ibrahim Musa",
//     gender: "Male",
//     age: 41,
//     bloodGroup: "B+",
//     patientType: "Family",
//     phone: "08087654321",
//     regDate: "2023-11-20",
//     status: "Active",
//     dob: "1983-03-14",
//     address: "8 Emir Road, Kano",
//     nextOfKin: "Zainab Musa",
//     nextOfKinPhone: "08083456789",
//     allergies: "None",
//   },
//   {
//     id: 4,
//     patientId: "PT-1004",
//     fullName: "Blessing Nwosu",
//     gender: "Female",
//     age: 22,
//     bloodGroup: "AB+",
//     patientType: "Kadcha",
//     phone: "08024567891",
//     regDate: "2024-03-10",
//     status: "Discharged",
//     dob: "2002-07-09",
//     address: "23 Independence Layout, Enugu",
//     nextOfKin: "Ngozi Nwosu",
//     nextOfKinPhone: "08027654321",
//     allergies: "Seafood",
//   },
//   {
//     id: 5,
//     patientId: "PT-1005",
//     fullName: "Tunde Adeyemi",
//     gender: "Male",
//     age: 37,
//     bloodGroup: "O-",
//     patientType: "NHIS",
//     phone: "08033445566",
//     regDate: "2023-12-01",
//     status: "Active",
//     dob: "1987-09-18",
//     address: "5 Ring Road, Ibadan",
//     nextOfKin: "Kemi Adeyemi",
//     nextOfKinPhone: "08037778899",
//     allergies: "None",
//   },
//   {
//     id: 6,
//     patientId: "PT-1006",
//     fullName: "Fatima Usman",
//     gender: "Female",
//     age: 30,
//     bloodGroup: "B-",
//     patientType: "Single",
//     phone: "08065432109",
//     regDate: "2024-01-25",
//     status: "Admitted",
//     dob: "1994-11-02",
//     address: "17 GRA Phase 2, Port Harcourt",
//     nextOfKin: "Abdullahi Usman",
//     nextOfKinPhone: "08061234567",
//     allergies: "Dust",
//   },
//   {
//     id: 7,
//     patientId: "PT-1007",
//     fullName: "Samuel Olatunji",
//     gender: "Male",
//     age: 45,
//     bloodGroup: "A-",
//     patientType: "Family",
//     phone: "08076543210",
//     regDate: "2023-10-15",
//     status: "Active",
//     dob: "1979-04-25",
//     address: "9 Marina Road, Lagos Island",
//     nextOfKin: "Grace Olatunji",
//     nextOfKinPhone: "08079876543",
//     allergies: "None",
//   },
//   {
//     id: 8,
//     patientId: "PT-1008",
//     fullName: "Ngozi Eze",
//     gender: "Female",
//     age: 33,
//     bloodGroup: "O+",
//     patientType: "NHIS",
//     phone: "08045678912",
//     regDate: "2024-02-18",
//     status: "Active",
//     dob: "1991-06-30",
//     address: "14 Wetheral Road, Owerri",
//     nextOfKin: "Chukwuemeka Eze",
//     nextOfKinPhone: "08042345678",
//     allergies: "None",
//   },
//   {
//     id: 9,
//     patientId: "PT-1009",
//     fullName: "David Mensah",
//     gender: "Male",
//     age: 39,
//     bloodGroup: "AB-",
//     patientType: "Single",
//     phone: "08088997766",
//     regDate: "2023-09-09",
//     status: "Discharged",
//     dob: "1985-02-17",
//     address: "21 Airport Road, Abuja",
//     nextOfKin: "Linda Mensah",
//     nextOfKinPhone: "08081234567",
//     allergies: "Latex",
//   },
//   {
//     id: 10,
//     patientId: "PT-1010",
//     fullName: "Esther Ajayi",
//     gender: "Female",
//     age: 26,
//     bloodGroup: "A+",
//     patientType: "Kadcha",
//     phone: "08022334455",
//     regDate: "2024-03-05",
//     status: "Active",
//     dob: "1998-01-11",
//     address: "32 Bodija Estate, Ibadan",
//     nextOfKin: "Michael Ajayi",
//     nextOfKinPhone: "08021234567",
//     allergies: "None",
//   },
//   {
//     id: 11,
//     patientId: "PT-1011",
//     fullName: "Peter Obiagu",
//     gender: "Male",
//     age: 52,
//     bloodGroup: "B+",
//     patientType: "Family",
//     phone: "08090112233",
//     regDate: "2023-08-12",
//     status: "Active",
//     dob: "1972-12-04",
//     address: "7 Aba Road, Umuahia",
//     nextOfKin: "Angela Obiagu",
//     nextOfKinPhone: "08093456781",
//     allergies: "Hypertension medication",
//   },
//   {
//     id: 12,
//     patientId: "PT-1012",
//     fullName: "Halima Garba",
//     gender: "Female",
//     age: 31,
//     bloodGroup: "O+",
//     patientType: "NHIS",
//     phone: "08077889900",
//     regDate: "2024-01-30",
//     status: "Admitted",
//     dob: "1993-05-22",
//     address: "3 Tafawa Balewa Road, Bauchi",
//     nextOfKin: "Garba Mohammed",
//     nextOfKinPhone: "08074561234",
//     allergies: "None",
//   },
//   {
//     id: 13,
//     patientId: "PT-1013",
//     fullName: "Emmanuel Okoro",
//     gender: "Male",
//     age: 29,
//     bloodGroup: "A+",
//     patientType: "Single",
//     phone: "08066554433",
//     regDate: "2024-02-14",
//     status: "Active",
//     dob: "1995-09-09",
//     address: "18 Aba Expressway, Port Harcourt",
//     nextOfKin: "Patricia Okoro",
//     nextOfKinPhone: "08062345678",
//     allergies: "None",
//   },
//   {
//     id: 14,
//     patientId: "PT-1014",
//     fullName: "Comfort Danladi",
//     gender: "Female",
//     age: 36,
//     bloodGroup: "B-",
//     patientType: "Family",
//     phone: "08099881122",
//     regDate: "2023-12-22",
//     status: "Discharged",
//     dob: "1988-03-01",
//     address: "6 Yakubu Gowon Way, Jos",
//     nextOfKin: "Daniel Danladi",
//     nextOfKinPhone: "08093456789",
//     allergies: "Peanuts",
//   },
//   {
//     id: 15,
//     patientId: "PT-1015",
//     fullName: "Olumide Adebayo",
//     gender: "Male",
//     age: 44,
//     bloodGroup: "O+",
//     patientType: "NHIS",
//     phone: "08055667788",
//     regDate: "2023-07-19",
//     status: "Active",
//     dob: "1980-10-10",
//     address: "10 Admiralty Way, Lekki, Lagos",
//     nextOfKin: "Funke Adebayo",
//     nextOfKinPhone: "08051234567",
//     allergies: "None",
//   },
//   {
//     id: 16,
//     patientId: "PT-1016",
//     fullName: "Ruth Nnamdi",
//     gender: "Female",
//     age: 27,
//     bloodGroup: "AB+",
//     patientType: "Single",
//     phone: "08033441122",
//     regDate: "2024-03-01",
//     status: "Active",
//     dob: "1997-02-13",
//     address: "4 Okpara Avenue, Enugu",
//     nextOfKin: "Chika Nnamdi",
//     nextOfKinPhone: "08034567890",
//     allergies: "None",
//   },
//   {
//     id: 17,
//     patientId: "PT-1017",
//     fullName: "Kabiru Lawal",
//     gender: "Male",
//     age: 38,
//     bloodGroup: "A-",
//     patientType: "Kadcha",
//     phone: "08044332211",
//     regDate: "2024-01-05",
//     status: "Admitted",
//     dob: "1986-06-18",
//     address: "11 Sokoto Road, Katsina",
//     nextOfKin: "Hauwa Lawal",
//     nextOfKinPhone: "08047891234",
//     allergies: "None",
//   },
//   {
//     id: 18,
//     patientId: "PT-1018",
//     fullName: "Jessica Okon",
//     gender: "Female",
//     age: 24,
//     bloodGroup: "O-",
//     patientType: "Single",
//     phone: "08022113344",
//     regDate: "2024-02-20",
//     status: "Active",
//     dob: "2000-04-04",
//     address: "15 Calabar Road, Uyo",
//     nextOfKin: "Thomas Okon",
//     nextOfKinPhone: "08028765432",
//     allergies: "None",
//   },
//   {
//     id: 19,
//     patientId: "PT-1019",
//     fullName: "Michael Adewale",
//     gender: "Male",
//     age: 48,
//     bloodGroup: "B+",
//     patientType: "Family",
//     phone: "08066778899",
//     regDate: "2023-06-11",
//     status: "Active",
//     dob: "1976-01-29",
//     address: "28 Herbert Macaulay Way, Yaba, Lagos",
//     nextOfKin: "Susan Adewale",
//     nextOfKinPhone: "08061239876",
//     allergies: "Diabetes medication",
//   },
//   {
//     id: 20,
//     patientId: "PT-1020",
//     fullName: "Grace Chukwu",
//     gender: "Female",
//     age: 32,
//     bloodGroup: "A+",
//     patientType: "NHIS",
//     phone: "08099887755",
//     regDate: "2024-03-08",
//     status: "Active",
//     dob: "1992-12-15",
//     address: "19 Rumuola Road, Port Harcourt",
//     nextOfKin: "Samuel Chukwu",
//     nextOfKinPhone: "08095432178",
//     allergies: "None",
//   },
// ];


// const Test = () => {
//   const columns = [
//     { title: "Card No", key: "patientId", sortable: true },
//     { title: "Full Name", key: "fullName", sortable: true },
//     { title: "Patient type", key: "patientType", sortable: true },
//     { title: "Gender", key: "gender" },
//     { title: "Age", key: "age", sortable: true },
//     { title: "Phone", key: "phone" },
//     {
//       title: "Status",
//       key: "status",
//       render: (value) => (
//         <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
//           {value}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-white p-3">
//       <DataTable
//         columns={columns}
//         data={patients}
//         searchableKeys={["fullName", "patientId", "phone"]}
//         actions={(row) => (
//           <>
//             <FiEdit className="text-blue-500 cursor-pointer" />
//             <FiTrash2 className="text-red-500 cursor-pointer" />
//             <FiEye className="text-gray-500 cursor-pointer" />
//           </>
//         )}
//       />
//     </div>
//   );
// };

// export default Test;


import React, { useState } from "react";
import { FiEdit, FiTrash2, FiEye, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/Table";
const patients = [
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

const Test = () => {
  const [patientsData, setPatientsData] = useState(patients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // ------------------ OPEN VIEW / EDIT ------------------
  const openModal = (patient, isEdit = false) => {
    setSelectedPatient(patient);
    setEditMode(isEdit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  // ------------------ SAVE EDIT ------------------
  const handleSave = () => {
    setPatientsData((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? selectedPatient : p))
    );
    closeModal();
  };

  // ------------------ DELETE ------------------
  const confirmDelete = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    setPatientsData((prev) =>
      prev.filter((p) => p.id !== selectedPatient.id)
    );
    setIsDeleteOpen(false);
  };

  const columns = [
    { title: "Card No", key: "patientId", sortable: true },
    { title: "Full Name", key: "fullName", sortable: true },
    { title: "Patient type", key: "patientType", sortable: true },
    { title: "Gender", key: "gender" },
    { title: "Age", key: "age", sortable: true },
    { title: "Phone", key: "phone" },
    {
      title: "Status",
      key: "status",
      render: (value) => (
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white p-4">
      <DataTable
        columns={columns}
        data={patientsData}
        searchableKeys={["fullName", "patientId", "phone"]}
        actions={(row) => (
          <div className="flex gap-3">
            <FiEye
              className="text-gray-500 cursor-pointer hover:text-black"
              onClick={() => openModal(row, false)}
            />
            <FiEdit
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={() => openModal(row, true)}
            />
            <FiTrash2
              className="text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => confirmDelete(row)}
            />
          </div>
        )}
      />

      {/* ================= VIEW / EDIT MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-[600px] rounded-2xl shadow-2xl p-6 relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                <FiX size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-6">
                {editMode ? "Edit Patient" : "Patient Details"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "fullName",
                  "patientId",
                  "phone",
                  "gender",
                  "age",
                  "bloodGroup",
                  "patientType",
                  "status",
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-sm text-gray-500 capitalize mb-1">
                      {field}
                    </label>
                    <input
                      type="text"
                      value={selectedPatient[field] || ""}
                      disabled={!editMode}
                      onChange={(e) =>
                        setSelectedPatient({
                          ...selectedPatient,
                          [field]: e.target.value,
                        })
                      }
                      className={`px-4 py-2 rounded-xl border text-sm outline-none transition 
                        ${
                          editMode
                            ? "border-gray-300 focus:ring-2 focus:ring-blue-500"
                            : "bg-gray-100 border-gray-200 cursor-not-allowed"
                        }`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                {editMode && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      <AnimatePresence>
        {isDeleteOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-[400px] rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                Delete Patient?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">
                  {selectedPatient?.fullName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Test;
