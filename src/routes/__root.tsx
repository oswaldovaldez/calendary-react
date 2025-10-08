import { Router, Route, RootRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "../components/Layout.tsx";
import {
  AppointmentsIndex,
  AppointmentsShow,
} from "../pages/appointments/index.ts";
import {
  CategoriesIndex,
  CategoriesCreate,
  CategoriesShow,
  CategoriesEdit,
} from "../pages/categories/index.ts";
import {
  CommercesIndex,
  CommercesCreate,
  CommercesShow,
  CommercesEdit,
} from "../pages/commerces/index.ts";
import {
  PatientsCreate,
  PatientsEdit,
  PatientsIndex,
  PatientsShow,
} from "../pages/patients/index.ts";
import {
  ProductsCreate,
  ProductsEdit,
  ProductsIndex,
  ProductsShow,
} from "../pages/products/index.ts";
// import {
//   RecordsCreate,
//   RecordsEdit,
//   RecordsIndex,
//   RecordsShow,
// } from "../pages/records/index.ts";
// import {
//   SchedulesCreate,
//   SchedulesEdit,
//   SchedulesIndex,
//   SchedulesShow,
// } from "../pages/schedules/index.ts";
import {
  TemplatesCreate,
  TemplatesEdit,
  TemplatesIndex,
  TemplatesShow,
} from "../pages/templates/index.ts";
import {
  ServicesIndex,
  ServicesCreate,
  ServicesShow,
  ServicesEdit,
} from "../pages/services/index.ts";
import { UsersIndex, UsersCreate, UsersShow, UsersEdit } from "../pages/users";
import Home from "../Home.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import { RouteGuard } from "../components/RouteGuard.tsx";
import Profile from "../pages/Profile.tsx";
// ... importa los demás

const rootRoute = new RootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const routeTree = rootRoute.addChildren([
  new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <Home />,
  }),

  new Route({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: () => (
      <RouteGuard permission="dashboard.view">
        <Dashboard />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/profile",
    component: () => <Profile />,
  }),

  //usuarios
  new Route({
    getParentRoute: () => rootRoute,
    path: "/users",
    component: () => (
      <RouteGuard permission="users.view">
        <UsersIndex />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/users/create",
    component: () => (
      <RouteGuard permission="users.create">
        <UsersCreate />
      </RouteGuard>
    ),
  }),

  new Route({
    getParentRoute: () => rootRoute,
    path: "/users/$userId",
    component: () => (
      <RouteGuard permission="users.view">
        <UsersShow />
      </RouteGuard>
    ),
  }),

  new Route({
    getParentRoute: () => rootRoute,
    path: "/users/$userId/edit",
    component: () => (
      <RouteGuard permission="users.edit">
        <UsersEdit />
      </RouteGuard>
    ),
  }),
  // Appointments
  new Route({
    getParentRoute: () => rootRoute,
    path: "/appointments",
    component: () => (
      <RouteGuard permission="appointments.view">
        <AppointmentsIndex />
      </RouteGuard>
    ),
  }),
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/appointments/create",
  //   component: () => (
  //     <RouteGuard permission="appointments.create">
  //       <AppointmentsCreate />
  //     </RouteGuard>
  //   ),
  // }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/appointments/$appointmentId",
    component: () => (
      <RouteGuard permission="appointments.view">
        <AppointmentsShow />
      </RouteGuard>
    ),
  }),
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/appointments/$appointmentId/edit",
  //   component: () => (
  //     <RouteGuard permission="appointments.edit">
  //       <AppointmentsEdit />
  //     </RouteGuard>
  //   ),
  // }),

  // Categories
  new Route({
    getParentRoute: () => rootRoute,
    path: "/categories",
    component: () => (
      <RouteGuard permission="categories.view">
        <CategoriesIndex />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/categories/create",
    component: () => (
      <RouteGuard permission="categories.create">
        <CategoriesCreate />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/categories/$categoryId",
    component: () => (
      <RouteGuard permission="categories.view">
        <CategoriesShow />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/categories/$categoryId/edit",
    component: () => (
      <RouteGuard permission="categories.edit">
        <CategoriesEdit />
      </RouteGuard>
    ),
  }),

  // Commerces
  new Route({
    getParentRoute: () => rootRoute,
    path: "/commerces",
    component: () => (
      <RouteGuard permission="commerces.view">
        <CommercesIndex />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/commerces/create",
    component: () => (
      <RouteGuard permission="commerces.create">
        <CommercesCreate />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/commerces/$commerceId",
    component: () => (
      <RouteGuard permission="commerces.view">
        <CommercesShow />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/commerces/$commerceId/edit",
    component: () => (
      <RouteGuard permission="commerces.edit">
        <CommercesEdit />
      </RouteGuard>
    ),
  }),

  // Patients
  new Route({
    getParentRoute: () => rootRoute,
    path: "/patients",
    component: () => (
      <RouteGuard permission="patients.view">
        <PatientsIndex />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/patients/create",
    component: () => (
      <RouteGuard permission="patients.create">
        <PatientsCreate />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/patients/$patientId",
    component: () => (
      <RouteGuard permission="patients.view">
        <PatientsShow />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/patients/$patientId/edit",
    component: () => (
      <RouteGuard permission="patients.edit">
        <PatientsEdit />
      </RouteGuard>
    ),
  }),

  // Products
  new Route({
    getParentRoute: () => rootRoute,
    path: "/products",
    component: () => (
      <RouteGuard permission="products.view">
        <ProductsIndex />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/products/create",
    component: () => (
      <RouteGuard permission="products.create">
        <ProductsCreate />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/products/$productId",
    component: () => (
      <RouteGuard permission="products.view">
        <ProductsShow />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/products/$productId/edit",
    component: () => (
      <RouteGuard permission="products.edit">
        <ProductsEdit />
      </RouteGuard>
    ),
  }),

  // Records
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/records",
  //   component: () => (
  //     <RouteGuard permission="records.view">
  //       <RecordsIndex />
  //     </RouteGuard>
  //   ),
  // }),
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/records/create",
  //   component: () => (
  //     <RouteGuard permission="records.create">
  //       <RecordsCreate />
  //     </RouteGuard>
  //   ),
  // }),
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/records/$recordId",
  //   component: () => (
  //     <RouteGuard permission="records.view">
  //       <RecordsShow />
  //     </RouteGuard>
  //   ),
  // }),
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/records/$recordId/edit",
  //   component: () => (
  //     <RouteGuard permission="records.edit">
  //       <RecordsEdit />
  //     </RouteGuard>
  //   ),
  // }),

  // Records Template
  new Route({
    getParentRoute: () => rootRoute,
    path: "/templates",
    component: () => (
      <RouteGuard permission="records.template.view">
        <TemplatesIndex />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/templates/create",
    component: () => (
      <RouteGuard permission="records.template.create">
        <TemplatesCreate />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/templates/$templateId",
    component: () => (
      <RouteGuard permission="records.template.view">
        <TemplatesShow />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/templates/$templateId/edit",
    component: () => (
      <RouteGuard permission="records.template.edit">
        <TemplatesEdit />
      </RouteGuard>
    ),
  }),

  // Schedules
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/schedules",
  //   component: () => (
  //     <RouteGuard permission="schedules.view">

  //       <SchedulesIndex />
  //     </RouteGuard>
  //   ),
  // }),
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/schedules/create",
  //   component: () => (
  //     <RouteGuard permission="schedules.create">
  //       <SchedulesCreate />
  //     </RouteGuard>
  //   ),
  // }),
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/schedules/$scheduleId",
  //   component: () => (
  //     <RouteGuard permission="schedules.view">
  //       <SchedulesShow />
  //     </RouteGuard>
  //   ),
  // }),
  // new Route({
  //   getParentRoute: () => rootRoute,
  //   path: "/schedules/$scheduleId/edit",
  //   component: () => (
  //     <RouteGuard permission="schedules.edit">
  //       <SchedulesEdit />
  //     </RouteGuard>
  //   ),
  // }),

  // Services
  new Route({
    getParentRoute: () => rootRoute,
    path: "/services",
    component: () => (
      <RouteGuard permission="services.view">
        <ServicesIndex />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/services/create",
    component: () => (
      <RouteGuard permission="services.create">
        <ServicesCreate />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/services/$serviceId",
    component: () => (
      <RouteGuard permission="services.view">
        <ServicesShow />
      </RouteGuard>
    ),
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/services/$serviceId/edit",
    component: () => (
      <RouteGuard permission="services.edit">
        <ServicesEdit />
      </RouteGuard>
    ),
  }),
  // ... las demás rutas
]);

export const router = new Router({ routeTree });
