import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/auth/authSlice";
import { loginWithEmail } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Email validation regex
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      const userData = await loginWithEmail(email, password);
      dispatch(setUser(userData));
      console.log(userData);
      if(userData?.role === "admin"){
        navigate("/admin/dashboard");
      }
      else if(userData?.role === "organizer"){
        navigate("/organizer/dashboard");
      }
      else{
        navigate("/college/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="mb-8">
                <h3 className="text-gray-800 text-3xl font-bold">Sign in</h3>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                  Sign in to your account and explore a world of possibilities. Your journey begins here.
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-sm text-gray-800 border border-gray-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-sm text-gray-800 border border-gray-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter password"
                />
              </div>

              {/* Display Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to={"/forgot-password"} className="text-blue-600 hover:underline font-semibold">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full block text-center shadow-xl py-2.5 px-4 text-md tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
                >
                  Sign in
                </button>
              </div>

              <p className="text-sm !mt-8 text-center text-gray-500">
                Don't have an account?{" "}
                <Link to={"/signup"} className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap cursor-pointer">
                  Register here
                </Link>
              </p>
            </form>
          </div>

          <div className="max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="Dining Experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
