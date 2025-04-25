import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkUserSession } from "../services/authService";
import { RootState } from "../redux/store";
import FeatureCard from "../components/cards/FeatureCard";
import StepCard from "../components/cards/StepCard";

const OrganizerHome: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserSession(dispatch);
  }, [dispatch]);

  const getDashboardPath = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "organizer":
        return "/organizer/dashboard";
      case "college":
      default:
        return "/college/dashboard";
    }
  };

  // if (user?.role) {
  //   navigate(getDashboardPath(user.role));
  // }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Effortless Event Management</h1>
        <p className="mt-4 text-lg">
          Plan, organize, and manage events with ease. From scheduling to approvals, all in one place.
        </p>

        {/* Show loading indicator while checking auth */}
        {loading ? (
          <div className="mt-6 text-lg">Checking authentication...</div>
        ) : (
          <div className="mt-6 flex justify-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-200"
                >
                  🚀 Get Started
                </Link>
                <Link
                  to="/login"
                  className="border border-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600"
                >
                  🔑 Log In
                </Link>
              </>
            ) : (
              <Link
                to={getDashboardPath(user?.role)}
                className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-200"
              >
                🚀 Go To Dashboard
              </Link>
            )}
          </div>
        )}

      </div>

      {/* Key Features */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-center">Why Choose Our Event Management System?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon="📅" title="Event Scheduling" description="Create and manage events seamlessly with automated approvals." />
          <FeatureCard icon="✅" title="Resource Management" description="Easily request and track venue, equipment, and catering approvals." />
          <FeatureCard icon="📊" title="Real-Time Insights" description="Monitor registrations, budgets, and approvals in one place." />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-12">
        <h2 className="text-2xl font-semibold text-center">How It Works</h2>
        <div className="mt-6 flex flex-col items-center space-y-4">
          <StepCard step="1️⃣" title="Sign Up & Log In" description="Create an account and access the organizer dashboard." />
          <StepCard step="2️⃣" title="Create Your Event" description="Fill in event details, request resources, and get approvals." />
          <StepCard step="3️⃣" title="Manage & Track" description="Monitor registrations, budget, and announcements in real-time." />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold">Ready to Get Started?</h2>
        <p className="mt-2 text-lg">Join us today and simplify your event management process.</p>
        <div className="mt-6">
          <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700">
            🎉 Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OrganizerHome;
