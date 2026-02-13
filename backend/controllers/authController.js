const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Clinic = require('../models/clinicModel');
const ResponseHandler = require('../utils/responseHandler');

exports.googleAuth = (req, res, next) => {
  console.log('Google auth route hit');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({
      error: 'Google OAuth not configured',
      message: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required'
    });
  }

  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google auth error:', err);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}?error=auth_failed`);
    }

    if (!user) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}?error=no_user`);
    }

    try {
      // Create JWT token
      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
      );

      // Redirect to base URL - frontend will handle role-based navigation
      const redirectPath = '';

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}${redirectPath}?token=${token}&user=${encodeURIComponent(JSON.stringify({
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }))}`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect('http://localhost:5173?error=token_generation_failed');
    }
  })(req, res, next);
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    ResponseHandler.success(res, {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }, 'User data retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Validate required fields
    if (!full_name || !email || !password) {
      return ResponseHandler.badRequest(res, 'Please provide full name, email, and password');
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return ResponseHandler.badRequest(res, 'User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role: role || 'patient'
    });

    // Create token
    const token = jwt.sign(
      { id: newUser.user_id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const userResponse = {
      user_id: newUser.user_id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role.toLowerCase()
    };

    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password presence
    if (!email || !password) {
      return ResponseHandler.badRequest(res, 'Please provide email and password');
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return ResponseHandler.unauthorized(res, 'Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return ResponseHandler.unauthorized(res, 'Invalid credentials');
    }

    // Create token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const userResponse = {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role.toLowerCase()
    };

    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    next(error);
  }
};

exports.registerDoctor = async (req, res, next) => {
  try {
    const data = req.body;

    const {
      name,
      email,
      mobile,
      gender,
      dob,
      mciReg,
      councilName,
      regYear,
      degrees,
      university,
      gradYear,
      experience,
      specializations,
      languages,
      consultationModes,
      bankDetails,
      bio,
      password
    } = data;

    // Validate required fields
    if (!name || !email || !mobile || !password || !mciReg || !councilName || !regYear || !degrees || !university || !gradYear || !experience) {
      return ResponseHandler.badRequest(res, 'Please provide all required fields');
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return ResponseHandler.badRequest(res, 'User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      full_name: name,
      email,
      mobile_number: mobile,
      password_hash: hashedPassword,
      role: 'doctor'
    });

    // Create doctor record
    const doctorData = {
      full_name: name,
      date_of_birth: new Date(dob),
      mobile,
      email,
      medical_council_reg_no: mciReg,
      medical_council_name: councilName,
      registration_year: parseInt(regYear),
      qualifications: degrees,
      university_name: university,
      graduation_year: parseInt(gradYear),
      experience_years: parseInt(experience),
      bio: bio || '',
      bank_account_name: bankDetails?.accountName || '',
      bank_account_number: bankDetails?.accountNumber || '',
      ifsc_code: bankDetails?.ifsc || '',
      pan_number: bankDetails?.pan || '',
      gstin: bankDetails?.gstin || '',
      terms_accepted: true,
      declaration_accepted: true
    };

    const newDoctor = await Doctor.create(doctorData);

    // Create token
    const token = jwt.sign(
      { id: newUser.user_id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const userResponse = {
      user_id: newUser.user_id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role.toLowerCase()
    };

    res.status(200).json({ token, user: userResponse, doctor: newDoctor });
  } catch (error) {
    next(error);
  }
};

exports.registerClinic = async (req, res, next) => {
  try {
    const {
      name,
      type,
      establishedYear,
      tagline,
      description,
      address,
      pinCode,
      city,
      state,
      mobile,
      email,
      website,
      medicalCouncilRegNo,
      bankDetails,
      services,
      facilities,
      paymentModes,
      bookingModes,
      password
    } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !password || !address || !pinCode || !city || !state || !medicalCouncilRegNo) {
      return ResponseHandler.badRequest(res, 'Please provide all required fields');
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return ResponseHandler.badRequest(res, 'User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      full_name: name,
      email,
      mobile_number: mobile,
      password_hash: hashedPassword,
      role: 'clinic'
    });

    // Create clinic record
    const clinicData = {
      clinic_name: name,
      establishment_year: establishedYear ? parseInt(establishedYear) : null,
      tagline: tagline || '',
      description: description || '',
      address,
      pin_code: pinCode,
      city,
      state,
      mobile,
      email,
      website: website || '',
      medical_council_reg_no: medicalCouncilRegNo,
      bank_account_name: bankDetails?.accountName || '',
      bank_account_number: bankDetails?.accountNumber || '',
      ifsc_code: bankDetails?.ifsc || '',
      pan_number: bankDetails?.pan || '',
      gstin: bankDetails?.gstin || '',
      terms_accepted: true,
      declaration_accepted: true
    };

    const newClinic = await Clinic.create(clinicData);

    // Create token
    const token = jwt.sign(
      { id: newUser.user_id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const userResponse = {
      user_id: newUser.user_id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role.toLowerCase()
    };

    ResponseHandler.success(res, { token, user: userResponse, clinic: newClinic }, 'Clinic registration successful');
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Validate required fields
    if (!email || !otp) {
      return ResponseHandler.badRequest(res, 'Email and OTP are required');
    }

    // For demo, accept OTP 123456
    if (otp === '123456') {
      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return ResponseHandler.badRequest(res, 'User not found');
      }

      // Create token
      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
      );

      const userResponse = {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role.toLowerCase()
      };

      res.status(200).json({ token, user: userResponse });
    } else {
      return ResponseHandler.badRequest(res, 'Invalid OTP');
    }
  } catch (error) {
    next(error);
  }
};
