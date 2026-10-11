const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/doctor_hub';

const doctorsData = [
  {
    fullName: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@doctorhub.com',
    phone: '+1-555-0101',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    specialty: 'Cardiology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Hypertension', 'Coronary Artery Disease', 'Arrhythmia', 'Heart Failure'],
    bio: 'Board-certified Cardiologist with over 15 years of experience specializing in preventive cardiology and cardiovascular interventions.',
    experienceYears: 15,
    consultationFee: 150,
    isVerified: true
  },
  {
    fullName: 'Dr. Rajesh Patel',
    email: 'rajesh.patel@doctorhub.com',
    phone: '+1-555-0102',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Gastroenterology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['GERD', 'Irritable Bowel Syndrome (IBS)', 'Ulcerative Colitis', 'Liver Disease'],
    bio: 'Leading Gastroenterologist specializing in advanced endoscopic procedures, IBD management, and liver health.',
    experienceYears: 12,
    consultationFee: 130,
    isVerified: true
  },
  {
    fullName: 'Dr. Elena Rostova',
    email: 'elena.rostova@doctorhub.com',
    phone: '+1-555-0103',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=400',
    specialty: 'Dermatology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Acne Vulgaris', 'Eczema', 'Psoriasis', 'Skin Cancer Screening'],
    bio: 'Dermatologist dedicated to medical, surgical, and cosmetic skin care with holistic patient management.',
    experienceYears: 10,
    consultationFee: 120,
    isVerified: true
  },
  {
    fullName: 'Dr. Marcus Vance',
    email: 'marcus.vance@doctorhub.com',
    phone: '+1-555-0104',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    specialty: 'Neurology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Migraine', 'Epilepsy', "Parkinson's Disease", 'Peripheral Neuropathy'],
    bio: 'Senior Neurologist focusing on neurodegenerative diseases, epilepsy, and comprehensive headache medicine.',
    experienceYears: 18,
    consultationFee: 180,
    isVerified: true
  },
  {
    fullName: 'Dr. Hakeem Bilal Ahmed',
    email: 'bilal.ahmed@doctorhub.com',
    phone: '+1-555-0105',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    specialty: 'Herbal & Unani Medicine',
    treatmentType: 'Herbal',
    diseasesTreated: ['Chronic Fatigue Syndrome', 'Digestive Disorders', 'Joint Inflammation', 'Vitality & Wellness'],
    bio: 'Expert Herbal practitioner with 20 years in natural herbal formulations and holistic Unani healing arts.',
    experienceYears: 20,
    consultationFee: 80,
    isVerified: true
  },
  {
    fullName: 'Dr. Samuel Schmidt',
    email: 'samuel.schmidt@doctorhub.com',
    phone: '+1-555-0106',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Homeopathy',
    treatmentType: 'Homeopathic',
    diseasesTreated: ['Allergic Rhinitis', 'Asthma', 'Chronic Sinusitis', 'Eczema & Rashes'],
    bio: 'Classical Homeopath specialized in non-invasive, gentle, and constitutional therapies for chronic conditions.',
    experienceYears: 14,
    consultationFee: 75,
    isVerified: true
  },
  {
    fullName: 'Dr. Aisha Khan',
    email: 'aisha.khan@doctorhub.com',
    phone: '+1-555-0107',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    specialty: 'Pediatrics',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Child Growth & Development', 'Pediatric Asthma', 'Infectious Diseases', 'Allergies'],
    bio: 'Compassionate Pediatrician focusing on newborn care, childhood immunity, and developmental milestones.',
    experienceYears: 9,
    consultationFee: 100,
    isVerified: true
  },
  {
    fullName: 'Dr. David Miller',
    email: 'david.miller@doctorhub.com',
    phone: '+1-555-0108',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400',
    specialty: 'Orthopedics',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Osteoarthritis', 'ACL & Ligament Injuries', 'Spine & Back Pain', 'Fracture Care'],
    bio: 'Orthopedic surgeon specializing in sports medicine, joint replacements, and spinal care.',
    experienceYears: 16,
    consultationFee: 160,
    isVerified: true
  },
  {
    fullName: 'Dr. Maria Garcia',
    email: 'maria.garcia@doctorhub.com',
    phone: '+1-555-0109',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=400',
    specialty: 'Obstetrics & Gynecology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['PCOS', 'Infertility Care', 'High-Risk Pregnancy', 'Endometriosis'],
    bio: 'Dedicated Gynecologist providing full spectrum maternal healthcare, reproductive medicine, and wellness.',
    experienceYears: 13,
    consultationFee: 140,
    isVerified: true
  },
  {
    fullName: 'Dr. Tariq Mahmood',
    email: 'tariq.mahmood@doctorhub.com',
    phone: '+1-555-0110',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    specialty: 'Homeopathy',
    treatmentType: 'Homeopathic',
    diseasesTreated: ['Rheumatoid Arthritis', 'Chronic Migraine', 'Renal Calculi (Kidney Stones)', 'Alopecia'],
    bio: 'Experienced Homeopathic consultant with over 22 years treating complex auto-immune and chronic illness.',
    experienceYears: 22,
    consultationFee: 70,
    isVerified: true
  },
  {
    fullName: 'Dr. Emily Watson',
    email: 'emily.watson@doctorhub.com',
    phone: '+1-555-0111',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    specialty: 'Psychiatry',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Major Depressive Disorder', 'Generalized Anxiety', 'ADHD', 'PTSD'],
    bio: 'Psychiatrist offering evidence-based psychotherapy, psychopharmacology, and mental well-being care.',
    experienceYears: 11,
    consultationFee: 150,
    isVerified: true
  },
  {
    fullName: 'Dr. Kenji Sato',
    email: 'kenji.sato@doctorhub.com',
    phone: '+1-555-0112',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Ophthalmology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Cataracts', 'Glaucoma', 'Macular Degeneration', 'Dry Eye Syndrome'],
    bio: 'Ophthalmic surgeon skilled in micro-incisional cataract surgery and corneal health treatment.',
    experienceYears: 17,
    consultationFee: 135,
    isVerified: true
  },
  {
    fullName: 'Dr. Fatima Zahra',
    email: 'fatima.zahra@doctorhub.com',
    phone: '+1-555-0113',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    specialty: 'Herbal Medicine',
    treatmentType: 'Herbal',
    diseasesTreated: ['Hormonal Imbalance', 'Insomnia & Sleep Disorders', 'Stress Relief', 'Immune Boosting'],
    bio: 'Herbal Medicine specialist applying standardized botanical remedies for metabolic and hormonal health.',
    experienceYears: 15,
    consultationFee: 85,
    isVerified: true
  },
  {
    fullName: 'Dr. Christopher Lee',
    email: 'christopher.lee@doctorhub.com',
    phone: '+1-555-0114',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Pulmonology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['COPD', 'Severe Asthma', 'Sleep Apnea', 'Pneumonia & Lung Infections'],
    bio: 'Pulmonologist & Sleep Medicine specialist focusing on airway disorders and respiratory rehabilitation.',
    experienceYears: 14,
    consultationFee: 145,
    isVerified: true
  },
  {
    fullName: 'Dr. Linda Campbell',
    email: 'linda.campbell@doctorhub.com',
    phone: '+1-555-0115',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=400',
    specialty: 'Endocrinology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Type 1 & Type 2 Diabetes', 'Thyroid Nodules & Hashimoto', 'Obesity Management', 'Adrenal Disorders'],
    bio: 'Endocrinologist focused on advanced diabetes management technology, thyroid care, and metabolic health.',
    experienceYears: 13,
    consultationFee: 140,
    isVerified: true
  },
  {
    fullName: 'Dr. William Taylor',
    email: 'william.taylor@doctorhub.com',
    phone: '+1-555-0116',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400',
    specialty: 'Urology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Kidney Stones', 'Benign Prostatic Hyperplasia (BPH)', 'Urinary Incontinence', 'Recurrent UTI'],
    bio: 'Urologist specializing in minimally invasive stone treatments and prostate healthcare.',
    experienceYears: 19,
    consultationFee: 155,
    isVerified: true
  },
  {
    fullName: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@doctorhub.com',
    phone: '+1-555-0117',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    specialty: 'Ayurvedic & Herbal Medicine',
    treatmentType: 'Herbal',
    diseasesTreated: ['Metabolic Syndrome', 'Chronic Gastritis', 'Skin Detoxification', 'Joint Degeneration'],
    bio: 'Ayurvedic & Herbal practitioner utilizing traditional herbs, dietetics, and lifestyle therapies.',
    experienceYears: 11,
    consultationFee: 80,
    isVerified: true
  },
  {
    fullName: 'Dr. Robert Chen',
    email: 'robert.chen@doctorhub.com',
    phone: '+1-555-0118',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    specialty: 'Nephrology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Chronic Kidney Disease (CKD)', 'Hypertensive Nephropathy', 'Glomerulonephritis', 'Dialysis Care'],
    bio: 'Nephrologist specializing in kidney disease preservation, hypertension control, and renal therapies.',
    experienceYears: 16,
    consultationFee: 165,
    isVerified: true
  },
  {
    fullName: 'Dr. Sophia Martinez',
    email: 'sophia.martinez@doctorhub.com',
    phone: '+1-555-0119',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    specialty: 'Rheumatology',
    treatmentType: 'Allopathic',
    diseasesTreated: ['Systemic Lupus Erythematosus (SLE)', 'Rheumatoid Arthritis', 'Gout', 'Scleroderma'],
    bio: 'Rheumatologist specializing in early autoimmune diagnosis and biological targeted therapies.',
    experienceYears: 10,
    consultationFee: 135,
    isVerified: true
  },
  {
    fullName: 'Dr. Hans Weber',
    email: 'hans.weber@doctorhub.com',
    phone: '+1-555-0120',
    password: 'DoctorPassword123!',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Homeopathy',
    treatmentType: 'Homeopathic',
    diseasesTreated: ['Allergic Asthma', 'Irritable Bowel', 'Chronic Headaches', 'Sleep Disturbances'],
    bio: 'Experienced European Homeopath focused on customized remedies for chronic systemic imbalances.',
    experienceYears: 18,
    consultationFee: 75,
    isVerified: true
  }
];

