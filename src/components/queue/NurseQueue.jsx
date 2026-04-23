import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Skeleton,
  Calendar,
  ConfigProvider,
  theme,
  Tabs,
  Collapse,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { HiSearch, HiCalendar } from "react-icons/hi";
import { FaPaperPlane } from "react-icons/fa";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";
import { useAppStore } from "../../store/useAppStore";
import { useStore } from "../../store/store";
import { ToastContainer, toast } from "react-toastify";
import CreateQueue from "../../components/CreateQueue";
import VitalsModal from "../../components/VitalsModal";

const NurseQueue = () => {
  const {
    queue = [],
    doctorQueue,
    getQueue,
    getDoctorWorkload,
    cancelQueue,
    takeVitals,
    getPatientSummary,
    submitConsultation,
  } = useAppStore();
  const { darkMode } = useStore();
  const user = useAppStore((state) => state.user);
  return (
     <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-2xl shadow-md min-h-[85vh]`}
    >NurseQueue</div>
  );
};

export default NurseQueue;
