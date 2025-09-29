import React, { useEffect, useRef, useState } from "react";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import type { AppointmentType } from "../../types";

import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";

const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start_at: start.toISOString().split("T")[0],
    end_at: end.toISOString().split("T")[0],
  };
};
const Index = () => {
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const commerce = useAuthStore((s) => s.commerce);

  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<any>(null);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [viewType, setViewType] = useState("week");
  const [currentDateRange, setCurrentDateRange] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleCalendars, setVisibleCalendars] = useState(new Set<string>());
  const [showAllCalendars, setShowAllCalendars] = useState(true);

  useEffect(() => {
    if (appointments.length === 0) return;
    const userCalendars = [
      ...new Map(
        appointments.map((a) => [
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
    calendarInstance.current = new Calendar(calendarContainerRef.current, {
      defaultView: viewType,
      useDetailPopup: true,
      useCreationPopup: true,
      isReadOnly: false,
      calendars: userCalendars,
      usageStatistics: true,
      gridSelection: {
        enableDblClick: false,
        enableClick: true,
      },
    });
    //   calendarInstance.current.setCalendars(
    //       [

    //       ]
    //   );
    // console.log(appointments);
    // calendarInstance.current.createEvents(
    //   appointments.flatMap((a) => {
    //     if (a.patient?.first_name == null) {
    //       console.log("Paciente sin nombre:", a);
    //       return []; // Retorna array vacío para excluir
    //     }
    //     if (a.user.id !== 1) {
    //       console.log(a);
    //       return [];
    //     }
    //     return [
    //       {
    //         id: String(a.id),
    //         calendarId: String(a.user.id),
    //         title: `${a.patient.first_name} ${a.patient.last_name} - ${a.service?.name ?? ""}`,
    //         start: a.start_at,
    //         end: a.end_at,
    //         category: "time",
    //       },
    //     ];
    //   })
    // );
    calendarInstance.current.on("clickEvent", ({ event }) => {
      const el = document.getElementById("clicked-event");
      console.log(event.title);
      el.innerText = event.title;
    });
    calendarInstance.current.render();
  }, [appointments]);
  useEffect(() => {
    if (!token) {
      console.warn("No hay token disponible para cargar citas");
      return;
    }
    const { start_at, end_at } = getMonthRange(new Date());
    Api.readAppointments({
      _token: token,
      query: {
        start_at: start_at,
        end_at: end_at,
        commerce_id: `${commerce?.id}`,
      },
    }).then((res) => {
      setAppointments(res);
    });
  }, []);
  return (
    <div>
      <div
        ref={calendarContainerRef}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
        style={{ height: "calc(100vh - 200px)" }}
      />
    </div>
  );
};

export default Index;
