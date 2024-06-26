export function getRequiredFieldByModel(model) {
  const requiredFields = [];
  const enumFields = {};
  const uniqueFields = [];

  const schemaObj = model.schema.obj;

  for (const prop in schemaObj) {
    if (schemaObj.hasOwnProperty(prop)) {
      if (schemaObj[prop].required === true) {
        requiredFields.push(prop);
      }

      if (schemaObj[prop]?.enum) {
        const enumValues = Object.values(schemaObj[prop].enum);
        enumFields[prop] = enumValues;
      }

      if (schemaObj[prop]?.unique === true) {
        uniqueFields.push(prop);
      }
    }
  }

  return {
    required_fields: requiredFields,
    enum_fields: enumFields,
    unique_fields: uniqueFields,
  };
}
