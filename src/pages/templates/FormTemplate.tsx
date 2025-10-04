import { useCallback, useMemo, useState, memo } from "react";
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
  FaCalendarDay,
  FaCalendarWeek,
  FaPhone,
  FaHashtag,
  FaKey,
  FaLink,
  FaPalette,
  FaEnvelope,
  FaSlidersH,
  FaFolderOpen,
} from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import { useAuthStore } from "../../store/auth.store";

type FieldBase = {
  id: number;
  label: string;
  name: string;
  type: string;
  required: boolean;
  // additional index signature for dynamic props
  [key: string]: any;
};

type SelectField = FieldBase & {
  type: "select" | "multiselect" | "radio";
  options: Record<string, string>;
};

type GroupField = FieldBase & {
  type: "group";
  fields: Field[];
};

type NumberField = FieldBase & {
  type: "number" | "range";
  min: string;
  max: string;
  step: string;
};

type TextField = FieldBase & {
  type: "textarea" | "text" | "email" | "password" | "url" | "tel";
  maxLength?: string;
  placeholder?: string;
  rows?: number;
};

type FileField = FieldBase & {
  type: "file";
  multiple: boolean;
  accept: string;
};

type ColorField = FieldBase & {
  type: "color";
  defaultValue: string;
};

type Field =
  | FieldBase
  | SelectField
  | GroupField
  | NumberField
  | TextField
  | FileField
  | ColorField;

type FormTemplateProps = {
  initialValues?: any;
  isEdit?: boolean;
  onSubmit: (values: any) => void;
};

