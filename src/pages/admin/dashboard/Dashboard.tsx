import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { RootState } from "../../../redux/store"

const Dashboard = () => {

  const { user, loading} = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <p>Loading...</p>
  }

  if (user?.role !== 'admin') {
    return <p>Access Not Allowed!</p>
  }

  return (
    <div className="my-10">
      <Link to="/admin/permissions" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700">
        Approve Permissions
      </Link>
    </div>
  )
}

export default Dashboard