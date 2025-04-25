import { useParams } from "react-router";
import PermissionsNav from "./PermissionsNav";
import RequestPermission from "./RequestPermission";
import PendingPermissions from "./PendingPermissions";
import { getApprovedPermissions, getPendingPermissions } from "../../../redux/slices/permissionsSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Permissions = () => {
  const { subpage } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { approvedPermissions, loading, error } = useSelector(
    (state: RootState) => state.permissions
  );
  const {user} = useSelector((state : any) => state.auth);

  // console.log(user);
  // console.log(approvedPermissions);

  useEffect(() => {
    if (!user || user.role !== "organizer") return;

    dispatch(
      getApprovedPermissions({
        college_id: user.college_id,
        organizer_id: user.id,
      })
    );
    dispatch(getPendingPermissions({
      college_id: user.college_id,
      organizer_id: user.id,
    }));
  }, [dispatch, user]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* <PermissionsNav subpage={subpage} /> */}

      {subpage === undefined && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Approved Permissions</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {
            approvedPermissions.length === 0 && (
              <p>No Approved Permissions</p>
            )
          }
          <ul className="list-disc pl-5">
            {approvedPermissions.map((perm) => (
              <li key={perm.id} className="p-2 border-b">
                <span className="font-semibold">{perm.id}</span> - {perm.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      {subpage === "request" && <RequestPermission />}
      {subpage === "pending" && <PendingPermissions />}
    </div>
  );
};

export default Permissions;
