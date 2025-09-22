"use client";

import React, { useState } from "react";
// import { Plus, Trash2, Settings } from "lucide-react";
import { CiSettings, CiCirclePlus, CiTrash } from "react-icons/ci";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

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

const FieldBuilder = () => {
  const [fields, setFields] = useState([]);

  const addField = (groupId = null) => {
    const newField = {
      id: Date.now(),
      type: "text",
      label: "Nuevo campo",
      placeholder: "",
      required: false,
      options: [],
      fields: [],
    };
    if (groupId) {
      setFields((prev) =>
        prev.map((f) =>
          f.id === groupId ? { ...f, fields: [...f.fields, newField] } : f
        )
      );
    } else {
      setFields((prev) => [...prev, newField]);
    }
  };

  const removeField = (id, groupId = null) => {
    if (groupId) {
      setFields((prev) =>
        prev.map((f) =>
          f.id === groupId
            ? { ...f, fields: f.fields.filter((sf) => sf.id !== id) }
            : f
        )
      );
    } else {
      setFields((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const updateField = (id, key, value, groupId = null) => {
    const update = (field) =>
      field.id === id ? { ...field, [key]: value } : field;
    if (groupId) {
      setFields((prev) =>
        prev.map((f) =>
          f.id === groupId ? { ...f, fields: f.fields.map(update) } : f
        )
      );
    } else {
      setFields((prev) => prev.map(update));
    }
  };

  const changeFieldType = (id, type, groupId = null) => {
    const selectedType = fieldTypes.find((ft) => ft.value === type);
    updateField(id, "type", type, groupId);
    if (
      selectedType?.value === "select" ||
      selectedType?.value === "multiselect" ||
      selectedType?.value === "radio"
    ) {
      updateField(id, "options", ["Opción 1", "Opción 2"], groupId);
    }
  };

  const renderFieldEditor = (field, groupId = null, depth = 0) => {
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
          >
            <CiTrash size={16} />
          </button>
        </div>

        {/* Selector de tipo */}
        <select
          value={field.type}
          onChange={(e) => changeFieldType(field.id, e.target.value, groupId)}
          className="w-full px-3 py-2 border rounded-md mb-2"
        >
          {availableTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Configuración común */}
        <input
          type="text"
          placeholder="Etiqueta"
          value={field.label}
          onChange={(e) =>
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
              value={field.placeholder || ""}
              onChange={(e) =>
                updateField(field.id, "placeholder", e.target.value, groupId)
              }
              className="w-full px-3 py-2 border rounded-md mb-2"
            />
          )}

        {/* Configuración especial por tipo */}
        {field.type === "number" && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/3 px-2 py-1 border rounded-md"
              onChange={(e) =>
                updateField(field.id, "min", e.target.value, groupId)
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/3 px-2 py-1 border rounded-md"
              onChange={(e) =>
                updateField(field.id, "max", e.target.value, groupId)
              }
            />
            <input
              type="number"
              placeholder="Step"
              className="w-1/3 px-2 py-1 border rounded-md"
              onChange={(e) =>
                updateField(field.id, "step", e.target.value, groupId)
              }
            />
          </div>
        )}

        {field.type === "range" && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/3 px-2 py-1 border rounded-md"
              onChange={(e) =>
                updateField(field.id, "min", e.target.value, groupId)
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/3 px-2 py-1 border rounded-md"
              onChange={(e) =>
                updateField(field.id, "max", e.target.value, groupId)
              }
            />
            <input
              type="number"
              placeholder="Step"
              className="w-1/3 px-2 py-1 border rounded-md"
              onChange={(e) =>
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
            {field.options?.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...field.options];
                  newOpts[idx] = e.target.value;
                  updateField(field.id, "options", newOpts, groupId);
                }}
                className="w-full px-3 py-2 border rounded-md mb-1"
              />
            ))}
            <button
              onClick={() =>
                updateField(
                  field.id,
                  "options",
                  [...(field.options || []), "Nueva opción"],
                  groupId
                )
              }
              className="text-blue-600 hover:underline text-sm"
            >
              + Agregar opción
            </button>
          </div>
        )}

        {/* Grupo */}
        {field.type === "group" && (
          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Campos en este grupo</span>
              <button
                onClick={() => addField(field.id)}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                <CiCirclePlus size={14} />
                <span>Agregar campo</span>
              </button>
            </div>
            <div className="space-y-4">
              {field.fields.map((subField) =>
                renderFieldEditor(subField, field.id, depth + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPreviewField = (field) => {
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
          ></textarea>
        );
      case "select":
        return (
          <select className="w-full px-3 py-2 border rounded-md">
            {field.options?.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <select multiple className="w-full px-3 py-2 border rounded-md">
            {field.options?.map((opt, i) => (
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
            {field.options?.map((opt, i) => (
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
            {field.fields.map((sub) => (
              <div key={sub.id}>{renderPreviewField(sub)}</div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Constructor de campos</h2>
        <button
          onClick={addField}
          className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <CiCirclePlus size={16} />
          <span>Agregar campo</span>
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field) => renderFieldEditor(field))}
      </div>

      {/* Vista previa */}
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
