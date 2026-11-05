import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Calendar from "../pages/Calendar";
import Dashboard from "../pages/Dashboard";
import Subjects from "../pages/Subjects";
import Assignments from "../pages/Assignments";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },

  { path: "/calendar", element: <Calendar />

   },

   { path: "/dashboard", element: <Dashboard /> },

   { path: "/subjects", element: <Subjects /> },

   { path: "/assignments", element: <Assignments /> },


]);

export default router;