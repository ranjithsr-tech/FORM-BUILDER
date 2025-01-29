import React from 'react';
import { FieldType } from './types';

interface FormPreviewProps {
  formFields: FieldType[];
}

const FormPreview: React.FC<FormPreviewProps> = ({ formFields }) => {
  return (
    <div>
      <h2>Form Preview</h2>
      <form>
        {formFields.map((field, index) => (
          <div key={index}>
            <label>{field.label}</label>
            {field.type === 'text' && <input type="text" />}
            {field.type === 'radio' && (
              <div>
                {field.options?.map((option, idx) => (
                  <div key={idx}>
                    <input type="radio" name={`field-${index}`} value={option} />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
            )}
            {field.type === 'checkbox' && (
              <div>
                {field.options?.map((option, idx) => (
                  <div key={idx}>
                    <input type="checkbox" name={`field-${index}`} value={option} />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default FormPreview;
