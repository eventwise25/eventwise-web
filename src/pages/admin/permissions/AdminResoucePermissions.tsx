// import ResourcePermissionsChart from "../../../components/charts/ResoucePermissionsChart";

// const AdminResourcePermissions = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Resource Permissions</h1>
//       <ResourcePermissionsChart />
//     </div>
//   );
// };

// export default AdminResourcePermissions;


import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { fetchResourcePermissions, updateResourcePermission } from "../../../redux/slices/permissionsSlice";
import SlotBlock from "../../../components/admin/SlotBlock";
import SlotDetailsModal from "../../../components/admin/SlotDetailsModal";
import { Resource } from "../../../interface/Resources";

const AdminResourcePermissions = () => {
  const dispatch = useDispatch();
  const { permissions, loading } = useSelector(
    (state: RootState) => state.permissions
  );
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [slotToApprove, setSlotToApprove] = useState<any>(null);

  const doSlotsOverlap = (a: any, b: any) => {
    const aStart = new Date(`${a.start_date}T${a.start_time}`);
    const aEnd = new Date(`${a.end_date}T${a.end_time}`);
    const bStart = new Date(`${b.start_date}T${b.start_time}`);
    const bEnd = new Date(`${b.end_date}T${b.end_time}`);

    return aStart < bEnd && bStart < aEnd;
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    if (user) {
      dispatch(fetchResourcePermissions({ college_id: user.college_id, admin_id: user.id }) as any);
    }
  }, [dispatch, user]);

  const handleStatusUpdate = (id: string, status: string) => {
    if (!user || user.role !== 'admin') return;

    dispatch(updateResourcePermission({ college_id: user.college_id, id, status }) as any);
    setSelectedSlot(null); // close modal after update
  };

  const filteredPermissions = (permissions as any[]).filter(
    (p) =>
      p.resource_id === selectedResource &&
      p.status === "pending_admin_approval"
  );

  const uniqueResources = Object.values(
    permissions.reduce((acc: Record<string, Resource>, p) => {
      if (p.resource?.id && !acc[p.resource.id]) {
        acc[p.resource.id] = p.resource;
      }
      return acc;
    }, {})
  );

  console.log(uniqueResources);

  const handleConfirmApprove = () => {
    if (!user || user.role !== 'admin' || !slotToApprove) return;

    const overlappingRequests = (permissions as any[]).filter((p) => {
      if (
        p.resource_id === slotToApprove.resource_id &&
        p.id !== slotToApprove.id &&
        p.status === "pending_admin_approval"
      ) {
        return doSlotsOverlap(p.requested_slot, slotToApprove.requested_slot);
      }
      return false;
    });

    // Approve selected
    dispatch(
      updateResourcePermission({
        college_id: user.college_id,
        id: slotToApprove.id,
        status: "approved",
      }) as any
    );

    // Reject all overlapping
    overlappingRequests.forEach((req) => {
      dispatch(
        updateResourcePermission({
          college_id: user.college_id,
          id: req.id,
          status: "rejected",
        }) as any
      );
    });

    // Cleanup
    setShowConfirmDialog(false);
    setSelectedSlot(null);
    setSlotToApprove(null);
  };


  return (
    <>
    
    <div className="p-6 space-y-4">
      <label className="block font-semibold">Select Resource:</label>
      <select
        className="p-2 border rounded mb-4"
        onChange={(e) => setSelectedResource(e.target.value)}
      >
        <option value="">-- Select Resource --</option>
        {uniqueResources.map((resource) => (
          <option key={resource.id} value={resource.id}>
            {resource.name}
          </option>
        ))}
      </select>

      {loading && (
        <div>
          Loading...
        </div>
      )}

      {filteredPermissions.length === 0 && selectedResource && (
        <p className="text-gray-500">No requests yet for this resource.</p>
      )}

      <div className="grid gap-4">
        {filteredPermissions.map((slot) => (
          <SlotBlock key={slot.id} slot={slot} onClick={setSelectedSlot} />
        ))}
      </div>

      {selectedSlot && (
        <>
          <SlotDetailsModal
            slot={selectedSlot}
            onClose={() => setSelectedSlot(null)}
            onApprove={() => {
              setSlotToApprove(selectedSlot);
              setShowConfirmDialog(true);
              setSelectedSlot(null);
            }}
            onReject={() =>
              handleStatusUpdate(selectedSlot.id, "rejected")
            }
          />
        </>
      )}


    </div>
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Approval</h2>
            <p className="mb-4">
              Approving this slot will automatically reject all overlapping requests
              for this resource. Do you want to proceed?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                onClick={() => {
                  setShowConfirmDialog(false);
                  // setSlotToApprove(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                onClick={() => handleConfirmApprove()}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminResourcePermissions;

