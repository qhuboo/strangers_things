import { useState, useContext } from "react";
import Header from "../components/Header";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const COHORT_NAME = "2302-acc-pt-web-pt-b";
const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}`;

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken } = useContext(UserContext);
  const [registerError, setRegisterError] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const registerUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              username,
              password,
            },
          }),
        });
        const result = await response.json();
        if (result.success === true) {
          localStorage.setItem(
            "token",
            JSON.stringify({
              token: result.data.token,
            })
          );
          setToken(result.data.token);
          navigate("/");
        }
        if (result.success === false) {
          setRegisterErrorMessage(result.error.message);
          setRegisterError(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    registerUser();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-lg w-96">
          <h1 className="text-3xl mb-6 text-center">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
                minLength="3"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
                minLength="6"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Log in
            </button>
            <br />
            <br />
            <div
              className={
                !registerError
                  ? "invisible"
                  : "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
              }
            >
              <strong className="font-bold ">Error! </strong>
              <span>{registerErrorMessage}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
