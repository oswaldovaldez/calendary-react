import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { PatientType } from "../../types";
import Modal from "../../components/Modal";
import { useNotificationStore } from "../../store/notification.store";

/**
 * RenderObject imprime objetos JSON en forma de lista. Funciona para "Detalles"
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
  const [isMounted, setIsMounted] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [saldo, setSaldo] = useState({ amount: 1, description: "-" });
  const notify = useNotificationStore((state) => state.notify);
  const handleAddCash = () => {
    Api.deposit({
      patient_id: Number(patientId),
      _token: `${token}`,
      amount: saldo.amount,
      description: saldo.description,
    })
      .then((res: any) => {
        setOpenModal(false);
        setPatient(res.data);
        notify("success", res.message);
      })
      .catch((err) => {
        console.error("Error al agregar saldo:", err);
      });
  };
  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    const fetchPatient = async () => {
      setIsLoading(true);
      try {
        const response = await Api.showPatient({
          _token: `${token}`,
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
      setIsMounted(false);
    };
  }, [patientId, token]);

  if (isLoading) {
    return <div className="card neumo p-6">Cargando paciente...</div>;
  }

  if (error || !patient) {
    return (
      <div className="card neumo p-6">{error ?? "Paciente no encontrado"}</div>
    );
  }

  return (
    <>
      <Modal
        title="Aumentar Saldo"
        isOpen={openModal}
        onClosex={() => setOpenModal(false)}
      >
        <div className="card">
          <div className="card-body">
            <div>
              <div className="form-group pb-4">
                <label className="form-label font-semibold pb-2">
                  Cantidad a agregar
                </label>
                <input
                  type="number"
                  min={1}
                  value={saldo.amount}
                  onChange={(e) =>
                    setSaldo({ ...saldo, amount: Number(e.target.value) })
                  }
                  className="input input-sm"
                  placeholder="Cantidad en $"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddCash}
                  className="btn btn-sm btn-primary"
                >
                  Agregar Saldo
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div className="card neumo">
        <div className="card-header">
          <div className="grid grid-cols-2 gap-3">
            <h2 className="text-lg font-semibold">Información de paciente</h2>
            <div className="flex jus">
              <span>
                Saldo: ${Number(patient.wallet.balance??0).toLocaleString("en-US")}
              </span>
              <button
                className=" ml-2 btn btn-sm btn-info"
                onClick={() => setOpenModal(true)}
              >
                Aumentar
              </button>
            </div>
          </div>
          {/* <p className="text-sm text-gray-500">ID: {patient.id}</p> */}
        </div>

        <div className="card-body grid gap-3 grid-cols-1 md:grid-cols-2">
          <div>
            <span className="font-semibold">Nombre:</span> {patient.first_name}{" "}
            {patient.last_name}
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
          {/* <div>
            <span className="font-semibold">Comercio asociado:</span>{" "}
            {patient.commerce_id ?? "No asociado"}
          </div> */}
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

          {/* Detalles bien formateados */}
          <div className="md:col-span-2 mt-4">
            <span className="font-semibold text-gray-800 block mb-3 text-lg">
              Detalles:
            </span>
            {patient.data && Object.keys(patient.data).length > 0 ? (
              <RenderObject obj={patient.data} />
            ) : (
              <p className="text-gray-600">Sin datos adicionales</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowPatient;
