"use client";

import { useCallback, useState } from "react";
import { CiSettings, CiCirclePlus, CiTrash } from "react-icons/ci";
import {
  FaRegFileAlt,
  FaPalette,
  FaKey,
  FaLink,
  FaSlidersH,
  FaClock,
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaListUl,
  FaListOl,
  FaCheckSquare,
  FaDotCircle,
  FaHashtag,
  FaFont,
  FaEnvelope,
  FaPhone,
  FaFolderOpen,
} from "react-icons/fa";

type FieldBase = {
  id: number;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  // allow extra dynamic props like min/max/rows/options/fields
  [key: string]: any;
};

type SelectField = FieldBase & {
  type: "select" | "multiselect" | "radio";
  options: string[];
};

type GroupField = FieldBase & {
  type: "group";
  fields: Field[];
};

type NumberField = FieldBase & {
  type: "number" | "range";
  min?: string;
  max?: string;
  step?: string;
};

type TextField = FieldBase & {
  type: "textarea" | "text" | "email" | "password" | "url" | "tel";
  maxLength?: string;
  rows?: number;
};

type FileField = FieldBase & {
  type: "file";
  multiple?: boolean;
  accept?: string;
};

type ColorField = FieldBase & {
  type: "color";
  defaultValue?: string;
};

type Field =
  | FieldBase
  | SelectField
  | GroupField
  | NumberField
  | TextField
  | FileField
  | ColorField;

const fieldTypes = [
  { value: "text", label: "Texto", icon: <FaFont /> },
  { value: "textarea", label: "Área de texto", icon: <FaRegFileAlt /> },
  { value: "select", label: "Selección", icon: <FaListUl /> },
  { value: "multiselect", label: "Selección múltiple", icon: <FaListOl /> },
  { value: "checkbox", label: "Casilla", icon: <FaCheckSquare /> },
  { value: "radio", label: "Radio", icon: <FaDotCircle /> },
  { value: "date", label: "Fecha", icon: <FaCalendarAlt /> },
  { value: "time", label: "Hora", icon: <FaClock /> },
  { value: "datetime-local", label: "Fecha y hora", icon: <FaCalendarDay /> },
  { value: "month", label: "Mes", icon: <FaCalendarAlt /> },
  { value: "week", label: "Semana", icon: <FaCalendarWeek /> },
  { value: "tel", label: "Teléfono", icon: <FaPhone /> },
  { value: "email", label: "Email", icon: <FaEnvelope /> },
  { value: "number", label: "Número", icon: <FaHashtag /> },
  { value: "password", label: "Contraseña", icon: <FaKey /> },
  { value: "url", label: "URL", icon: <FaLink /> },
  { value: "color", label: "Color", icon: <FaPalette /> },
  { value: "file", label: "Archivo", icon: <FaFolderOpen /> },
  { value: "range", label: "Rango", icon: <FaSlidersH /> },
  { value: "group", label: "Grupo de campos", icon: <CiSettings size={16} /> },
];

const createNewField = (type = "text"): Field => {
  const base: FieldBase = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    type,
    label: "Nuevo campo",
    placeholder: "",
    required: false,
  };

  switch (type) {
    case "select":
    case "multiselect":
    case "radio":
      return { ...base, options: ["Opción 1", "Opción 2"] } as SelectField;
    case "group":
      return { ...base, fields: [] } as GroupField;
    case "number":
    case "range":
      return { ...base, min: "", max: "", step: "" } as NumberField;
    case "textarea":
      return { ...base, rows: 3, maxLength: "" } as TextField;
    case "file":
      return { ...base, multiple: false, accept: "" } as FileField;
    case "color":
      return { ...base, defaultValue: "#000000" } as ColorField;
    default:
      return base;
  }
};

