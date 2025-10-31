import { useState, useEffect } from "react";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";
import { showConfirm } from "../../utils/alert";
import type { OrderType } from "../../types";
import ReactPaginate from "react-paginate";
import { Field, Form, Formik } from "formik";
import { FaSearch } from "react-icons/fa";

interface SearchSchema {
  search: string;
}

const OrdersIndex = () => {
  const [orders, setOrders] = useState<any>({ data: [], last_page: 1 });
  const [search, setSearch] = useState("");
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);

  const handleDeleteOrder = (id: number) => {
    Api.deleteOrder({ order_id: id, _token: `${token}` })
      .then((res) => {
        notify("success", res.message || "Orden eliminada correctamente");
        handleSearch({ search });
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };

  const initialValues: SearchSchema = {
    search: "",
  };

  const submitSearch = (values: SearchSchema) => {
    setSearch(values.search);
    handleSearch(values);
  };

  const handlePagination = ({ selected }: any) => {
    const query = { page: selected + 1, search: search };
    handlePaginate(query);
  };

  useEffect(() => {
    Api.readOrders({
      _token: `${token}`,
      query: { commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setOrders(res);
      })
      .catch(console.log);
  }, [token, commerce?.id]);

  const handleSearch = (query: any) => {
    Api.readOrders({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setOrders(res);
      })
      .catch(console.log);
  };

  const handlePaginate = (query: any) => {
    Api.readOrders({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setOrders(res);
      })
      .catch(console.log);
  };

  const tableData: OrderType[] = orders.data ?? [];

  return (
    <div className="flex flex-col">
      {/* Header con búsqueda y botón crear */}
      <div className="flex flex-row justify-between mb-4">
        <div className="w-auto flex-1 flex flex-row">
          <Formik initialValues={initialValues} onSubmit={submitSearch}>
            {() => (
              <Form className="flex flex-row gap-2 w-full mx-2">
                <Field
                  className="input input-sm"
                  type="text"
                  name="search"
                  placeholder="Buscar..."
                />
                <button className="btn neumo ml-auto" type="submit">
                  <FaSearch />
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* <Link to="/orders/create" className="btn neumo btn-primary">
          Nueva Orden
        </Link> */}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto overflow-y-auto min-h-[400px] h-[400px] sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    ID
                  </th>
                  {/* <th scope="col" className="px-6 py-4">
                    Folio
                  </th> */}
                  <th scope="col" className="px-6 py-4">
                    Paciente
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Estatus
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Método de pago
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Fecha Cita
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Fecha Creada
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No hay órdenes disponibles
                    </td>
                  </tr>
                ) : (
                  tableData.map((order) => (
                    <tr key={order.id} className="border-b">
                      {/* ID */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {order.id}
                      </td>

                      {/* Folio */}
                      {/* <td className="whitespace-nowrap px-6 py-4">
                        {order.folio || "Sin folio"}
                      </td> */}

                      {/* Paciente */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {order.appointment?.patient
                          ? `${order.appointment.patient.first_name} ${order.appointment.patient.last_name}`
                          : "N/A"}
                      </td>
                      {/* Folio */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {order.status || "Sin estado"}
                      </td>
                      {/* Total */}
                      <td className="whitespace-nowrap px-6 py-4">
                        ${Number(order.total).toFixed(2)}
                      </td>

                      {/* Estado */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {order.status || "Sin estado"}
                      </td>

                      {/* Método de pago */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {order.payment_method || "N/A"}
                      </td>

                      {/* Fecha */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {order.created_at
                          ? new Date(
                              order.appointment?.start_at ?? ""
                            ).toLocaleDateString("es-MX")
                          : "-"}
                      </td>
                      {/* Fecha */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(
                              "es-MX"
                            )
                          : "-"}
                      </td>

                      {/* Acciones */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/orders/${order.id}`}
                            className="btn neumo btn-info"
                          >
                            Ver
                          </Link>
                          <Link
                            to={`/orders/${order.id}/edit`}
                            className="btn neumo btn-warning"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() =>
                              showConfirm({
                                id: order.id ?? 0,
                                handleConfirm: handleDeleteOrder,
                                title: "Eliminar orden",
                                message: `¿Deseas eliminar la orden <strong>${
                                  order.folio || order.id
                                }</strong>?`,
                                successText: `La orden se eliminó correctamente.`,
                                errorText: `No se pudo eliminar la orden. Intenta de nuevo.`,
                              })
                            }
                            className="btn neumo btn-danger"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {orders.last_page > 1 && (
        <div className="flex flex-row-reverse py-2">
          <ReactPaginate
            previousLabel="←"
            nextLabel="→"
            breakLabel="..."
            pageCount={orders.last_page}
            onPageChange={handlePagination}
            containerClassName="flex space-x-2 mt-4"
            pageClassName="btn neumo"
            previousClassName="btn neumo"
            nextClassName="btn neumo"
            breakClassName="btn neumo"
            activeClassName="btn-primary"
          />
        </div>
      )}
    </div>
  );
};

export default OrdersIndex;
