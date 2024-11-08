import { ApplyAgentVerificationApi, getAgentVerificationFormFielsApi, getAgentVerificationFormValuesApi } from '@/store/actions/campaign.js';
import { translate } from '@/utils/index.js';
import dynamic from 'next/dynamic';
import Image from 'next/image.js';
import { useRouter } from 'next/router.js';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdClose } from 'react-icons/md';

const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false });

const UserVerificationForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({});

  const router = useRouter()

  const fetchFormFields = () => {
    try {
      getAgentVerificationFormFielsApi({
        onSuccess: (res) => {
          setFormFields(res?.data);
        },
        onError: (err) => {
          console.log(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFormValues = () => {
    try {
      getAgentVerificationFormValuesApi({
        onSuccess: (res) => {
          if (res?.data?.verify_customer_values) {
            const initialValues = {};
            const previews = {};

            res.data.verify_customer_values.forEach(value => {
              const formField = formFields.find(field => field.id === value.verify_customer_form_id);
              if (formField) {
                initialValues[formField.name] = value.value;

                // Handle file preview
                if (formField.field_type === 'file' && value.value) {
                  previews[formField.name] = value.value; // Assuming value.value is the file URL
                }
              }
            });

            setFormData(initialValues);
            setImagePreviews(previews); // Set the file preview state
          }
        },
        onError: (err) => {
          console.log(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchFormFields();


  }, []);
  useEffect(() => {
    if (formFields?.length > 0) {
      fetchFormValues()
    }


  }, [formFields]);

  // Generic handler for field value changes
  const handleChange = (e, field) => {
    const { name, value, type, checked, files } = e.target;
  
    // Handle file input
    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Store the file object for all file types, not just images
        setFormData((prevData) => ({
          ...prevData,
          [name]: file, // Store the actual file object
        }));
  
        // Update image preview state if the file is an image
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreviews((prevPreviews) => ({
              ...prevPreviews,
              [name]: reader.result, // Store image preview
            }));
          };
          reader.readAsDataURL(file);
        } else {
          // Clear the preview if it's not an image (can add other types as needed)
          setImagePreviews((prevPreviews) => ({
            ...prevPreviews,
            [name]: null,
          }));
        }
      }
    }
    // Handle checkboxes
    else if (type === 'checkbox') {
      setFormData((prevData) => {
        const existingValues = prevData[name] || [];
        if (checked) {
          return {
            ...prevData,
            [name]: [...existingValues, value],
          };
        } else {
          return {
            ...prevData,
            [name]: existingValues.filter((v) => v !== value),
          };
        }
      });
    }
    // Handle radio buttons
    else if (type === 'radio') {
      setFormData((prevData) => ({
        ...prevData,
        [field.name]: value,
      }));
    }
    // Handle other input types (text, number, etc.)
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let hasError = false;

    // Iterate through each form field to check if they are filled
    formFields.forEach((field) => {
      const fieldValue = formData[field.name];
  
      // If the field is required and the value is empty or null
      if (!fieldValue || fieldValue === '') {
        // toast.error(`${field.name} is required`);
        hasError = true; // Mark that there is an error
      }
    });
  
    // If there are any errors, prevent form submission
    if (hasError) {
      toast.error(translate("allFields"));
      return;
    }
  
    setLoading(true); // Start loading
    const formFieldsData = formFields.map((field) => {
      const fieldValue = formData[field.name];
  
      if (fieldValue === undefined || fieldValue === '') {
        return { id: field.id, value: null };
      }
  
      // Ensure to return the file object for all file types
      return { id: field.id, value: fieldValue };
    });
  
    const filteredFormFieldsData = formFieldsData.filter((field) => field.value !== null);
  
    try {
      ApplyAgentVerificationApi({
        form_fields: filteredFormFieldsData,
        onSuccess: (res) => {
          setLoading(false); // Stop loading
          toast.success(res?.message);
          router.push('/user/dashboard');
  
          // Reset form data and fields
          setFormData({});
        },
        onError: (err) => {
          console.log('Error:', err);
          toast.error(err);
          setLoading(false); // Stop loading on error
        },
      });
    } catch (error) {
      console.log('Submission error:', error);
      setLoading(false); // Stop loading on error
    }
  };

  // Function to handle file removal
  const handleRemoveFile = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: null, // Remove the file from formData
    }));
    setImagePreviews((prevPreviews) => ({
      ...prevPreviews,
      [fieldName]: null, // Clear the preview
    }));
  };

  // Function to render dynamic fields based on the field type
  const renderFields = (field) => {
    switch (field.field_type) {
      case 'text':
        return (
          <div className="input-field" key={field.id}>
            <label className="is_require">{field.name}</label>
            <input
              type="text"
              name={field.name}
              placeholder={`Enter ${field.name} here`}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(e, field)}
            />
          </div>
        );
      case 'number':
        return (
          <div className="input-field" key={field.id}>
            <label className="is_require">{field.name}</label>
            <input
              type="number"
              name={field.name}
              placeholder={`Enter ${field.name} here`}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(e, field)}
            />
          </div>
        );
      case 'radio':
        return (
          <div className="input-field" key={field.id}>
            <label className="is_require">{field.name}</label>
            {field.form_fields_values &&
              field.form_fields_values.map((option, optionIndex) => (
                <div className="custom-radio" key={`radio_${option?.id}_${optionIndex}`}>
                  <input
                    type="radio"
                    id={`radio_${option?.id}_${optionIndex}`}
                    name={field.name} // Use field name to group the radio buttons
                    className="custom-checkbox-input"
                    value={option.value}
                    checked={formData[field.name] === option.value} // Handle checked state
                    onChange={(e) => handleChange(e, field)}
                  />
                  <label htmlFor={`radio_${option?.id}_${optionIndex}`} className="custom-checkbox-label">
                    {option.value}
                  </label>
                </div>
              ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="input-field" key={field.id}>
            <label className="is_require">{field.name}</label>
            {field.form_fields_values &&
              field.form_fields_values.map((option, optionIndex) => (
                <div className="custom-checkbox" key={`checkbox_${option?.id}_${optionIndex}`}>
                  <input
                    type="checkbox"
                    id={`checkbox_${option?.id}_${optionIndex}`}
                    name={field.name} // Use field name for checkbox groups
                    className="custom-checkbox-input"
                    value={option.value}
                    checked={(formData[field.name] || []).includes(option.value)} // Handle checked state
                    onChange={(e) => handleChange(e, field)}
                  />
                  <label htmlFor={`checkbox_${option?.id}_${optionIndex}`} className="custom-checkbox-label">
                    {option.value}
                  </label>
                </div>
              ))}
          </div>
        );
      case 'dropdown':
        return (
          <div className="input-field" key={field.id}>
            <div className="custom--agent-dropdown">
              <label className="is_require">{field.name}</label>
              <select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(e, field)}
              >
                <option value="">{translate("select")} {field.name}</option>
                {field.form_fields_values &&
                  field.form_fields_values.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div className="input-field" key={field.id}>
            <label className="is_require">{field.name}</label>
            <textarea
              className="prop_textbox_input"
              name={field.name}
              placeholder={`${translate("enter")} ${field.name} ${translate("here")}`}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(e, field)}
            ></textarea>
          </div>
        );
      case 'file':
        return (
          <div className="input-field" key={field.id}>
            <label className="is_require">{field.name}</label>
            {formData[field.name] ? (
              <div className="selected_file">
                {/* Check if the file is an image based on its extension */}
                {imagePreviews[field.name] && /\.(jpg|jpeg|png|gif)$/i.test(formData[field.name].name || formData[field.name]) ? (
                  <div className="image-preview">
                    {/* Render image preview */}
                    <Image src={imagePreviews[field.name]} alt="Preview" width={100} height={100} />
                  </div>
                ) : (
                  // Render file name for non-image files
                  <span>{formData[field.name]?.name || formData[field.name]}</span>
                )}
                <button type="button" className="remove-button" onClick={() => handleRemoveFile(field.name)}>
                  <MdClose />
                </button>
              </div>
            ) : (
              // File input for file selection
              <input
                type="file"
                name={field.name}
                onChange={(e) => handleChange(e, field)}
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              />
            )}
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <VerticleLayout>
      <div className="container">
        <div className="tranction_title">
          <h1>{translate("agentVerification")}</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="agent-form">
            <div className="row">
              {formFields &&
                formFields.map((field, index) => (
                  <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                    {renderFields(field)}
                  </div>
                ))}
            </div>
            <div className="agent-form-submit-div">
              {loading ? (
                <button className="">
                  <div className="loader-otp"></div>
                </button>
              ) : (
                <button type="submit" className="">
                  {translate("submit")}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </VerticleLayout>
  );
};

export default UserVerificationForm;
