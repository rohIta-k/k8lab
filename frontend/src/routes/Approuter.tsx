import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  DASHBOARD_ROUTE,
  RESOURCES_ROUTE,
  TOPOLOGY_ROUTE,
  EXPERIMENTS_ROUTE,
} from "../constants/navigation";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Resources from "../pages/Resources/Resources";
import Topology from "../pages/Topology/Topology";
import Experiments from "../pages/Experiments/Experiments";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path={DASHBOARD_ROUTE.path}
            element={<Dashboard />}
          />

          <Route
            path={RESOURCES_ROUTE.path}
            element={<Resources />}
          />

          <Route
            path={TOPOLOGY_ROUTE.path}
            element={<Topology />}
          />

          <Route
            path={EXPERIMENTS_ROUTE.path}
            element={<Experiments />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to={DASHBOARD_ROUTE.path}
                replace
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}