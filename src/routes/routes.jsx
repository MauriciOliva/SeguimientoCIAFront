import { createBrowserRouter, Router, Routes, RouterProvider } from "react-router";
import { AgendaPage } from "../pages/AgendaPAge";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AgendaPage />,
    },
]);

const MyRoutes = () =><RouterProvider router={router} />;

export default MyRoutes;