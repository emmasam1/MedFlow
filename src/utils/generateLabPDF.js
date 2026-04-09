import jsPDF from "jspdf";
import dayjs from "dayjs";

export const generateLabPDF = (lab) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("LABORATORY REPORT", 70, 20);

  doc.setFontSize(12);

  doc.text(`Patient: ${lab.patientName}`, 10, 40);
  doc.text(`Date: ${dayjs(lab.date).format("DD MMM YYYY")}`, 10, 50);

  let y = 70;

  doc.text("Test Results:", 10, y);
  y += 10;

  lab.tests?.forEach((t) => {
    doc.text(`${t.name}: ${t.result}`, 10, y);
    y += 10;
  });

  y += 10;
  doc.text(`Notes: ${lab.notes || "-"}`, 10, y);

  doc.save(`Lab_Result_${lab.patientName}.pdf`);
};