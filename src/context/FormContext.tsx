import React, { createContext, useState, ReactNode } from 'react';

export interface FormField {
  id: string;
  type: 'text' | 'radio' | 'checkbox';
  label: string;
  options?: string[]; // For radio and checkbox fields
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
}

interface FormContextProps {
  forms: Form[];
  addForm: (form: Form) => void;
  updateForm: (id: string, updatedForm: Form) => void;
  deleteForm: (id: string) => void;
}

export const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [forms, setForms] = useState<Form[]>(() => {
    const savedForms = localStorage.getItem('forms');
    return savedForms ? JSON.parse(savedForms) : [];
  });

  const saveToLocalStorage = (forms: Form[]) => {
    localStorage.setItem('forms', JSON.stringify(forms));
  };

  const addForm = (form: Form) => {
    const updatedForms = [...forms, form];
    setForms(updatedForms);
    saveToLocalStorage(updatedForms);
  };

  const updateForm = (id: string, updatedForm: Form) => {
    const updatedForms = forms.map((form) => (form.id === id ? updatedForm : form));
    setForms(updatedForms);
    saveToLocalStorage(updatedForms);
  };

  const deleteForm = (id: string) => {
    const updatedForms = forms.filter((form) => form.id !== id);
    setForms(updatedForms);
    saveToLocalStorage(updatedForms);
  };

  return (
    <FormContext.Provider value={{ forms, addForm, updateForm, deleteForm }}>
      {children}
    </FormContext.Provider>
  );
};
