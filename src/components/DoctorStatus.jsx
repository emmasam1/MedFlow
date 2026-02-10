import { Tag, Avatar } from "antd";

const doctors = [
  { name: "Dr. Jay Soni", status: "Available" },
  { name: "Dr. Sarah SM", status: "Absent" },
  { name: "Dr. Jacob RJ", status: "Available" },
];

const DoctorStatus = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-medium mb-4">Doctor Status</h3>

      {doctors.map((doc) => (
        <div key={doc.name} className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar>{doc.name[3]}</Avatar>
            <span>{doc.name}</span>
          </div>

          <Tag color={doc.status === "Available" ? "green" : "orange"}>
            {doc.status}
          </Tag>
        </div>
      ))}
    </div>
  );
};

export default DoctorStatus;
