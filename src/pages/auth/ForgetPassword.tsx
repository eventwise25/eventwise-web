import { useState } from "react";
import { resetPassword } from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter a valid email address");
      setMessage("");
      return;
    }
    
    try {
      await resetPassword(email);
      setMessage("Check your email for password reset instructions.");
      setError("");
    } catch (err) {
      setError("Error resetting password. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-50 font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-gray-800 text-center text-2xl font-bold">Forgot Password</h2>
            {message && <div className="alert alert-success text-green-600 text-center mt-3">{message}</div>}
            {error && <div className="alert alert-danger text-red-600 text-center mt-3">{error}</div>}
            <form className="mt-8 space-y-4">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="!mt-8">
                <button
                  type="button"
                  className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
              </div>
              <p className="text-gray-800 text-sm !mt-8 text-center">
                Don't have an account?
                <a href="/signup" className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold">
                  Register here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;