// import { useEffect } from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

const PendingPermissions = () => {
  const { pendingPermissions, loading, error } = useSelector(
    (state: RootState) => state.permissions
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Pending Permissions</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {
        pendingPermissions.length === 0 && (
          <p>No Pending Permissions</p>
        )
      }
      <ul className="list-disc pl-5">
        {pendingPermissions.map((perm) => (
          <li key={perm.id} className="p-2 border-b">
            <span className="font-semibold">{perm.id}</span> - {perm.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingPermissions;
