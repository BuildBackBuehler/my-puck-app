import { ComponentConfig } from "@measured/puck";
import { FieldLabel } from "@measured/puck";
import React from "react";

// export type BooleanField = {
//   type: "boolean";
//   label?: string;
//   defaultValue?: boolean;
// };

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