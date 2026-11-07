import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { server } from "../../server.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  //Handle the file Input Change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 500;

        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // compress image
        const compressedImage = canvas.toDataURL(
          "image/jpeg",
          0.7
        );

        setAvatar(compressedImage);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  // Handle form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/user/create-user`,
        { name, email, password, avatar }
      )
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar();
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#315c46] bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-gray-600">Join us and start shopping today</p>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Input for name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#315c46] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Input for Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Input for Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  placeholder="Create a password"
                />
                {/* toggle visibility Password */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? (
                    <AiOutlineEye size={22} />
                  ) : (
                    <AiOutlineEyeInvisible size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* Input for Avatar */}
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Profile Avatar
              </label>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative">
                  <span className="inline-block h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <RxAvatar className="h-10 w-10 text-gray-400" />
                    )}
                  </span>
                </div>
                {/* File Input for Avatar */}
                <label
                  htmlFor="file-input"
                  className="flex items-center px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 cursor-pointer transition-all"
                >
                  <span>Upload Avatar</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Create Account
              </button>
            </div>

            {/* Link to the Login*/}
            <div className="flex items-center justify-center w-full pt-4">
              <p className="text-gray-600">Already have an account?</p>
              <Link to="/login" className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
