import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import ForgotPassword from './pages/auth/ForgetPassword'
import OrgDashboard from './pages/organizer/dashboard/Dashboard'
import Events from './pages/organizer/events/Events'
import Resources from './pages/organizer/resources/Permissions'
import AddResource from './pages/college/dashboard/AddResource'
import AdmDashboard from './pages/admin/dashboard/Dashboard'
import AdminResourcePermissions from './pages/admin/permissions/AdminResoucePermissions'
import EventDetails from './pages/organizer/events/details/EventDetails'
import Permissions from './pages/organizer/resources/Permissions'
import RoleSelectionForRegistration from './pages/auth/RoleSelectionForRegistration'
import SignUpCollege from './pages/auth/SignUpCollege'
import SignUpOrganizer from './pages/auth/SignUpOrganizer'
import SignUpAdmin from './pages/auth/SignUpAdmin'
import CollegeDashboard from './pages/college/dashboard/Dashboard'
import AdminForm from './pages/college/dashboard/AdminForm'

function App() {

  return (
    <>
    <Provider store={store}>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<RoleSelectionForRegistration/>} />
          <Route path='/signup/college' element={<SignUpCollege/>} />
          <Route path='/signup/organizer' element={<SignUpOrganizer/>} />
          <Route path='/signup/admin' element={<SignUpAdmin/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/organizer/dashboard' element={<OrgDashboard/>} />
          <Route path='/college/dashboard' element={<CollegeDashboard/>} />
          {/* <Route path='/organizer/events' element={<Events/>} /> */}
          {/* <Route path='/organizer/events/create' element={<EventForm/>} /> */}
          <Route path='/organizer/events/:subpage?' element={<Events/>} />
          <Route path='/organizer/events/view/:id?' element={<EventDetails/>} />
          <Route path='/organizer/permissions/:subpage?' element={<Permissions/>} />
          <Route path='/organizer/resources' element={<Resources/>} />
          <Route path='/admin/dashboard' element={<AdmDashboard/>} />
          <Route path='/admin/permissions' element={<AdminResourcePermissions/>} />
          <Route path='/college/create-resource' element={<AddResource/>} />
          <Route path='/college/register-admin' element={<AdminForm/>} />
        </Route>
      </Routes>
    </Provider>
    </>
  )
}

export default App