const adminsData = [
  {
    fullName: 'System Admin',
    email: 'admin@doctorhub.com',
    password: 'AdminPassword123!',
    phone: '+1-555-0001',
    role: 'admin'
  },
  {
    fullName: 'Administrator',
    email: 'administrator@doctorhub.com',
    password: 'AdminPassword123!',
    phone: '+1-555-0002',
    role: 'super_admin'
  }
];

async function seedDB() {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully.');

    // Seed Admin users
    console.log('\n--- SEEDING ADMIN ACCOUNTS ---');
    for (const adminItem of adminsData) {
      let user = await User.findOne({ email: adminItem.email });
      if (user) {
        user.fullName = adminItem.fullName;
        user.password = adminItem.password;
        user.phone = adminItem.phone;
        user.role = adminItem.role;
        await user.save();
        console.log(`[Updated Admin] Email: ${adminItem.email} | Role: ${adminItem.role}`);
      } else {
        await User.create(adminItem);
        console.log(`[Created Admin] Email: ${adminItem.email} | Role: ${adminItem.role}`);
      }
    }

    // Seed 20 Doctors
    console.log('\n--- SEEDING 20 DOCTORS ---');
    let doctorCount = 0;
    for (const doc of doctorsData) {
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        user = await User.create({
          fullName: doc.fullName,
          email: doc.email,
          phone: doc.phone,
          password: doc.password,
          role: 'doctor',
          avatar: doc.avatar
        });
      } else {
        user.fullName = doc.fullName;
        user.phone = doc.phone;
        user.password = doc.password;
        user.avatar = doc.avatar;
        await user.save();
      }

      let doctorDoc = await Doctor.findOne({ userId: user._id });
      if (!doctorDoc) {
        doctorDoc = await Doctor.create({
          userId: user._id,
          specialty: doc.specialty,
          treatmentType: doc.treatmentType,
          diseasesTreated: doc.diseasesTreated,
          bio: doc.bio,
          experienceYears: doc.experienceYears,
          consultationFee: doc.consultationFee,
          isVerified: doc.isVerified
        });
      } else {
        doctorDoc.specialty = doc.specialty;
        doctorDoc.treatmentType = doc.treatmentType;
        doctorDoc.diseasesTreated = doc.diseasesTreated;
        doctorDoc.bio = doc.bio;
        doctorDoc.experienceYears = doc.experienceYears;
        doctorDoc.consultationFee = doc.consultationFee;
        doctorDoc.isVerified = doc.isVerified;
        await doctorDoc.save();
      }
      doctorCount++;
      console.log(`[Doctor #${doctorCount}] ${doc.fullName} (${doc.specialty} - ${doc.treatmentType}) - Email: ${doc.email}`);
    }

    console.log(`\nSuccessfully seeded ${doctorCount} doctors and admin accounts into MongoDB database.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDB();
