import React, { useState } from 'react';
import Layout from '../../components/Layout';
import axiosConfig from "../../services/axiosConfig";

function Enquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    preferredTime: '',
    phone: '',
    gender: '',
    section: '',
    enquiryText: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');  // To show success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.age) newErrors.age = "Age is required.";
    if (!formData.preferredTime) newErrors.preferredTime = "Preferred time is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.section) newErrors.section = "Section is required.";
    if (!formData.enquiryText) newErrors.enquiryText = "Enquiry message is required.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await axiosConfig.post('/enquiries', {
          enquiry: {
            name: formData.name,
            email: formData.email,
            age: formData.age,
            call_datetime: formData.preferredTime,
            phone: formData.phone,
            gender: formData.gender === 'W' ? 'Woman' : formData.gender === 'M' ? 'Man' : 'Other',
            section: formData.section === '1' ? 'General Inquiry' : formData.section === '2' ? 'PathLab' : 'Wellness',
            message: formData.enquiryText
          }
        });

        if (response.data.status.code === 200) {
          setSuccessMessage("Enquiry created successfully");
          // Reset form data
          setFormData({
            name: '',
            email: '',
            age: '',
            preferredTime: '',
            phone: '',
            gender: '',
            section: '',
            enquiryText: ''
          });
        }
      } catch (error) {
        console.error("There was an error submitting the enquiry!", error);
      }
    }
  };

  return (
    <Layout>
      <div
        className="wellness-banner d-flex align-items-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.53) 0%, rgba(0, 0, 0, 0) 99.88%), url('/img/empowerBanner.png')",
          backgroundPosition: "right",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="text-center text-slider text-para">
                <h1>Get in Touch</h1>
                <p>We are here to assist you with your queries and requests.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="bainary-top mb-60">
        <div className="container">
          <div className="row">
            
            <div className="col-lg-6">
              <form className="contact_us_form" id="enquiry_form" method="post" onSubmit={handleSubmit}>
                <div className="contact-form-style mb-20">
                  <input name="name" placeholder="Name" type="text" className="form-control" value={formData.name} onChange={handleChange} required />
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>
                <div className="contact-form-style mb-20">
                  <input name="email" placeholder="Email Address" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>
                <div className="contact-form-style mb-20">
                  <input name="age" min="10" max="99" placeholder="Age" type="number" className="form-control" value={formData.age} onChange={handleChange} required />
                  {errors.age && <small className="text-danger">{errors.age}</small>}
                </div>
                <div className="contact-form-style mb-20">
                  <input name="preferredTime" placeholder="Choose Preferable Date & Time for call" type="text" className="form-control" value={formData.preferredTime} onFocus={(e) => (e.target.type = 'datetime-local')} onChange={handleChange} required />
                  {errors.preferredTime && <small className="text-danger">{errors.preferredTime}</small>}
                </div>
                <div className="contact-form-style mb-20">
                  <input name="phone" placeholder="Phone" type="number" className="form-control" value={formData.phone} onChange={handleChange} required />
                  {errors.phone && <small className="text-danger">{errors.phone}</small>}
                </div>
                <div className="contact-form-style mb-20">
                  <select className="form-control" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="W">Woman</option>
                    <option value="TW">Trans woman</option>
                    <option value="M">Man</option>
                    <option value="TM">Trans man</option>
                  </select>
                  {errors.gender && <small className="text-danger">{errors.gender}</small>}
                </div>
                <div className="contact-form-style mb-20">
                  <select className="form-control" name="section" value={formData.section} onChange={handleChange} required>
                    <option value="">Select Section</option>
                    <option value="1">General</option>
                    <option value="2">PathLab</option>
                    <option value="3">Wellness</option>
                  </select>
                  {errors.section && <small className="text-danger">{errors.section}</small>}
                </div>
                <div className="contact-form-style mb-20">
                  <textarea name="enquiryText" rows="5" className="form-control" placeholder="Enquiry Message" value={formData.enquiryText} onChange={handleChange} required></textarea>
                  {errors.enquiryText && <small className="text-danger">{errors.enquiryText}</small>}
                </div>
                <div className="contact-form-style">
                  <button className="submit btn btn2 btn-primary btn-block buttonCustom" type="submit"><span>SEND ENQUIRY</span></button>
                </div>
              </form>

              {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            </div>
            <div className="col-lg-6">
              <img src="/img/enquiry_hospital.jpg" alt="Enquiry" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Enquiry;
