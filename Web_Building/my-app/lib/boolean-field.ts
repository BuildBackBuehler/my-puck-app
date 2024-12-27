import { BaseField, ComponentConfig, NumberField, resolveAllData, SelectField, TextareaField, TextField } from "@measured/puck";
import { FieldLabel } from "@measured/puck";
import React from "react";

export type BooleanField = {
  type: "boolean";
  options?: string;
  defaultValue?: boolean;
};

// Update the Field type union
type Field = TextField 
  | NumberField 
  | TextareaField 
  | SelectField 
  | BooleanField;  // Add your new type

// Example usage in component config
export const BooleanField = {
  fields: {
    BooleanField: {
      type: "boolean"
      // Additional properties
    }
  }
};

// export const BooleanField: ComponentConfig<BooleanField> = {
//   fields: {
//     label: { type: "text" },
//     defaultValue: { type: "boolean" },
//   },
//   defaultProps: {
//     defaultValue: false,
//     type: "boolean"
//   },
//   render: ({ onChange, value, name, field }) => {
//     return (
//       <FieldLabel label= "boolean">
//         <input
//           type="checkbox"
//           checked={value}
//           onChange={(e) => onChange(e.target.checked)} 
//           />
//       </FieldLabel>
//     );
//   },
// };

// export default BooleanField;

// export const CustomField = () => (
//   <FieldLabel label="boolean">
//   <input
//     type="checkbox"
//     checked={value}
//     onChange={(e) => onChange(e.target.checked)} 
//     />
//   </FieldLabel>
// );
 

// // Update base Field type
// type Field = {
//   boolean: BooleanField;
//   // ... other existing field types
// };