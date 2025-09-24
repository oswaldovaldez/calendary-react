import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { userSchema, userSchemaEdit } from "../../schemas/userSchema";
import FormRender from "../../components/FormRender";

import { CiCirclePlus, CiTrash } from "react-icons/ci";
import {
  FaChevronDown,
  FaChevronRight,
  FaListUl,
  FaRegFileAlt,
  FaFont,
  FaListOl,
  FaCheckSquare,
  FaDotCircle,
  FaCalendarAlt,
  FaClock,
  FaCalendarWeek,
  FaPhone,
  FaHashtag,
  FaKey,
  FaLink,
  FaPalette,
  FaEnvelope,
  FaSlidersH,
  FaCalendarDay,
} from "react-icons/fa";
import { useAuthStore } from "../../store/auth.store";
import { FaFolderOpen } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
const FormTemplate = ({ initialValues, isEdit = false, onSubmit }) => {
  const commercesStore = useAuthStore((s) => s.commerces);
  // const roleUser = useAuthStore((s) => s.user.roles[0]);
  const [fields, setFields] = useState(initialValues.fields ?? []);
  const [values, setValues] = useState(initialValues ?? null);
  const [expandedField, setExpandedField] = useState(null);
  const [expandedSubField, setExpandedSubField] = useState(null);

  // useEffect()

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
    {
      value: "group",
      label: "Grupo de campos",
      icon: <FcSettings size={16} />,
    },
  ];

  const createNewField = (type = "text") => {
    const baseField = {
      id: Date.now() + Math.random(),
      label: "",
      name: "",
      type: type,
      required: false,
    };

    // Agregar propiedades específicas según el tipo
    switch (type) {
      case "select":
      case "multiselect":
      case "radio":
        return { ...baseField, options: {} };
      case "group":
        return { ...baseField, fields: [] };
      case "number":
      case "range":
        return { ...baseField, min: "", max: "", step: "" };
      case "textarea":
        return { ...baseField, rows: 3, maxLength: "" };
      case "text":
      case "email":
      case "password":
      case "url":
      case "tel":
        return { ...baseField, maxLength: "", placeholder: "" };
      case "file":
        return { ...baseField, multiple: false, accept: "" };
      case "color":
        return { ...baseField, defaultValue: "#000000" };
      default:
        return baseField;
    }
  };

  const addField = () => {
    const newField = createNewField();
    setFields([...fields, newField]);
    setExpandedField(newField.id);
  };

  const addFieldToGroup = (groupId) => {
    const newSubFieldId = Date.now() + Math.random();
    setFields(
      fields.map((field) => {
        if (field.id === groupId) {
          const newSubField = createNewField();
          newSubField.id = newSubFieldId;
          return {
            ...field,
            fields: [...field.fields, newSubField],
          };
        }
        return field;
      })
    );
    // Auto-expandir el nuevo subcampo para configuración
    setTimeout(() => {
      setExpandedField(newSubFieldId);
    }, 100);
  };

  const removeField = (fieldId, groupId = null) => {
    if (groupId) {
      // Remover subcampo de un grupo
      setFields(
        fields.map((field) => {
          if (field.id === groupId) {
            return {
              ...field,
              fields: field.fields.filter(
                (subField) => subField.id !== fieldId
              ),
            };
          }
          return field;
        })
      );
    } else {
      // Remover campo principal
      setFields(fields.filter((field) => field.id !== fieldId));
    }
  };

  const updateField = (fieldId, property, value, groupId = null) => {
    if (groupId) {
      // Actualizar subcampo
      setFields(
        fields.map((field) => {
          if (field.id === groupId) {
            return {
              ...field,
              fields: field.fields.map((subField) =>
                subField.id === fieldId
                  ? { ...subField, [property]: value }
                  : subField
              ),
            };
          }
          return field;
        })
      );
    } else {
      // Actualizar campo principal
      setFields(
        fields.map((field) =>
          field.id === fieldId ? { ...field, [property]: value } : field
        )
      );
    }
  };

  const changeFieldType = (fieldId, newType, groupId = null) => {
    const newField = createNewField(newType);
    if (groupId) {
      setFields(
        fields.map((field) => {
          if (field.id === groupId) {
            return {
              ...field,
              fields: field.fields.map((subField) =>
                subField.id === fieldId
                  ? {
                      ...newField,
                      id: fieldId,
                      label: subField.label,
                      name: subField.name,
                    }
                  : subField
              ),
            };
          }
          return field;
        })
      );
    } else {
      setFields(
        fields.map((field) =>
          field.id === fieldId
            ? { ...newField, id: fieldId, label: field.label, name: field.name }
            : field
        )
      );
    }
  };

  const addOption = (fieldId, groupId = null) => {
    const optionKey = `option_${Date.now()}`;
    if (groupId) {
      setFields(
        fields.map((field) => {
          if (field.id === groupId) {
            return {
              ...field,
              fields: field.fields.map((subField) =>
                subField.id === fieldId
                  ? {
                      ...subField,
                      options: { ...subField.options, [optionKey]: "" },
                    }
                  : subField
              ),
            };
          }
          return field;
        })
      );
    } else {
      setFields(
        fields.map((field) =>
          field.id === fieldId
            ? { ...field, options: { ...field.options, [optionKey]: "" } }
            : field
        )
      );
    }
  };

  const updateOption = (fieldId, optionKey, newValue, groupId = null) => {
    if (groupId) {
      setFields(
        fields.map((field) => {
          if (field.id === groupId) {
            return {
              ...field,
              fields: field.fields.map((subField) =>
                subField.id === fieldId
                  ? {
                      ...subField,
                      options: { ...subField.options, [optionKey]: newValue },
                    }
                  : subField
              ),
            };
          }
          return field;
        })
      );
    } else {
      setFields(
        fields.map((field) =>
          field.id === fieldId
            ? { ...field, options: { ...field.options, [optionKey]: newValue } }
            : field
        )
      );
    }
  };

  const removeOption = (fieldId, optionKey, groupId = null) => {
    if (groupId) {
      setFields(
        fields.map((field) => {
          if (field.id === groupId) {
            return {
              ...field,
              fields: field.fields.map((subField) => {
                if (subField.id === fieldId) {
                  const { [optionKey]: removed, ...restOptions } =
                    subField.options;
                  return { ...subField, options: restOptions };
                }
                return subField;
              }),
            };
          }
          return field;
        })
      );
    } else {
      setFields(
        fields.map((field) => {
          if (field.id === fieldId) {
            const { [optionKey]: removed, ...restOptions } = field.options;
            return { ...field, options: restOptions };
          }
          return field;
        })
      );
    }
  };

  const renderFieldEditor = (
    field,
    groupId = null,
    depth = 0,
    isSub = false
  ) => {
    // const isExpanded = true;
    const isExpanded = isSub
      ? expandedSubField === field.id
      : expandedField === field.id;
    const hasOptions = ["select", "multiselect", "radio"].includes(field.type);

    // Filtrar tipos de campo para subcampos (sin group)
    const availableTypes =
      depth > 0
        ? fieldTypes.filter((type) => type.value !== "group")
        : fieldTypes;

    return (
      <div key={field.id} className={`card neumo`}>
        {/* Header del campo */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                isSub
                  ? setExpandedSubField(isExpanded ? null : field.id)
                  : setExpandedField(isExpanded ? null : field.id)
              }
              className="btn neumo"
            >
              {isExpanded ? (
                <FaChevronDown size={16} />
              ) : (
                <FaChevronRight size={16} />
              )}
            </button>
            <span className="font-medium">
              {field.label || "Campo sin título"} ({field.type})
            </span>
            {field.required && <span className="text-red-500 text-sm">*</span>}
          </div>
          <button
            onClick={() => removeField(field.id, groupId)}
            className="btn btn-danger neumo"
          >
            <CiTrash size={16} />
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* Configuración básica */}
            <div className="grid grid-cols-md-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    updateField(field.id, "label", e.target.value, groupId)
                  }
                  className="input input-sm "
                  placeholder="Ej: Nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre (name)
                </label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) =>
                    updateField(field.id, "name", e.target.value, groupId)
                  }
                  className="input input-sm "
                  placeholder="Ej: full_name"
                />
              </div>
            </div>

            <div className="grid grid-cols-md-2 gap-4">
              <div className="form-control">
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    changeFieldType(field.id, e.target.value, groupId)
                  }
                  className="input input-sm "
                >
                  {availableTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-check">
                <label className="form-label">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(
                        field.id,
                        "required",
                        e.target.checked,
                        groupId
                      )
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Requerido</span>
                </label>
              </div>
            </div>

            {/* Configuraciones específicas por tipo */}
            {field.type === "textarea" && (
              <div className="grid grid-cols-md-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Filas
                  </label>
                  <input
                    type="number"
                    value={field.rows || ""}
                    onChange={(e) =>
                      updateField(
                        field.id,
                        "rows",
                        parseInt(e.target.value) || 3,
                        groupId
                      )
                    }
                    className="input input-sm "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Máx. caracteres
                  </label>
                  <input
                    type="number"
                    value={field.maxLength || ""}
                    onChange={(e) =>
                      updateField(
                        field.id,
                        "maxLength",
                        e.target.value,
                        groupId
                      )
                    }
                    className="input input-sm "
                  />
                </div>
              </div>
            )}

            {field.type === "number" ||
              (field.type === "range" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mínimo
                    </label>
                    <input
                      type="number"
                      value={field.min || ""}
                      onChange={(e) =>
                        updateField(field.id, "min", e.target.value, groupId)
                      }
                      className="input input-sm "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Máximo
                    </label>
                    <input
                      type="number"
                      value={field.max || ""}
                      onChange={(e) =>
                        updateField(field.id, "max", e.target.value, groupId)
                      }
                      className="input input-sm "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Intervalo
                    </label>
                    <input
                      type="number"
                      value={field.step || ""}
                      defaultValue="1"
                      onChange={(e) =>
                        updateField(field.id, "step", e.target.value, groupId)
                      }
                      className="input input-sm "
                    />
                  </div>
                </div>
              ))}

            {["text", "email"].includes(field.type) && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    updateField(
                      field.id,
                      "placeholder",
                      e.target.value,
                      groupId
                    )
                  }
                  className="input input-sm "
                />
              </div>
            )}

            {/* Editor de opciones para select, multiselect, radio */}
            {hasOptions && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Opciones</label>
                  <button
                    onClick={() => addOption(field.id, groupId)}
                    className="btn btn-success neumo"
                  >
                    <CiCirclePlus size={14} />
                    <span>Agregar opción</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(field.options || {}).map(([key, value]) => (
                    <div key={key} className="flex space-x-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newOptions = { ...field.options };
                          delete newOptions[key];
                          newOptions[e.target.value] = value;
                          updateField(field.id, "options", newOptions, groupId);
                        }}
                        className="input input-sm "
                        placeholder="Clave (ej: op1)"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          updateOption(field.id, key, e.target.value, groupId)
                        }
                        className="input input-sm "
                        placeholder="Texto visible (ej: Opción 1)"
                      />
                      <button
                        onClick={() => removeOption(field.id, key, groupId)}
                        className="btn btn-danger neumo"
                      >
                        <CiTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subcampos para grupos */}
            {field.type === "group" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Campos del grupo
                  </label>
                  <button
                    onClick={() => addFieldToGroup(field.id)}
                    className="btn btn-info neumo"
                  >
                    <CiCirclePlus size={14} />
                    <span>Agregar campo</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {field.fields?.map((subField) =>
                    renderFieldEditor(subField, field.id, depth + 1, true)
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const exportFields = () => {
    const cleanFields = fields.map((field) => {
      const cleanField = { ...field };
      // delete cleanField.id;

      if (cleanField.fields) {
        cleanField.fields = cleanField.fields.map((subField) => {
          const cleanSubField = { ...subField };
          // delete cleanSubField.id;
          return cleanSubField;
        });
      }

      return cleanField;
    });

    return JSON.stringify(cleanFields, null, 2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="mb-6 card neumo">
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              defaultValue={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="form-control form-control-sm"
            />
          </div>
          <input type="hidden" defaultValue={values.commerce_id} />
        </div>
      </div>

      {/* Botón para agregar campo */}
      <div className="mb-6 w-full flex flex-row-reverse">
        <button onClick={addField} className="btn btn-info neumo">
          <CiCirclePlus size={20} />
          <span>Agregar Campo</span>
        </button>
      </div>

      {/* Lista de campos */}
      <div className="space-y-4 mb-8">
        {fields.map((field) => renderFieldEditor(field))}
      </div>

      {/* Preview del array generado */}
      <div className="rounded-lg p-6 shadow">
        <h2 className="text-lg font-medium mb-4">Array de Fields Generado:</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto max-h-96">
          <pre>{exportFields()}</pre>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(exportFields())}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Copiar al portapapeles
        </button>
      </div>
    </div>
  );
};

export default FormTemplate;
