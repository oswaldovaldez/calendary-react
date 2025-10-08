// import { useState, useEffect, useRef } from "react";
import { useEffect, useRef } from "react";
import {
  X,
  Edit2,
  Trash2,
  Clock,
  User,
  Briefcase,
  Calendar as CalendarIcon,
  FileText,
  AlertCircle,
  Building2,
} from "lucide-react";
import { FaEye } from "react-icons/fa";
import { showConfirm } from "../utils/alert";
import { Link } from "@tanstack/react-router";
interface EventData {
  id: string;
  calendarId: string;
  title: string;
  start: Date | string;
  end: Date | string;
  body?: string;
  location?: string;
  raw?: {
    name: string;
    description?: string;
    notes?: string;
    commerce_id: number;
    patient_id: number;
    schedule_id?: number | null;
    service_id: number;
    user_id?: number | null;
    start_at: string;
    end_at: string;
    status?: string;
    // Relaciones
    patient?: {
      id: number;
      first_name: string;
      last_name: string;
      email?: string;
      phone?: string;
    };
    service?: {
      id: number;
      name: string;
      description?: string;
      duration?: number;
      price?: number;
    };
    user?: {
      id: number;
      name: string;
      email?: string;
    };
    commerce?: {
      id: number;
      name: string;
    };
  };
  backgroundColor?: string;
}

interface DetailPopupProps {
  event: EventData | null;
  isOpen: boolean;

  onClose: () => void;
  onEdit?: (event: EventData) => void;
  onDelete?: (eventId: string) => void;
}

const DetailPopup: React.FC<DetailPopupProps> = ({
  event,
  isOpen,

  onClose,
  onEdit,
  onDelete,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("es-MX", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventColor = () => {
    return event.backgroundColor || "#3b82f6";
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "pending":
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "cancelada":
        return "bg-red-100 text-red-800";
      case "completed":
      case "completada":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "Programada";
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelada";
      case "completed":
        return "Completada";
      default:
        return status || "Sin estado";
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
      onClose();
    }
  };

  const handleDelete = () => {
    showConfirm({
      id: parseInt(event.id),
      handleConfirm: () => onDelete?.(event.id),
      title: "Eliminar Cita",
      message: `¿Deseas eliminar la Cita <strong>${event.raw?.name}</strong>?`,
      successText: `La Cita <strong>${event.raw?.name}</strong> se eliminó correctamente.`,
      errorText: `No se pudo eliminar la Cita <strong>${event.raw?.name}</strong>. Intenta de nuevo.`,
    });
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 w-96 animate-fadeIn"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000, // Asegúrate de que esté por encima de otros elementos
        // ... otros estilos para el popup (background, padding, etc.)
      }}
    >
      {/* Header con color del calendario */}
      <div
        className="h-2 rounded-t-lg"
        style={{ backgroundColor: getEventColor() }}
      />

      {/* Contenido */}
      <div className="p-4">
        {/* Título y botón cerrar */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-8">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
              {event.raw?.name || event.title}
            </h3>
            {event.raw?.status && (
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.raw.status)}`}
              >
                {getStatusLabel(event.raw.status)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Información del evento */}
        <div className="space-y-3 mb-4 h-auto max-h-[60vh] overflow-y-auto">
          {/* Fecha y hora */}
          <div className="flex items-start space-x-3">
            <Clock size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <div className="font-medium">
                {formatDate(event.raw?.start_at || event.start)}
              </div>
              <div className="text-gray-500">
                {formatTime(event.raw?.start_at || event.start)} -{" "}
                {formatTime(event.raw?.end_at || event.end)}
              </div>
            </div>
          </div>

          {/* Paciente */}
          {event.raw?.patient && (
            <div className="flex items-start space-x-3">
              <User size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 flex-1">
                <div className="font-medium">Paciente</div>
                <div className="text-gray-600">
                  {event.raw.patient.first_name} {event.raw.patient.last_name}
                </div>
                {event.raw.patient.phone && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    📞 {event.raw.patient.phone}
                  </div>
                )}
                {event.raw.patient.email && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    ✉️ {event.raw.patient.email}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Servicio */}
          {event.raw?.service && (
            <div className="flex items-start space-x-3">
              <Briefcase
                size={18}
                className="text-gray-500 mt-0.5 flex-shrink-0"
              />
              <div className="text-sm text-gray-700 flex-1">
                <div className="font-medium">Servicio</div>
                <div className="text-gray-600">{event.raw.service.name}</div>
                {event.raw.service.duration && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    ⏱️ Duración: {event.raw.service.duration} min
                  </div>
                )}
                {event.raw.service.price && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    💰 Precio: ${event.raw.service.price}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profesional */}
          {event.raw?.user && (
            <div className="flex items-start space-x-3">
              <CalendarIcon
                size={18}
                className="text-gray-500 mt-0.5 flex-shrink-0"
              />
              <div className="text-sm text-gray-700">
                <div className="font-medium">Profesional</div>
                <div className="text-gray-600">{event.raw.user.name}</div>
                {event.raw.user.email && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    ✉️ {event.raw.user.email}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comercio */}
          {event.raw?.commerce && (
            <div className="flex items-start space-x-3">
              <Building2
                size={18}
                className="text-gray-500 mt-0.5 flex-shrink-0"
              />
              <div className="text-sm text-gray-700">
                <div className="font-medium">Sucursal</div>
                <div className="text-gray-600">{event.raw.commerce.name}</div>
              </div>
            </div>
          )}

          {/* Descripción */}
          {event.raw?.description && (
            <div className="flex items-start space-x-3 pt-2 border-t border-gray-100">
              <FileText
                size={18}
                className="text-gray-500 mt-0.5 flex-shrink-0"
              />
              <div className="text-sm text-gray-700 flex-1">
                <div className="font-medium mb-1">Descripción</div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.raw.description}
                </p>
              </div>
            </div>
          )}

          {/* Notas */}
          {event.raw?.notes && (
            <div className="flex items-start space-x-3 pt-2 border-t border-gray-100">
              <AlertCircle
                size={18}
                className="text-gray-500 mt-0.5 flex-shrink-0"
              />
              <div className="text-sm text-gray-700 flex-1">
                <div className="font-medium mb-1">Notas</div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.raw.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-around space-x-2 pt-3 border-t border-gray-100">
          {onEdit && (
            <button onClick={handleEdit} className="btn btn-info neumo">
              <Edit2 size={16} />
              <span className="text-sm font-medium">Editar</span>
            </button>
          )}
          {onDelete && (
            <button onClick={handleDelete} className="btn btn-danger neumo">
              <Trash2 size={16} />
              <span className="text-sm font-medium">Eliminar</span>
            </button>
          )}
          <Link className="btn" to={`/appointments/${event.id}`}>
            <FaEye />
            <span className="text-sm font-medium">Ver Cita</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DetailPopup;
