import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { PatientType } from "../../types";

/**
 * RenderObject imprime objetos JSON en forma de lista. Funciona para "Otros Datos"
 */
const RenderObject: React.FC<{ obj: Record<string, any>; level?: number }> = ({
  obj,
  level = 0,
}) => (
  <div style={{ marginLeft: level * 16 }} className="space-y-1">
    {Object.entries(obj).map(([key, value]) => (
      <div key={key}>
        {value && typeof value === "object" && !Array.isArray(value) ? (
          <div className="mt-2">
            <div className="font-semibold mb-1 capitalize">
              {key.replace(/_/g, " ")}:
            </div>
            <RenderObject obj={value} level={level + 1} />
          </div>
        ) : (
          <div className="flex">
            <div className="font-semibold capitalize mr-2">
              {key.replace(/_/g, " ")}:
            </div>
            <div className="text-gray-800">{String(value ?? "")}</div>
          </div>
        )}
      </div>
    ))}
  </div>
);

const ShowPatient = () => {
  const { patientId } = useParams({ from: "/patients/$patientId" });
  const token = useAuthStore((state) => state.token);

  const [patient, setPatient] = useState<PatientType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchPatient = async () => {
      setIsLoading(true);
      try {
        const response = await Api.showPatient({
          _token: token,
          patient_id: Number(patientId),
        });

        if (!isMounted) return;
        setPatient(response as PatientType);
        setError(null);
      } catch (err) {
        console.error("Error cargando el paciente", err);
        if (!isMounted) return;
        setError("No pudimos cargar el paciente");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPatient();

    return () => {
      isMounted = false;
    };
  }, [patientId, token]);

  if (isLoading) {
    return <div className="card neumo p-6">Cargando paciente...</div>;
  }

  if (error || !patient) {
    return (
      <div className="card neumo p-6">
        {error ?? "Paciente no encontrado"}
      </div>
    );
  }

  return (
    <div className="card neumo">
      <div className="card-header">
        <h2 className="text-lg font-semibold">Detalle de paciente</h2>
        <p className="text-sm text-gray-500">ID: {patient.id}</p>
      </div>

      <div className="card-body grid gap-3 md:grid-cols-2">
        <div>
          <span className="font-semibold">Nombre:</span>{" "}
          {patient.first_name} {patient.last_name}
        </div>
        <div>
          <span className="font-semibold">Correo:</span>{" "}
          {patient.email ?? "Sin correo"}
        </div>
        <div>
          <span className="font-semibold">Teléfono:</span>{" "}
          {patient.phone ?? "Sin teléfono"}
        </div>
        <div>
          <span className="font-semibold">Fecha de nacimiento:</span>{" "}
          {patient.birth_date
            ? new Date(patient.birth_date).toLocaleDateString("es-MX", {
                dateStyle: "medium",
              })
            : "Sin fecha"}
        </div>
        <div>
          <span className="font-semibold">Género:</span>{" "}
          {patient.gender ?? "Sin especificar"}
        </div>
        <div>
          <span className="font-semibold">Comercio asociado:</span>{" "}
          {patient.commerce_id ?? "No asociado"}
        </div>
        <div>
          <span className="font-semibold">Registrado:</span>{" "}
          {patient.created_at
            ? new Date(patient.created_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div>
        <div>
          <span className="font-semibold">Última actualización:</span>{" "}
          {patient.updated_at
            ? new Date(patient.updated_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div>

        {/* Otros datos bien formateados */}
        <div className="md:col-span-2 mt-4">
          <span className="font-semibold text-gray-800 block mb-3 text-lg">
            Otros datos:
          </span>
          {patient.data && Object.keys(patient.data).length > 0 ? (
            <RenderObject obj={patient.data} />
          ) : (
            <p className="text-gray-600">Sin datos adicionales</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowPatient;
