import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactApexChart from "react-apexcharts";
import { RootState } from "../../redux/store";
import { fetchResourcePermissions, updateResourcePermission } from "../../redux/slices/permissionsSliceAdmin";
import { ApexOptions } from "apexcharts";

const ResourcePermissionsChart = () => {
  const dispatch = useDispatch();
  const { permissions, loading } = useSelector((state: RootState) => state.permissionSliceAdmin);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const {user} = useSelector((state : RootState) => state.auth);

  useEffect(() => {
    if(user){
      dispatch(fetchResourcePermissions(user.id) as any);
    }
  }, [dispatch, user]);

  const handleStatusUpdate = (id: string, status: string) => {
    dispatch(updateResourcePermission({ id, status }) as any);
  };

  const filteredPermissions = (permissions as any[]).filter((p) => p.resource_id === selectedResource);

  // Prepare chart data
  const chartData = filteredPermissions.map((p) => ({
    x: `${p.event?.name || "Unknown Event"}`,
    y: [
      new Date(`${p.requested_slot.start_date} ${p.requested_slot.start_time}`).getTime(),
      new Date(`${p.requested_slot.end_date} ${p.requested_slot.end_time}`).getTime(),
    ],
    status: p.status,
    id: p.id,
  }));

  const options: ApexOptions = {
    chart: { type: "rangeBar" },
    plotOptions: { bar: { horizontal: true } },
    xaxis: { type: "datetime" },
    tooltip: {
      custom: function ({ dataPointIndex}) {
        const permission = filteredPermissions[dataPointIndex];
        return `
          <div class="p-2 bg-white shadow-md rounded">
            <p><strong>Event:</strong> ${permission.event?.name || "N/A"}</p>
            <p><strong>Resource:</strong> ${permission.resource?.name || "N/A"}</p>
            <p><strong>Status:</strong> ${permission.status}</p>
          </div>
        `;
      },
    },
  };

  return (
    <div className="p-4">
      <label className="block mb-2">Select Resource:</label>
      <select
        className="p-2 border rounded mb-4"
        onChange={(e) => setSelectedResource(e.target.value)}
      >
        <option value="">Select Resource</option>
        {[...new Set(permissions.map((p) => p.resource))].map((resource) => (
          <option key={resource?.id} value={resource?.id}>
            {resource?.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReactApexChart options={options} series={[{ data: chartData }]} type="rangeBar" height={400} />
      )}

      {filteredPermissions.map((p) => (
        <div key={p.id} className="p-2 border rounded mt-2">
          <p><strong>Event:</strong> {p.event?.name || "N/A"}</p>
          <p><strong>Resource:</strong> {p.resource?.name || "N/A"}</p>
          <p><strong>Status:</strong> {p.status}</p>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
            onClick={() => handleStatusUpdate(p.id, "approved")}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => handleStatusUpdate(p.id, "rejected")}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default ResourcePermissionsChart;
