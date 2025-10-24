import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { Api } from "../services/api";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

const Dashboard = () => {
  const commerce = useAuthStore((s) => s.commerce);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [appointmentState, setAppointmentState] = useState({
    appointments: [],
    appointments_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<any>(null);

  useEffect(() => {
    // Inicializar el calendario primero
    if (calendarContainerRef.current && !calendarInstance.current) {
      calendarInstance.current = new Calendar(calendarContainerRef.current, {
        defaultView: "day",
        useFormPopup: false,
        useDetailPopup: false,
        isReadOnly: true,
        calendars: [],
        gridSelection: {
          enableDblClick: false,
          enableClick: false,
        },
        week: {
          showTimezoneCollapseButton: true,
          timezonesCollapsed: false,
        },
      });
    }

    // Cargar datos
    setIsLoading(true);
    Api.dashboard({
      _token: token!,
      user_id: user!.id,
      commerce_id: commerce!.id ?? 1,
    })
      .then((res) => {
        setAppointmentState(res);
        if (res.appointments && calendarInstance.current) {
          loadEvents(res.appointments);
        }
      })
      .catch((error) => {
        console.error("Error loading dashboard:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Cleanup
    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
        calendarInstance.current = null;
      }
    };
  }, [token, user, commerce]);

  const loadEvents = (appointments: any[]) => {
    if (!calendarInstance.current) return;

    const filteredEvents = appointments
      .filter((a: any) => a.patient?.first_name != null)
      .map((a: any) => ({
        id: String(a.id),
        calendarId: String(a.user?.id || "default"),
        title: `${a.patient?.first_name} ${a.patient?.last_name} - ${a.service?.name ?? "-"}`,
        start: new Date(a.start_at),
        end: new Date(a.end_at),
        backgroundColor: a.user?.data?.calendar_color || "#9e5fff",
        borderColor: a.user?.data?.calendar_color || "#9e5fff",
        category: "time",
        isReadOnly: true,
        raw: a,
      }));

    // console.log("Loading events:", filteredEvents); // Debug

    calendarInstance.current.clear();
    calendarInstance.current.createEvents(filteredEvents);
  };

  return (
    <div className="p-4">
      {isLoading && (
        <div className="text-center py-4">
          <p>Cargando...</p>
        </div>
      )}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col gap-2">
          <div className="card">
            <div className="card-header text-center">Total de Consultas</div>
            <div className="card-body">
              <h5 className="card-title text-2xl text-center font-bold">
                {appointmentState.appointments_count ?? 0}
              </h5>
            </div>
          </div>
        </div>
        <div
          ref={calendarContainerRef}
          className="card col-span-12 md:col-span-8 lg:col-span-9 p-2"
          style={{ height: "calc(100vh - 200px)" }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
