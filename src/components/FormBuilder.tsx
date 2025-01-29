import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  IconButton,
  Typography,
  Card,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Add, Delete, Visibility } from '@mui/icons-material';
import './styles.css'; // Import a custom CSS file for styling

interface FormField {
  id: number;
  type: 'text' | 'radio' | 'checkbox';
  label: string;
  options?: string[];
  value?: string | string[]; // added to store initial value for radio/checkbox/text
}

interface FormStructure {
  id: number;
  fields: FormField[];
}

const DynamicFormBuilder: React.FC = () => {
  const [forms, setForms] = useState<FormStructure[]>(() => {
    const storedForms = localStorage.getItem('forms');
    return storedForms ? JSON.parse(storedForms) : [];
  });

  const [currentForm, setCurrentForm] = useState<FormStructure | null>(null);
  const [viewingForm, setViewingForm] = useState<FormStructure | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem('forms', JSON.stringify(forms));
  }, [forms]);

  const handleCreateForm = () => {
    setCurrentForm({ id: Date.now(), fields: [] });
  };

  const handleAddField = (type: FormField['type']) => {
    if (currentForm) {
      setCurrentForm({
        ...currentForm,
        fields: [
          ...currentForm.fields,
          { id: Date.now(), type, label: '', options: type === 'radio' || type === 'checkbox' ? [''] : undefined, value: type === 'radio' ? '' : type === 'checkbox' ? [] : '' },
        ],
      });
    }
  };

  const handleFieldChange = (id: number, key: keyof FormField, value: any) => {
    if (currentForm) {
      setCurrentForm({
        ...currentForm,
        fields: currentForm.fields.map((field) => (field.id === id ? { ...field, [key]: value } : field)),
      });
    }
    if (viewingForm) {
      setViewingForm({
        ...viewingForm,
        fields: viewingForm.fields.map((field) =>
          field.id === id ? { ...field, [key]: value } : field
        ),
      });
    }
  };

  const handleAddOption = (fieldId: number) => {
    if (currentForm) {
      setCurrentForm({
        ...currentForm,
        fields: currentForm.fields.map((field) =>
          field.id === fieldId && (field.type === 'radio' || field.type === 'checkbox') && field.options
            ? { ...field, options: [...field.options, ''] }
            : field
        ),
      });
    }
  };

  const handleRemoveOption = (fieldId: number, index: number) => {
    if (currentForm) {
      setCurrentForm({
        ...currentForm,
        fields: currentForm.fields.map((field) =>
          field.id === fieldId && (field.type === 'radio' || field.type === 'checkbox') && field.options
            ? {
                ...field,
                options: field.options.filter((_, i) => i !== index),
              }
            : field
        ),
      });
    }
  };

  const handleSaveForm = () => {
    if (currentForm && currentForm.fields.length > 0) {
      setForms((prev) => [...prev, currentForm]);
      setCurrentForm(null);
    }
  };

  const handleDeleteForm = (id: number) => {
    setForms((prev) => prev.filter((form) => form.id !== id));
    setViewingForm(null); // Close viewing form container when deleting
  };

  const handleViewForm = (id: number) => {
    const form = forms.find((form) => form.id === id);
    if (form) {
      setViewingForm(form);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    // Ensure the newValue is valid
    if (newValue === 0 || newValue === 1) {
      setTabIndex(newValue);
      setCurrentForm(null);
      setViewingForm(null);
    }
  };
  
  // const handleTabChange = (newValue: number) => {
  //   setTabIndex(newValue);
  //   setCurrentForm(null);
  //   setViewingForm(null);
  // };

  const handleUpdateForm = () => {
    if (viewingForm) {
      setForms((prev) => prev.map((form) => (form.id === viewingForm.id ? viewingForm : form)));
      setViewingForm(null);
    }
  };

  return (
    <Box className="container">
      <Typography variant="h4" className="header">Dynamic Form Builder</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} className="tabs">
        <Tab label="Create Form" />
        <Tab label="Saved Forms" />
      </Tabs>

      {tabIndex === 0 && (
        <Box className="tab-content">
          <Button variant="contained" color="primary" onClick={handleCreateForm} className="create-button">
            Start New Form
          </Button>

          {currentForm && (
            <Card className="form-card" sx={{mt:3}}>
              <Typography sx={{mb:2}} variant="h5" className="form-title">Create Form</Typography>
              {['text', 'radio', 'checkbox'].map((type) => (
                <Button sx={{mr:2}} key={type} variant="outlined" onClick={() => handleAddField(type as FormField['type'])} className="add-field-button">
                  Add {type} Field
                </Button>
              ))}
              {currentForm.fields.map((field, index) => (
                <Box sx={{mb:1}} key={field.id} className="field-container">
                  <TextField
                  sx={{mb:1, mt:index === 0 ? 1: 3}}
                    label={`Field Label ${index + 1}`}
                    value={field.label}
                    onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                    fullWidth
                  />
                  {field.type === 'radio' || field.type === 'checkbox' ? (
                    <Box sx={{mt:0}}>
                      <Typography variant="subtitle1">Options</Typography>
                      {field.options?.map((option, optionIndex) => (
                        <Box key={optionIndex} className="option-container" sx={{display:'flex', mb:1}}>
                          <TextField
                            value={option}
                            onChange={(e) =>
                              handleFieldChange(field.id, 'options', field.options!.map((opt, idx) => (idx === optionIndex ? e.target.value : opt)))
                            }
                            fullWidth
                            label={`Option ${optionIndex + 1}`}
                          />
                          <IconButton onClick={() => handleRemoveOption(field.id, optionIndex)} color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                      <Button sx={{mb:1, mt:2}}
                        variant="outlined"
                        onClick={() => handleAddOption(field.id)}
                        startIcon={<Add />}
                      >
                        Add Option
                      </Button>
                    </Box>
                  ) : null}

                  {/* Set initial value */}
                  <TextField
                    label="Initial Value"
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                    fullWidth
                    disabled={field.type === 'radio' && field.options?.length <= 0} // Disable if no options for radio
                  />
                </Box>
              ))}
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveForm}
                className="save-button"
                disabled={currentForm.fields.length === 0}
              >
                Save Form
              </Button>
            </Card>
          )}
        </Box>
      )}

      {tabIndex === 1 && (
        <Box className="tab-content">
          <Typography variant="h5" className="subheader">Saved Forms</Typography>
          {forms.map((form) => (
            <Card key={form.id} className="form-card">
              <Typography variant="h6">Form ID: {form.id}</Typography>
              <Box className="form-actions">
                <IconButton color="primary" onClick={() => handleViewForm(form.id)}>
                  <Visibility />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteForm(form.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Card>
          ))}
          {viewingForm && (
            <Card className="view-card">
              <Typography variant="h5">Viewing Form</Typography>
              {viewingForm.fields.map((field) => (
                <Box key={field.id} className="field-container">
                  <Typography variant="h6">{field.label}</Typography>
                  {field.type === 'text' && (
                    <TextField
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                      fullWidth
                    />
                  )}
                  {field.type === 'radio' && field.options?.map((opt, idx) => (
                    <div key={idx} className="option">
                      <input
                        type="radio"
                        name={`radio-${field.id}`}
                        checked={field.value === opt}
                        onChange={() => handleFieldChange(field.id, 'value', opt)}
                      /> {opt}
                    </div>
                  ))}
                  {field.type === 'checkbox' && field.options?.map((opt, idx) => (
                    <div key={idx} className="option">
                      <input
                        type="checkbox"
                        checked={field.value.includes(opt)}
                        onChange={() => {
                          const newValue = field.value.includes(opt)
                            ? field.value.filter((val) => val !== opt)
                            : [...(field.value as string[]), opt];
                          handleFieldChange(field.id, 'value', newValue);
                        }}
                      /> {opt}
                    </div>
                  ))}
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateForm}
                className="update-button"
              >
                Update Form
              </Button>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DynamicFormBuilder;
