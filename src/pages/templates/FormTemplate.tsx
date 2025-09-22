import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { userSchema, userSchemaEdit } from "../../schemas/userSchema";
import FormRender from "../../components/FormRender";

import { CiCirclePlus, CiTrash } from "react-icons/ci";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useAuthStore } from "../../store/auth.store";
const FormTemplate = ({ initialValues, isEdit = false, onSubmit }) => {
  const commercesStore = useAuthStore((s) => s.commerces);
  const roleUser = useAuthStore((s) => s.user.roles[0]);
 const [fields, setFields] = useState([]);
 const [expandedField, setExpandedField] = useState(null);

 const fieldTypes = [
   { value: "text", label: "Texto" },
   { value: "textarea", label: "Área de texto" },
   { value: "select", label: "Selección" },
   { value: "multiselect", label: "Selección múltiple" },
   { value: "checkbox", label: "Casilla" },
   { value: "radio", label: "Radio" },
   { value: "date", label: "Fecha" },
   { value: "tel", label: "Teléfono" },
   { value: "email", label: "Email" },
   { value: "number", label: "Número" },
   { value: "group", label: "Grupo de campos" },
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
       return { ...baseField, min: "", max: "", step: "" };
     case "textarea":
       return { ...baseField, rows: 3, maxLength: "" };
     case "text":
     case "email":
       return { ...baseField, maxLength: "", placeholder: "" };
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
             fields: field.fields.filter((subField) => subField.id !== fieldId),
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

 const renderFieldEditor = (field, groupId = null, depth = 0) => {
   const isExpanded = true;
  //  const isExpanded = expandedField === field.id;
   const hasOptions = ["select", "multiselect", "radio"].includes(field.type);

   // Filtrar tipos de campo para subcampos (sin group)
   const availableTypes =
     depth > 0
       ? fieldTypes.filter((type) => type.value !== "group")
       : fieldTypes;

   return (
     <div
       key={field.id}
       className={`border rounded-lg p-4 bg-white ${depth > 0 ? "ml-4 border-l-4 border-blue-200" : ""}`}
     >
       {/* Header del campo */}
       <div className="flex items-center justify-between mb-3">
         <div className="flex items-center space-x-2">
           <button
             onClick={() => setExpandedField(isExpanded ? null : field.id)}
             className="p-1 hover:bg-gray-100 rounded"
           >
             {isExpanded ? (
               <FaChevronDown size={16} />
             ) : (
               <FaChevronRight size={16} />
             )}
           </button>
           <span className="font-medium text-gray-700">
             {field.label || "Campo sin título"} ({field.type})
           </span>
           {field.required && <span className="text-red-500 text-sm">*</span>}
         </div>
         <button
           onClick={() => removeField(field.id, groupId)}
           className="p-1 hover:bg-red-100 text-red-600 rounded"
         >
           <CiTrash size={16} />
         </button>
       </div>

       {isExpanded && (
         <div className="space-y-4">
           {/* Configuración básica */}
           <div className="grid grid-cols-2 gap-4">
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
                 className="w-full px-3 py-2 border rounded-md"
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
                 className="w-full px-3 py-2 border rounded-md"
                 placeholder="Ej: full_name"
               />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Tipo</label>
               <select
                 value={field.type}
                 onChange={(e) =>
                   changeFieldType(field.id, e.target.value, groupId)
                 }
                 className="w-full px-3 py-2 border rounded-md"
               >
                 {availableTypes.map((type) => (
                   <option key={type.value} value={type.value}>
                     {type.label}
                   </option>
                 ))}
               </select>
             </div>
             <div className="flex items-center">
               <label className="flex items-center">
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
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Filas</label>
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
                   className="w-full px-3 py-2 border rounded-md"
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
                     updateField(field.id, "maxLength", e.target.value, groupId)
                   }
                   className="w-full px-3 py-2 border rounded-md"
                 />
               </div>
             </div>
           )}

           {field.type === "number" && (
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
                   className="w-full px-3 py-2 border rounded-md"
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
                   className="w-full px-3 py-2 border rounded-md"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Paso</label>
                 <input
                   type="number"
                   value={field.step || ""}
                   onChange={(e) =>
                     updateField(field.id, "step", e.target.value, groupId)
                   }
                   className="w-full px-3 py-2 border rounded-md"
                 />
               </div>
             </div>
           )}

           {["text", "email"].includes(field.type) && (
             <div>
               <label className="block text-sm font-medium mb-1">
                 Placeholder
               </label>
               <input
                 type="text"
                 value={field.placeholder || ""}
                 onChange={(e) =>
                   updateField(field.id, "placeholder", e.target.value, groupId)
                 }
                 className="w-full px-3 py-2 border rounded-md"
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
                   className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
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
                       className="w-1/2 px-3 py-2 border rounded-md"
                       placeholder="Clave (ej: op1)"
                     />
                     <input
                       type="text"
                       value={value}
                       onChange={(e) =>
                         updateOption(field.id, key, e.target.value, groupId)
                       }
                       className="w-1/2 px-3 py-2 border rounded-md"
                       placeholder="Texto visible (ej: Opción 1)"
                     />
                     <button
                       onClick={() => removeOption(field.id, key, groupId)}
                       className="p-2 hover:bg-red-100 text-red-600 rounded"
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
                   className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                 >
                   <CiCirclePlus size={14} />
                   <span>Agregar campo</span>
                 </button>
               </div>
               <div className="space-y-2">
                 {field.fields?.map((subField) =>
                   renderFieldEditor(subField, field.id, depth + 1)
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
     delete cleanField.id;

     if (cleanField.fields) {
       cleanField.fields = cleanField.fields.map((subField) => {
         const cleanSubField = { ...subField };
         delete cleanSubField.id;
         return cleanSubField;
       });
     }

     return cleanField;
   });

   return JSON.stringify(cleanFields, null, 2);
 };

 return (
   <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
     <div className="mb-6">
       <h1 className="text-2xl font-bold text-gray-900 mb-2">
         Constructor de Formularios
       </h1>
       <p className="text-gray-600">
         Crea y configura campos dinámicamente para generar tu array de fields
       </p>
     </div>

     {/* Botón para agregar campo */}
     <div className="mb-6">
       <button
         onClick={addField}
         className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
       >
         <CiCirclePlus size={20} />
         <span>Agregar Campo</span>
       </button>
     </div>

     {/* Lista de campos */}
     <div className="space-y-4 mb-8">
       {fields.map((field) => renderFieldEditor(field))}
     </div>

     {/* Preview del array generado */}
     <div className="bg-white rounded-lg p-6 shadow">
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
  // return (
  //   <div>
  //     <Formik
  //       initialValues={initialValues}
  //       validationSchema={isEdit ? userSchemaEdit : userSchema}
  //       onSubmit={onSubmit}
  //     >
  //       {({ errors, touched, isSubmitting }) => (
  //         <Form className="form-container">
  //           <div className="card neumo">
  //             <div className="card-body">
  //               <div className="form-group">
  //                 <label htmlFor="name" className="form-label">
  //                   Nombre
  //                 </label>
  //                 <Field
  //                   className={`input input-sm ${errors.name && touched.name ? "input-invalid" : ""}`}
  //                   type="text"
  //                   name="name"
  //                 />
  //                 <ErrorMessage
  //                   name="name"
  //                   component="div"
  //                   className="form-text-invalid"
  //                 />
  //               </div>

  //               <div className="form-group">
  //                 <label htmlFor="role" className="form-label">
  //                   Comercio
  //                 </label>
  //                 <Field
  //                   as="select"
  //                   className={`input input-sm ${
  //                     errors.role && touched.role ? "input-invalid" : ""
  //                   }`}
  //                   type="select"
  //                   name="role"
  //                   defaultValue={
  //                     isEdit ? (initialValues.commerce_id ?? -1) : -1
  //                   }
  //                 >
  //                   {commercesStore.map((commerceStore, indexStore) => (
  //                     <option
  //                       value={commerceStore.id}
  //                       key={`option-commerce-${indexStore}`}
  //                       disabled={
  //                         roleUser.name !== "superadmin"
  //                       }
  //                     >
  //                       {commerceStore.name}
  //                     </option>
  //                   ))}
  //                 </Field>
  //                 <ErrorMessage
  //                   name="role"
  //                   component="div"
  //                   className="form-text-invalid"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //           {isEdit && (
  //             <div className="card neumo">
  //               <div className="card-header">
  //                 <h3>Otros Datos</h3>
  //               </div>
  //               <div className="card-body">
  //                 <FieldArray
  //                   name="data"
  //                   render={(arrayHelpers: any) => (
  //                     <FormRender
  //                       arrayHelpers={arrayHelpers}
  //                       initialValues={initialValues}
  //                     />
  //                   )}
  //                 />
  //               </div>
  //             </div>
  //           )}
  //           <button
  //             className="btn neumo btn-success ml-auto"
  //             type="submit"
  //             disabled={isSubmitting}
  //           >
  //             {isEdit ? "Editar" : "Registrar"}
  //           </button>
  //         </Form>
  //       )}
  //     </Formik>
  //   </div>
  // );
};

export default FormTemplate;
