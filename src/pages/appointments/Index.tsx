import { useEffect, useRef, useState } from "react";
// import { Link } from "@tanstack/react-router";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import type { AppointmentType } from "../../types";
import DetailPopup from "../../components/DetailPopup";
import { useDetailPopup } from "../../hooks/useDetailPopup";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";
import Modal from "../../components/Modal";

import AppointmentsCreate from "./Create";

const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start_at: start.toISOString().split("T")[0],
    end_at: end.toISOString().split("T")[0],
  };
};

const Index = () => {
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<any>(null);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [viewType, setViewType] = useState("month");
  const [currentDateRange, setCurrentDateRange] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleCalendars, setVisibleCalendars] = useState(new Set<string>());
  const [showAllCalendars, setShowAllCalendars] = useState(true);
  // const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  // const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, event, position, openPopup, closePopup } = useDetailPopup();
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const commerce = useAuthStore((s) => s.commerce);
  const fetchAppointments = async (date: Date) => {
    // Verificar que el token existe antes de hacer la llamada
    if (!token) {
      console.warn("No hay token disponible para cargar citas");
      return;
    }

    const { start_at, end_at } = getMonthRange(date);
    try {
      const res: any = await Api.readAppointments({
        _token: `${token}`,
        query: {
          start_at: start_at,
          end_at: end_at,
          commerce_id: `${commerce?.id}`,
        },
      });

      const data: AppointmentType[] = res ?? [];
      setAppointments(data);

      // Generar lista de calendarios (usuarios únicos)
      const userCalendars = [
        ...new Map(
          data.map((a: any) => [
            a.user.id,
            {
              id: String(a.user.id),
              name: a.user.name,
              backgroundColor: a.user.data?.calendar_color || "#9e5fff",
            },
          ])
        ).values(),
      ];
      setCalendars(userCalendars);

      // Inicializar calendarios visibles
      if (visibleCalendars.size === 0) {
        setVisibleCalendars(new Set(userCalendars.map((c) => c.id)));
      }

      // Cargar en el calendario
      if (calendarInstance.current) {
        calendarInstance.current.clear();
        calendarInstance.current.setCalendars(userCalendars);

        // Solo mostrar eventos de calendarios visibles
        const filteredEvents = data.filter(
          (a) => showAllCalendars || visibleCalendars.has(String(a.user.id))
        );

        calendarInstance.current.createEvents(
          filteredEvents
            .filter((a) => a.patient?.first_name != null)
            .map((a) => ({
              id: String(a.id),
              calendarId: String(a.user.id),
              title: `${a.patient.first_name} ${a.patient.last_name} - ${a.service?.name??'-'}`,
              start: a.start_at,
              raw: a,
              backgroundColor: a.user.data?.calendar_color || "#9e5fff",
              end: a.end_at,
              category: "time",
            }))
        );
      }
    } catch (err) {
      console.error("Error al cargar citas:", err);
      notify(
        "error",

        "No se pudieron cargar las citas. Por favor, intenta nuevamente."
      );
    }
  };

  const updateDateRange = () => {
    if (calendarInstance.current) {
      const start = calendarInstance.current.getDateRangeStart();
      const end = calendarInstance.current.getDateRangeEnd();
      const startDate = new Date(start);
      const endDate = new Date(end);
      // console.log(startDate, endDate);

      if (viewType === "month") {
        setCurrentDateRange(
          startDate.toLocaleDateString("es-MX", {
            month: "long",
            year: "numeric",
          })
        );
      } else if (viewType === "week") {
        setCurrentDateRange(
          `${startDate.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
          })} - ${endDate.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`
        );
      } else {
        setCurrentDateRange(
          startDate.toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
      }
    }
  };

  const handleViewChange = (view: string) => {
    setViewType(view);
    if (calendarInstance.current) {
      calendarInstance.current.changeView(view);
      updateDateRange();
    }
    setIsDropdownOpen(false);
  };

  const handleTodayClick = () => {
    if (calendarInstance.current) {
      calendarInstance.current.today();
      updateDateRange();
    }
  };

  const handlePrevClick = () => {
    if (calendarInstance.current) {
      calendarInstance.current.prev();
      updateDateRange();
    }
  };

  const handleNextClick = () => {
    if (calendarInstance.current) {
      calendarInstance.current.next();
      updateDateRange();
    }
  };

  const handleCalendarToggle = (calendarId: string) => {
    const newVisibleCalendars = new Set(visibleCalendars);
    if (visibleCalendars.has(calendarId)) {
      newVisibleCalendars.delete(calendarId);
    } else {
      newVisibleCalendars.add(calendarId);
    }
    setVisibleCalendars(newVisibleCalendars);

    // Actualizar eventos visibles solo si hay instancia de calendario
    if (calendarInstance.current && appointments.length > 0) {
      const filteredEvents = appointments.filter(
        (a) => showAllCalendars || newVisibleCalendars.has(String(a.user.id))
      );

      calendarInstance.current.clear();
      calendarInstance.current.createEvents(
        filteredEvents
          .filter((a) => a.patient?.first_name != null)
          .map((a) => ({
            id: String(a.id),
            calendarId: String(a.user.id),
            title: `${a.patient.first_name} ${a.patient.last_name} - ${a.service?.name??'-'}`,
            start: a.start_at,
            end: a.end_at,
            raw: a,
            backgroundColor: a.user.data?.calendar_color || "#9e5fff",
            category: "time",
          }))
      );
    }
  };

  const handleViewAllToggle = () => {
    const newShowAll = !showAllCalendars;
    setShowAllCalendars(newShowAll);

    if (newShowAll) {
      setVisibleCalendars(new Set(calendars.map((c) => c.id)));
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      // Aquí harías la llamada a tu API
      // await Api.deleteAppointment({ _token: `${token}`, id: eventId });

      if (calendarInstance.current) {
        calendarInstance.current.deleteEvent(eventId, "");
      }

      setAppointments((prev) => prev.filter((a) => String(a.id) !== eventId));

      notify("success", "La cita ha sido eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      notify("error", "No se pudo eliminar la cita. Intenta nuevamente.");
    }
  };

  const handleEditEvent = (eventData: any) => {
    // Cerrar el popup de detalles
    closePopup();

    // Buscar el appointment completo
    const appointment = appointments.find((a) => String(a.id) === eventData.id);
    if (appointment) {
      // setSelectedEvent(appointment);
      // setIsEditModalOpen(true);
    }
  };

  // const handleUpdateEvent = async () => {
  // const handleUpdateEvent = async (updatedData: any) => {
  // try {
  //   // await Api.updateAppointment({ _token: `${token}`, id: selectedEvent.id, ...updatedData });
  //   if (calendarInstance.current) {
  //     calendarInstance.current.updateEvent(selectedEvent.id, "", {
  //       title: `${updatedData.patient?.first_name ?? selectedEvent.patient.first_name} ${updatedData.patient?.last_name ?? selectedEvent.patient.last_name} - ${updatedData.service?.name ?? selectedEvent.service.name}`,
  //       start:
  //         updatedData.start_at ??
  //         (selectedEvent ? selectedEvent.start_at : ""),
  //       end:
  //         updatedData.end_at ?? (selectedEvent ? selectedEvent.end_at : ""),
  //     });
  //   }
  //   setAppointments((prev) =>
  //     prev.map((a) =>
  //       a.id === selectedEvent.id ? { ...a, ...updatedData } : a
  //     )
  //   );
  //   // setIsEditModalOpen(false);
  //   setSelectedEvent(null);
  //   notify("success", "La cita ha sido actualizada correctamente.");
  // } catch (error) {
  //   console.error("Error al actualizar cita:", error);
  //   notify("error", "No se pudo actualizar la cita. Intenta nuevamente.");
  // }
  // };

  // Inicializar calendario
  useEffect(() => {
    if (calendarContainerRef.current && !calendarInstance.current) {
      calendarInstance.current = new Calendar(calendarContainerRef.current, {
        defaultView: viewType,
        useFormPopup: false,
        useDetailPopup: false,
        isReadOnly: false,
        calendars: [],
        gridSelection: {
          enableDblClick: false,
          enableClick: true,
        },
        week: {
          showTimezoneCollapseButton: true,
          timezonesCollapsed: false,
        },
      });
      calendarInstance.current.on("clickEvent", ({ event }: any) => {
        console.log(event);
        // const _eventData = {
        //   id: event.id,
        //   title: event.title,
        //   start: event.start._date,
        //   end: event.end._date,
        //   raw: event.raw, // Datos completos
        // };
        openPopup(event, event.nativeEvent);
        // el.innerText = event.title;
      });

      // calendarInstance.current.on("beforeUpdateSchedule", (event: any) => {
      //   console.log("update");
      //   event.preventDefault(); // Prevenir la edición por defecto
      //   //  handleEditEvent(event.schedule);
      // });

      // // Escuchar cuando se hace click en "Eliminar" en el popup
      // calendarInstance.current.on("beforeDeleteSchedule", (event: any) => {
      //   console.log("delete");
      //   event.preventDefault(); // Prevenir la eliminación por
      //   // defecto
      //   //  handleDeleteEvent(event.schedule.id);
      // });
      // // Escuchar cuando cambias de rango
      // calendarInstance.current.on("afterRender", (ev: any) => {
      //   const date = new Date(ev.calendarDate);
      //   console.log("change range");
      //   // Solo cargar citas si hay token disponible
      //   if (token) {
      //     fetchAppointments(date);
      //   }
      //   updateDateRange();
      // });

      // // Escuchar creación de eventos
      // calendarInstance.current.on("beforeCreateEvent", (ev: any) => {
      //   console.log("create");
      //   const start = ev.start.toDate();
      //   const end = ev.end.toDate();
      //   notify({
      //     type: "info",
      //     title: "Nueva Cita",
      //     description: `Crear cita de ${start.toLocaleString()} a ${end.toLocaleString()}`,
      //   });
      // });

      updateDateRange();
    }

    // Cargar citas del mes actual solo si hay token
    if (token && calendarInstance.current) {
      fetchAppointments(new Date());
    }

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
        calendarInstance.current = null;
      }
    };
  }, [token]);

  const getViewDisplayName = () => {
    switch (viewType) {
      case "month":
        return "Mensual";
      case "week":
        return "Semanal";
      case "day":
        return "Diario";
      default:
        return "Mensual";
    }
  };

  // Si no hay token, mostrar mensaje de carga
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Calendario de Citas
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setOpenCreate(true)}
              className="btn btn-info neumo"
            >
              Nueva Cita
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="view-all"
                  checked={showAllCalendars}
                  onChange={handleViewAllToggle}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="view-all" className="font-medium text-gray-900">
                  Ver todos
                </label>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Calendarios</h3>
              <div className="space-y-2">
                {calendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`calendar-${calendar.id}`}
                      checked={
                        showAllCalendars || visibleCalendars.has(calendar.id)
                      }
                      onChange={() => handleCalendarToggle(calendar.id)}
                      disabled={showAllCalendars}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: calendar.backgroundColor }}
                    />
                    <label
                      htmlFor={`calendar-${calendar.id}`}
                      className="text-sm text-gray-700 truncate"
                    >
                      {calendar.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navigation Bar */}
          <nav className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* View Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>{getViewDisplayName()}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleViewChange("month")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg"
                      >
                        Mensual
                      </button>
                      <button
                        onClick={() => handleViewChange("week")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Semanal
                      </button>
                      <button
                        onClick={() => handleViewChange("day")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg"
                      >
                        Diario
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleTodayClick}
                  className="btn btn-primary neumo"
                >
                  Hoy
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePrevClick}
                    className="btn btn-primary neumo"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextClick}
                    className="btn btn-primary neumo"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <span className="font-medium text-gray-900 text-lg">
                  {currentDateRange}
                </span>
              </div>
            </div>
          </nav>

          {/* Calendar */}
          <main className="flex-1 p-4">
            <div
              ref={calendarContainerRef}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
              style={{ height: "calc(100vh - 200px)" }}
            />
          </main>
        </div>
      </div>
      <DetailPopup
        event={event}
        isOpen={isOpen}
        position={position}
        onClose={closePopup}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
      {/* <Modal
        isOpen={openEdit}
        onClosex={() => {
          setOpenEdit(false);
        }}
        title="Editar Horario"
      >
        <SchedulesEdit
          userId={userId}
          scheduleId={scheduleId}
          reload={handleGetData}
          onClosex={() => {
            setOpenEdit(false);
          }}
        />
      </Modal> */}
      <Modal
        isOpen={openCreate}
        onClosex={() => {
          setOpenCreate(false);
        }}
        title="Nueva Cita"
      >
        <AppointmentsCreate  onClosex={() => {
          setOpenCreate(false);
        }} />
      </Modal>
    </div>
  );
};

export default Index;
