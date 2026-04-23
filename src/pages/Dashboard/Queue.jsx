import React from 'react'
import { useAppStore } from "../../store/useAppStore";
import DoctorQueue from '../../components/queue/DoctorQueue';
import NurseQueue from '../../components/queue/NurseQueue';
import LabQueue from '../../components/queue/LabQueue';
import PharmacyQueue from '../../components/queue/PharmacyQueue';
import FinanceQueue from '../../components/queue/FinanceQueue';
import RecordQueue from '../../components/queue/RecordQueue';

const Queue = () => {
  const user = useAppStore((state) => state.user);
  // console.log(user?.role)
  return (
    <div>
      {user.role === "doctor" && <DoctorQueue />}
      {user.role === "nurse" && <NurseQueue />}
      {user.role === "lab_officer" && <LabQueue />}
      {user.role === "pharmacist" && <PharmacyQueue />}
      {user.role === "finance_officer" && <FinanceQueue />}
      {user.role === "record_officer" && <RecordQueue />}
    </div>
  )
}

export default Queue