const FieldEditor = memo(function FieldEditor({
  field,
  groupId,
  depth,
  isSub,
  expandedField,
  expandedSubField,
  fieldTypes,
  removeField,
  updateField,
  changeFieldType,
  addOption,
  updateOption,
  removeOption,
  addFieldToGroup,
  renderFieldEditor,
  setExpandedField,
  setExpandedSubField,
}: {
  field: Field;
  groupId: number | null;
  depth: number;
  isSub: boolean;
  expandedField: number | null;
  expandedSubField: number | null;
  fieldTypes: { value: string; label: string; icon: React.ReactNode }[];
  removeField: (fieldId: number, groupId?: number | null) => void;
  updateField: (
    fieldId: number,
    prop: string,
    value: any,
    groupId?: number | null
  ) => void;
  changeFieldType: (
    fieldId: number,
    newType: string,
    groupId?: number | null
  ) => void;
  addOption: (fieldId: number, groupId?: number | null) => void;
  updateOption: (
    fieldId: number,
    optionKey: string,
    newValue: string,
    groupId?: number | null
  ) => void;
  removeOption: (
    fieldId: number,
    optionKey: string,
    groupId?: number | null
  ) => void;
  addFieldToGroup: (groupId: number) => void;
  renderFieldEditor: (
    f: Field,
    g?: number | null,
    d?: number,
    s?: boolean
  ) => React.ReactNode;
  setExpandedField: React.Dispatch<React.SetStateAction<number | null>>;
  setExpandedSubField: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const isExpanded = isSub
    ? expandedSubField === field.id
    : expandedField === field.id;
  const hasOptions = ["select", "multiselect", "radio"].includes(field.type);
  const availableTypes =
    depth > 0 ? fieldTypes.filter((t) => t.value !== "group") : fieldTypes;

  return (
    <div key={field.id} className="card neumo">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              isSub
                ? setExpandedSubField(isExpanded ? null : field.id)
                : setExpandedField(isExpanded ? null : field.id)
            }
            className="btn neumo"
            type="button"
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
          type="button"
        >
          <CiTrash size={16} />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-md-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Etiqueta</label>
              <input
                type="text"
                value={field.label}
                onChange={(e: any) =>
                  updateField(field.id, "label", e.target.value, groupId)
                }
                className="input input-sm"
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
                onChange={(e: any) =>
                  updateField(field.id, "name", e.target.value, groupId)
                }
                className="input input-sm"
                placeholder="Ej: full_name"
              />
            </div>
          </div>

          <div className="grid grid-cols-md-2 gap-4">
            <div className="form-control">
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={field.type}
                onChange={(e: any) =>
                  changeFieldType(field.id, e.target.value, groupId)
                }
                className="input input-sm"
              >
                {availableTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-check">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={!!field.required}
                  onChange={(e: any) =>
                    updateField(field.id, "required", e.target.checked, groupId)
                  }
                  className="mr-2"
                />
                <span className="text-sm">Requerido</span>
              </label>
            </div>
          </div>

          {field.type === "textarea" && (
            <div className="grid grid-cols-md-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Filas</label>
                <input
                  type="number"
                  value={(field as TextField).rows ?? 3}
                  onChange={(e: any) =>
                    updateField(
                      field.id,
                      "rows",
                      parseInt(e.target.value || "3", 10),
                      groupId
                    )
                  }
                  className="input input-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Máx. caracteres
                </label>
                <input
                  type="number"
                  value={(field as TextField).maxLength ?? ""}
                  onChange={(e: any) =>
                    updateField(field.id, "maxLength", e.target.value, groupId)
                  }
                  className="input input-sm"
                />
              </div>
            </div>
          )}

          {(field.type === "number" || field.type === "range") && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mínimo</label>
                <input
                  type="number"
                  value={(field as NumberField).min ?? ""}
                  onChange={(e: any) =>
                    updateField(field.id, "min", e.target.value, groupId)
                  }
                  className="input input-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Máximo</label>
                <input
                  type="number"
                  value={(field as NumberField).max ?? ""}
                  onChange={(e: any) =>
                    updateField(field.id, "max", e.target.value, groupId)
                  }
                  className="input input-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Intervalo
                </label>
                <input
                  type="number"
                  value={(field as NumberField).step ?? "1"}
                  onChange={(e: any) =>
                    updateField(field.id, "step", e.target.value, groupId)
                  }
                  className="input input-sm"
                />
              </div>
            </div>
          )}

          {["text", "email", "password", "url", "tel"].includes(field.type) && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={(field as TextField).placeholder ?? ""}
                onChange={(e: any) =>
                  updateField(field.id, "placeholder", e.target.value, groupId)
                }
                className="input input-sm"
              />
            </div>
          )}

          {hasOptions && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Opciones</label>
                <button
                  onClick={() => addOption(field.id, groupId)}
                  className="btn btn-success neumo"
                  type="button"
                >
                  <CiCirclePlus size={14} />
                  <span>Agregar opción</span>
                </button>
              </div>

              <div className="space-y-2">
                {Object.entries(
                  ((field as SelectField).options ?? {}) as Record<
                    string,
                    string
                  >
                ).map(([key, value]) => (
                  <div key={key} className="flex space-x-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e: any) => {
                        const newOptions = {
                          ...((field as SelectField).options ?? {}),
                        };
                        delete newOptions[key];
                        newOptions[e.target.value] = value;
                        updateField(field.id, "options", newOptions, groupId);
                      }}
                      className="input input-sm"
                      placeholder="Clave (ej: op1)"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e: any) =>
                        updateOption(field.id, key, e.target.value, groupId)
                      }
                      className="input input-sm"
                      placeholder="Texto visible (ej: Opción 1)"
                    />
                    <button
                      onClick={() => removeOption(field.id, key, groupId)}
                      className="btn btn-danger neumo"
                      type="button"
                    >
                      <CiTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {field.type === "group" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Campos del grupo
                </label>
                <button
                  onClick={() => addFieldToGroup(field.id)}
                  className="btn btn-info neumo"
                  type="button"
                >
                  <CiCirclePlus size={14} />
                  <span>Agregar campo</span>
                </button>
              </div>

              <div className="space-y-2">
                {(field as GroupField).fields?.map((sub) =>
                  renderFieldEditor(sub, field.id, depth + 1, true)
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// const FormTemplate: React.FC<FormTemplateProps> = ({
//   initialValues = {},
//   isEdit = false,
//   onSubmit: any,
// }) => {
const FormTemplate: React.FC<FormTemplateProps> = ({
  initialValues = {},
  isEdit = false,
  onSubmit,
}) => {
  const commercesStore = useAuthStore((s) => s.commerces);
  // use the store value as fallback so variable is used and linter won't complain
  const commerceFallback =
    Array.isArray(commercesStore) && commercesStore.length
      ? String(commercesStore[0]?.id ?? "")
      : "";
  const [fields, setFields] = useState<Field[]>(initialValues.fields ?? []);
  const [values, setValues] = useState<{ name?: string; commerce_id?: string }>(
    {
      name: initialValues.name ?? "",
      commerce_id: initialValues.commerce_id ?? commerceFallback,
    }
  );
  const [expandedField, setExpandedField] = useState<number | null>(null);
  const [expandedSubField, setExpandedSubField] = useState<number | null>(null);
  const fieldTypes = useMemo(
    () => [
      { value: "text", label: "Texto", icon: <FaFont /> },
      { value: "textarea", label: "Área de texto", icon: <FaRegFileAlt /> },
      { value: "select", label: "Selección", icon: <FaListUl /> },
      { value: "multiselect", label: "Selección múltiple", icon: <FaListOl /> },
      { value: "checkbox", label: "Casilla", icon: <FaCheckSquare /> },
      { value: "radio", label: "Radio", icon: <FaDotCircle /> },
      { value: "date", label: "Fecha", icon: <FaCalendarAlt /> },
      { value: "time", label: "Hora", icon: <FaClock /> },
      {
        value: "datetime-local",
        label: "Fecha y hora",
        icon: <FaCalendarDay />,
      },
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
    ],
    []
  );

  const createNewField = useCallback((type = "text"): Field => {
    const base: FieldBase = {
      id: Date.now() + Math.random(),
      label: "",
      name: "",
      type,
      required: false,
    };

    switch (type) {
      case "select":
      case "multiselect":
      case "radio":
        return { ...base, options: {} } as SelectField;
      case "group":
        return { ...base, fields: [] } as GroupField;
      case "number":
      case "range":
        return { ...base, min: "", max: "", step: "" } as NumberField;
      case "textarea":
        return { ...base, rows: 3, maxLength: "" } as TextField;
      case "text":
      case "email":
      case "password":
      case "url":
      case "tel":
        return { ...base, maxLength: "", placeholder: "" } as TextField;
      case "file":
        return { ...base, multiple: false, accept: "" } as FileField;
      case "color":
        return { ...base, defaultValue: "#000000" } as ColorField;
      default:
        return base;
    }
  }, []);

  const addField = useCallback(() => {
    setFields((prev) => {
      const nf = createNewField();
      setExpandedField(nf.id);
      return [...prev, nf];
    });
  }, [createNewField]);

  const addFieldToGroup = useCallback(
    (groupId: number) => {
      const newSubId = Date.now() + Math.random();
      setFields((prev) =>
        prev.map((f) => {
          if (f.id === groupId && f.type === "group") {
            const nf = createNewField();
            nf.id = newSubId;
            return { ...f, fields: [...(f.fields ?? []), nf] };
          }
          return f;
        })
      );
      // expand new subfield
      setTimeout(() => setExpandedField(newSubId), 100);
    },
    [createNewField]
  );

  const removeField = useCallback(
    (fieldId: number, groupId: number | null = null) => {
      setFields((prev) =>
        prev.map
          ? groupId
            ? prev.map((f) => {
                if (f.id === groupId && f.type === "group") {
                  return {
                    ...f,
                    fields: (f.fields ?? []).filter(
                      (sf: Field) => sf.id !== fieldId
                    ),
                  };
                }
                return f;
              })
            : prev.filter((f) => f.id !== fieldId)
          : prev
      );
    },
    []
  );

  const updateField = useCallback(
    (
      fieldId: number,
      prop: string,
      value: any,
      groupId: number | null = null
    ) => {
      setFields((prev) =>
        groupId
          ? prev.map((f) => {
              if (f.id === groupId && f.type === "group") {
                return {
                  ...f,
                  fields: (f.fields ?? []).map((sf: Field) =>
                    sf.id === fieldId ? { ...sf, [prop]: value } : sf
                  ),
                };
              }
              return f;
            })
          : prev.map((f) => (f.id === fieldId ? { ...f, [prop]: value } : f))
      );
    },
    []
  );

  const changeFieldType = useCallback(
    (fieldId: number, newType: string, groupId: number | null = null) => {
      setFields((prev) =>
        prev.map((f) => {
          if (groupId && f.id === groupId && f.type === "group") {
            return {
              ...f,
              fields: (f.fields ?? []).map((sf: Field) =>
                sf.id === fieldId
                  ? {
                      ...createNewField(newType),
                      id: fieldId,
                      label: sf.label,
                      name: sf.name,
                    }
                  : sf
              ),
            };
          }
          if (!groupId && f.id === fieldId) {
            return {
              ...createNewField(newType),
              id: fieldId,
              label: f.label,
              name: f.name,
            };
          }
          return f;
        })
      );
    },
    [createNewField]
  );

  const addOption = useCallback(
    (fieldId: number, groupId: number | null = null) => {
      const key = `option_${Date.now()}`;
      setFields((prev) =>
        prev.map((f) => {
          if (groupId && f.id === groupId && f.type === "group") {
            return {
              ...f,
              fields: (f.fields ?? []).map((sf: Field) =>
                sf.id === fieldId
                  ? { ...sf, options: { ...(sf.options ?? {}), [key]: "" } }
                  : sf
              ),
            };
          }
          if (!groupId && f.id === fieldId) {
            return { ...f, options: { ...(f.options ?? {}), [key]: "" } };
          }
          return f;
        })
      );
    },
    []
  );

  const updateOption = useCallback(
    (
      fieldId: number,
      optionKey: string,
      newValue: string,
      groupId: number | null = null
    ) => {
      setFields((prev) =>
        prev.map((f) => {
          if (groupId && f.id === groupId && f.type === "group") {
            return {
              ...f,
              fields: (f.fields ?? []).map((sf: Field) =>
                sf.id === fieldId
                  ? {
                      ...sf,
                      options: { ...(sf.options ?? {}), [optionKey]: newValue },
                    }
                  : sf
              ),
            };
          }
          if (!groupId && f.id === fieldId) {
            return {
              ...f,
              options: { ...(f.options ?? {}), [optionKey]: newValue },
            };
          }
          return f;
        })
      );
    },
    []
  );

  const removeOption = useCallback(
    (fieldId: number, optionKey: string, groupId: number | null = null) => {
      setFields((prev) =>
        prev.map((f) => {
          if (groupId && f.id === groupId && f.type === "group") {
            return {
              ...f,
              fields: (f.fields ?? []).map((sf: Field) => {
                if (sf.id === fieldId) {
                  const { [optionKey]: _rem, ...rest } = sf.options ?? {};
                  return { ...sf, options: rest };
                }
                return sf;
              }),
            };
          }
          if (!groupId && f.id === fieldId) {
            const { [optionKey]: _rem, ...rest } = f.options ?? {};
            return { ...f, options: rest };
          }
          return f;
        })
      );
    },
    []
  );

  const renderFieldEditor = useCallback(
    (f: Field, g: number | null = null, d = 0, s = false) => (
      <FieldEditor
        key={f.id}
        field={f}
        groupId={g}
        depth={d}
        isSub={s}
        expandedField={expandedField}
        expandedSubField={expandedSubField}
        fieldTypes={fieldTypes}
        removeField={removeField}
        updateField={updateField}
        changeFieldType={changeFieldType}
        addOption={addOption}
        updateOption={updateOption}
        removeOption={removeOption}
        addFieldToGroup={addFieldToGroup}
        renderFieldEditor={renderFieldEditor}
        setExpandedField={setExpandedField}
        setExpandedSubField={setExpandedSubField}
      />
    ),
    [
      addFieldToGroup,
      addOption,
      changeFieldType,
      expandedField,
      expandedSubField,
      fieldTypes,
      removeField,
      removeOption,
      updateField,
      updateOption,
      setExpandedField,
      setExpandedSubField,
    ]
  );

  // const exportFields = useCallback(() => {
  //   const clean = fields.map((f) => {
  //     const copy = { ...f };
  //     if ((copy as GroupField).fields) {
  //       (copy as GroupField).fields = (copy as GroupField).fields!.map(
  //         (sf) => ({ ...sf })
  //       );
  //     }
  //     return copy;
  //   });
  //   return JSON.stringify(clean, null, 2);
  // }, [fields]);

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="mb-6 card neumo">
        <div className="card-body">
          {isEdit && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={values.name}
                onChange={(e: any) =>
                  setValues((v) => ({ ...v, name: e.target.value }))
                }
                className="form-control form-control-sm"
              />
            </div>
          )}
          {!isEdit && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <select
                name="name"
                id="modelo"
                value={values.name}
                onChange={(e: any) =>
                  setValues((v) => ({ ...v, name: e.target.value }))
                }
                className="form-control form-control-sm"
              >
                <option value="patient">Pacientes</option>
                <option value="user">Usuarios</option>
                <option value="commerce">Comercios</option>
                <option value="record">Registros</option>
              </select>
            </div>
          )}
        </div>
        <input type="hidden" name="commerce_id" value={values.commerce_id} />
      </div>

      <div className="mb-6 w-full flex flex-row-reverse">
        <button onClick={addField} className="btn btn-info neumo" type="button">
          <CiCirclePlus size={20} />
          <span>Agregar Campo</span>
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {fields.map((f) => renderFieldEditor(f))}
      </div>

      {/* <div className="rounded-lg p-6 shadow">
        <h2 className="text-lg font-medium mb-4">Array de Fields Generado:</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto max-h-96">
          <pre>{exportFields()}</pre>
        </div>
        <button
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
              navigator.clipboard.writeText(exportFields()).catch(() => {});
            }
          }}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          type="button"
        >
          Copiar al portapapeles
        </button>
      </div> */}
      <div className="card-footer flex justify-end mt-4">
        <button
          className="btn neumo btn-success ml-auto"
          type="button"
          onClick={() => onSubmit(fields && { ...values, fields })}
        >
          {isEdit ? "Actualizar Plantilla" : "Registrar Plantilla"}
        </button>
      </div>
    </div>
  );
};

export default FormTemplate;