const FieldBuilder: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);

  const addField = useCallback((groupId: number | null = null) => {
    const newField = createNewField("text");
    setFields((prev) =>
      groupId
        ? prev.map((f) =>
            f.id === groupId && f.type === "group"
              ? {
                  ...(f as GroupField),
                  fields: [...((f as GroupField).fields || []), newField],
                }
              : f
          )
        : [...prev, newField]
    );
  }, []);

  const removeField = useCallback(
    (id: number, groupId: number | null = null) => {
      setFields((prev) =>
        groupId
          ? prev.map((f) =>
              f.id === groupId && f.type === "group"
                ? {
                    ...(f as GroupField),
                    fields: (f as GroupField).fields!.filter(
                      (sf) => sf.id !== id
                    ),
                  }
                : f
            )
          : prev.filter((f) => f.id !== id)
      );
    },
    []
  );

  const updateField = useCallback(
    (id: number, key: string, value: any, groupId: number | null = null) => {
      const updater = (field: Field) =>
        field.id === id ? { ...field, [key]: value } : field;
      setFields((prev) =>
        groupId
          ? prev.map((f) =>
              f.id === groupId && f.type === "group"
                ? {
                    ...(f as GroupField),
                    fields: (f as GroupField).fields!.map(updater),
                  }
                : f
            )
          : prev.map(updater)
      );
    },
    []
  );

  const changeFieldType = useCallback(
    (id: number, type: string, groupId: number | null = null) => {
      const newFieldTemplate = createNewField(type);
      setFields((prev) =>
        groupId
          ? prev.map((f) =>
              f.id === groupId && f.type === "group"
                ? {
                    ...(f as GroupField),
                    fields: (f as GroupField).fields!.map((sf) =>
                      sf.id === id
                        ? {
                            ...newFieldTemplate,
                            id: sf.id,
                            label: sf.label,
                            placeholder: sf.placeholder,
                          }
                        : sf
                    ),
                  }
                : f
            )
          : prev.map((f) =>
              f.id === id
                ? {
                    ...newFieldTemplate,
                    id: f.id,
                    label: f.label,
                    placeholder: f.placeholder,
                  }
                : f
            )
      );
    },
    []
  );

  const addOption = useCallback((id: number, groupId: number | null = null) => {
    const key = `Opción ${Date.now() % 10000}`;
    setFields((prev) =>
      prev.map((f) => {
        if (groupId && f.id === groupId && f.type === "group") {
          return {
            ...(f as GroupField),
            fields: (f as GroupField).fields!.map((sf) =>
              sf.id === id
                ? { ...sf, options: [...(sf.options || []), key] }
                : sf
            ),
          } as GroupField;
        }
        if (!groupId && f.id === id) {
          return { ...f, options: [...(f.options || []), key] };
        }
        return f;
      })
    );
  }, []);

  const renderFieldEditor = useCallback(
    (field: Field, groupId: number | null = null, depth = 0) => {
      const availableTypes = fieldTypes;
      return (
        <div
          key={field.id}
          className={`p-4 border rounded-lg ${depth > 0 ? "ml-6" : ""}`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold flex items-center gap-2">
              {availableTypes.find((ft) => ft.value === field.type)?.icon}
              {field.label}
            </h3>
            <button
              onClick={() => removeField(field.id, groupId)}
              className="text-red-500 hover:text-red-700"
              type="button"
            >
              <CiTrash size={16} />
            </button>
          </div>

          <select
            value={field.type}
            onChange={(e: any) =>
              changeFieldType(field.id, e.target.value, groupId)
            }
            className="w-full px-3 py-2 border rounded-md mb-2"
          >
            {availableTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Etiqueta"
            value={field.label}
            onChange={(e: any) =>
              updateField(field.id, "label", e.target.value, groupId)
            }
            className="w-full px-3 py-2 border rounded-md mb-2"
          />

          {field.type !== "checkbox" &&
            field.type !== "radio" &&
            field.type !== "group" && (
              <input
                type="text"
                placeholder="Placeholder"
                value={field.placeholder ?? ""}
                onChange={(e: any) =>
                  updateField(field.id, "placeholder", e.target.value, groupId)
                }
                className="w-full px-3 py-2 border rounded-md mb-2"
              />
            )}

          {(field.type === "number" || field.type === "range") && (
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-1/3 px-2 py-1 border rounded-md"
                onChange={(e: any) =>
                  updateField(field.id, "min", e.target.value, groupId)
                }
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/3 px-2 py-1 border rounded-md"
                onChange={(e: any) =>
                  updateField(field.id, "max", e.target.value, groupId)
                }
              />
              <input
                type="number"
                placeholder="Step"
                className="w-1/3 px-2 py-1 border rounded-md"
                onChange={(e: any) =>
                  updateField(field.id, "step", e.target.value, groupId)
                }
              />
            </div>
          )}

          {(field.type === "select" ||
            field.type === "multiselect" ||
            field.type === "radio") && (
            <div>
              <p className="font-medium">Opciones:</p>
              {(field.options || []).map((opt: string, idx: number) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e: any) => {
                    const newOpts = [...(field.options || [])];
                    newOpts[idx] = e.target.value;
                    updateField(field.id, "options", newOpts, groupId);
                  }}
                  className="w-full px-3 py-2 border rounded-md mb-1"
                />
              ))}
              <button
                onClick={() => addOption(field.id, groupId)}
                className="text-blue-600 hover:underline text-sm"
                type="button"
              >
                + Agregar opción
              </button>
            </div>
          )}

          {field.type === "group" && (
            <div className="mt-4 border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Campos en este grupo</span>
                <button
                  onClick={() => addField(field.id)}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  type="button"
                >
                  <CiCirclePlus size={14} />
                  <span>Agregar campo</span>
                </button>
              </div>
              <div className="space-y-4">
                {(field as GroupField).fields?.map((sub) =>
                  renderFieldEditor(sub, field.id, depth + 1)
                )}
              </div>
            </div>
          )}
        </div>
      );
    },
    [addField, changeFieldType, removeField, updateField, addOption]
  );

  const renderPreviewField = useCallback((field: Field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "password":
      case "url":
      case "tel":
      case "date":
      case "time":
      case "datetime-local":
      case "month":
      case "week":
      case "color":
      case "file":
      case "range":
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      case "select":
        return (
          <select className="w-full px-3 py-2 border rounded-md">
            {(field.options || []).map((opt: string, i: number) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <select multiple className="w-full px-3 py-2 border rounded-md">
            {(field.options || []).map((opt: string, i: number) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2">
            <input type="checkbox" /> {field.label}
          </label>
        );
      case "radio":
        return (
          <div className="space-y-1">
            {(field.options || []).map((opt: string, i: number) => (
              <label key={i} className="flex items-center gap-2">
                <input type="radio" name={`radio-${field.id}`} /> {opt}
              </label>
            ))}
          </div>
        );
      case "group":
        return (
          <div className="p-3 border rounded-md space-y-2">
            <p className="font-medium">{field.label}</p>
            {(field as GroupField).fields?.map((sub) => (
              <div key={sub.id}>{renderPreviewField(sub)}</div>
            ))}
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Constructor de campos</h2>
        <button
          onClick={() => addField(null)}
          className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="button"
        >
          <CiCirclePlus size={16} />
          <span>Agregar campo</span>
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field) => renderFieldEditor(field))}
      </div>

      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-md font-semibold mb-4">
          Vista previa del formulario
        </h3>
        <form className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1">
              {field.type !== "checkbox" && field.type !== "radio" && (
                <label className="block text-sm font-medium">
                  {field.label}
                </label>
              )}
              {renderPreviewField(field)}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default FieldBuilder;
