// validation.js
export const validateForm = (formData) => {
    const { fullName, idNumber, phoneNumber, firstDropdown, secondDropdown, email, password } = formData;
    const newErrors = {};
  
    // Full Name Validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters';
    }
  
    // ID Number Validation
    if (!idNumber.trim()) {
      newErrors.idNumber = 'ID Number is required';
    } else if (!/^\d{9}[vVxX]?$/.test(idNumber)) {
      newErrors.idNumber = 'Invalid ID Number format';
    }
  
    // Phone Number Validation
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^0\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid Phone Number (should start with 0 and have 10 digits)';
    }
  
    // District Validation
    if (firstDropdown === 'Select') {
      newErrors.district = 'Please select a district';
    }
  
    // Pradeshiya Sabha Validation
    if (secondDropdown === 'Select') {
      newErrors.pradeshiyaSabaha = 'Please select a Pradeshiya Sabha';
    }
  
    // Email Validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
  
    // Password Validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
  
    return newErrors;
  };