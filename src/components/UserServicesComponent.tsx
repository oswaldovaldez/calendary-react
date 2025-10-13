import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import type { ServiceType } from "../types";

interface UserType {
  services?: ServiceType[];
}

interface UserServicesComponentProps {
  user: UserType;
  services: ServiceType[];
  handleOnSubmit: (selected: number[]) => void;
}

const UserServicesComponent = ({
  user,
  services,
  handleOnSubmit,
}: UserServicesComponentProps) => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // Inicializar con los servicios del usuario
  useEffect(() => {
    const userServiceIds = user?.services?.map((s) => s.id!) || [];
    setSelectedServices(userServiceIds);
  }, [user]);

  // Manejar selección de servicio
  const handleServiceChange = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const isServiceSelected = (serviceId: number) =>
    selectedServices.includes(serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOnSubmit(selectedServices);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card neumo mt-5">
        <div className="card-header">
          <h3>Servicios</h3>
        </div>

        <div className="card-body">
          <div className="form-container">
            <div className="mt-2 columns-2 lg:columns-3">
              {services.map((service, index) => (
                <div className="form-group" key={`service-${index}`}>
                  <label
                    htmlFor={`service-${service.id}`}
                    className="form-label flex gap-2 items-center"
                  >
                    <input
                      className="mr-2"
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={isServiceSelected(service.id!)}
                      onChange={() => handleServiceChange(service.id!)}
                    />
                    <span>{service.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button className="btn neumo btn-success ml-auto" type="submit">
            <FaCheck />
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserServicesComponent;
