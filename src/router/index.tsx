
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
import Profile from "../pages/Profile";
import StudyPlanner from "../pages/StudyPlanner";

import DashboardLayout from "../layouts/DashboardLayout";

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

  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/subjects",
        element: <Subjects />,
      },
      {
        path: "/assignments",
        element: <Assignments />,
      },
      {
        path: "/calendar",
        element: <Calendar />,
      },
      {
        path: "/study-planner",
        element: <StudyPlanner />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
