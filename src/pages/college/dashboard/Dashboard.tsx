import { Link } from "react-router-dom"

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-6xl font-semibold text-center my-5">College Dashboard</h2>
      <div className="flex gap-8 m-20 justify-center">
        {/* <Link to={'/college/register-admin'} className="px-8 py-3 bg-blue-600 hover:bg-blue-800 text-white rounded duration-200">
          Register New Admin  
        </Link> */}
        <Link to={'/college/create-resource'} className="px-8 py-3 bg-blue-600 hover:bg-blue-800 text-white rounded duration-200">
          Register New Resource 
        </Link>
      </div>
    </div>
  )
}

export default Dashboard