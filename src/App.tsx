import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Shield, 
  Users, 
  Calendar, 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  ChevronRight, 
  LogOut,
  User,
  ClipboardList,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Compass,
  Puzzle,
  Zap,
  Star,
  Brain,
  Facebook,
  Youtube,
  Instagram
} from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// --- Types ---
interface Client {
  id: number;
  client_id: string;
  name: string;
  mobile: string;
  created_at: string;
  form_id?: number;
  form_date?: string;
}

interface IntakeForm {
  basic_info: any;
  personal_social: any;
  referral_info: any;
  informant_details: any;
  presenting_concerns: string;
  duration_progress: any;
  additional_notes: string;
  declaration: boolean;
  signature: string;
  admin_signature?: string;
  status?: string;
}

// --- Components ---

const FormOverview = ({ data }: { data: IntakeForm }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[2.5rem] p-8 md:p-12"
      >
        <div className="bg-brand-mint/30 p-6 rounded-2xl border border-brand-secondary/20 mb-10 text-center">
          <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="text-brand-secondary w-6 h-6" />
          </div>
          <p className="text-brand-secondary font-bold text-lg">
            Your form has already been submitted.
          </p>
          <p className="text-slate-600 text-sm mt-1">
            For any correction, please contact admin.
          </p>
        </div>

        <div className="space-y-12">
          {/* Basic Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <User className="text-brand-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Basic Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <DetailItem label="Full Name" value={data.basic_info.name} />
              <DetailItem label="Age" value={data.basic_info.age} />
              <DetailItem label="Date of Birth" value={data.basic_info.dob} />
              <DetailItem label="Gender" value={data.basic_info.gender} />
              <DetailItem label="Occupation" value={data.basic_info.occupation} />
              <DetailItem label="Residence" value={data.basic_info.residence} />
              <DetailItem label="Address" value={data.basic_info.address} fullWidth />
            </div>
          </section>

          {/* Personal & Social Details */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <Users className="text-brand-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Personal & Social Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <DetailItem label="Marital Status" value={data.personal_social.marital} />
              <DetailItem label="Mother Tongue" value={data.personal_social.tongue} />
              <DetailItem label="Religion" value={data.personal_social.religion} />
              <DetailItem label="Family Type" value={data.personal_social.family_type} />
              <DetailItem label="Family Members" value={data.personal_social.members} />
              <DetailItem label="Socio-economic Status" value={data.personal_social.status} />
            </div>
          </section>

          {/* Referral Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <Zap className="text-brand-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Referral Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <DetailItem label="Source of Referral" value={data.referral_info.source} />
              <DetailItem label="Reason for Referral" value={data.referral_info.reason} fullWidth />
            </div>
          </section>

          {/* Informant Details */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <Brain className="text-brand-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Informant Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <DetailItem label="Informant Name" value={data.informant_details.name} />
              <DetailItem label="Relation with Client" value={data.informant_details.relation} />
              <DetailItem label="Duration of Contact" value={data.informant_details.duration} />
              <DetailItem label="Reliability" value={data.informant_details.reliability} />
            </div>
          </section>

          {/* Presenting Concerns */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <Puzzle className="text-brand-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Presenting Concerns</h3>
            </div>
            <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.presenting_concerns}</p>
            </div>
          </section>

          {/* Duration & Progress */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="text-brand-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Duration & Progress</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <DetailItem label="Duration of Complaints" value={data.duration_progress.duration} />
              <DetailItem label="Course" value={data.duration_progress.course} />
            </div>
          </section>

          {/* Additional Notes */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                <Star className="text-brand-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Additional Notes</h3>
            </div>
            <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.additional_notes || 'No additional notes provided.'}</p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

const DetailItem = ({ label, value, fullWidth = false }: { label: string, value: string, fullWidth?: boolean }) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-slate-900 font-semibold">{value || 'N/A'}</p>
  </div>
);

// --- Components ---

const Navbar = ({ user, onLogout, onLoginClick }: { user: any, onLogout: () => void, onLoginClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Heart className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
            ভোরের আলো
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-sm font-medium hover:text-brand-primary transition-colors">Home</a>
          <a href="#about" className="text-sm font-medium hover:text-brand-primary transition-colors">About</a>
          <a href="#services" className="text-sm font-medium hover:text-brand-primary transition-colors">Services</a>
          <a href="#book" className="text-sm font-medium hover:text-brand-primary transition-colors">Book</a>
          <a href="#contact" className="text-sm font-medium hover:text-brand-primary transition-colors">Contact</a>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-brand-primary">
                {user.role === 'admin' ? 'Admin Panel' : `Client: ${user.client_id}`}
              </span>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-6 py-2 bg-brand-primary text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Client Login
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-4 right-4 glass rounded-2xl p-6 flex flex-col gap-4"
          >
            <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#about" onClick={() => setIsOpen(false)}>About</a>
            <a href="#services" onClick={() => setIsOpen(false)}>Services</a>
            <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
            {!user && (
              <button 
                onClick={() => { onLoginClick(); setIsOpen(false); }}
                className="w-full py-3 bg-brand-primary text-white rounded-xl font-semibold"
              >
                Client Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section id="home" className="pt-32 pb-20 px-4 overflow-hidden">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="px-4 py-1.5 bg-brand-mint text-brand-secondary rounded-full text-sm font-bold mb-6 inline-block">
          Trusted Child Counseling in West Bengal
        </span>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Nurturing <span className="text-brand-primary">Young Minds</span> for a Brighter Future.
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-lg">
          Professional, compassionate, and child-centered therapy designed to help your child overcome challenges and thrive emotionally.
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/30 hover:translate-y-[-2px] transition-all"
          >
            Book Appointment
          </button>
          <button 
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/90 transition-all"
          >
            Our Services
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="relative z-10 rounded-[2rem] overflow-hidden depth-2 aspect-square">
          <img 
            src="https://picsum.photos/seed/child-therapy/800/800" 
            alt="Child Therapy" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Floating 3D Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-6 z-20 glass p-4 rounded-2xl depth-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-mint rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-brand-secondary w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Success Rate</p>
              <p className="text-lg font-bold">98% Happy Kids</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-6 -left-6 z-20 glass p-4 rounded-2xl depth-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-peach rounded-full flex items-center justify-center">
              <Shield className="text-brand-accent w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Certified</p>
              <p className="text-lg font-bold">Expert Counselors</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Services = () => {
  const services = [
    { 
      icon: <Heart />, 
      title: "Child Counseling", 
      desc: "At ভোরের আলো, we provide professional emotional and psychological support for children facing anxiety, fear, low confidence, and school-related stress. Our expert counselors focus on building resilience and emotional intelligence in a safe, nurturing environment. We understand the unique challenges children face today and offer tailored therapeutic interventions to help them navigate emotional hurdles, ensuring they grow into confident and emotionally balanced individuals." 
    },
    { 
      icon: <Users />, 
      title: "Parents Counseling", 
      desc: "We offer structured guidance sessions for parents to help them better understand child behavior and improve family communication. Our sessions focus on developing healthy parenting strategies to handle academic pressure, emotional outbursts, and digital addiction. By empowering parents with the right tools and insights, we help create a supportive home environment where both children and parents can thrive together in harmony and mutual respect." 
    },
    { 
      icon: <Compass />, 
      title: "Career Counseling", 
      desc: "Our scientific assessment-based career guidance helps students navigate their academic future with clarity. We include comprehensive aptitude analysis, interest mapping, and structured planning to help children choose the right academic and career path. By identifying a child's natural strengths and passions early on, we ensure they make informed decisions that lead to long-term professional satisfaction and success in their chosen fields." 
    },
    { 
      icon: <Shield />, 
      title: "Behaviour Therapy", 
      desc: "We utilize evidence-based behavior modification techniques for children facing aggression, stubbornness, lack of focus, or social adjustment difficulties. Our approach includes structured intervention planning tailored to each child's specific behavioral patterns. We work closely with families to implement positive reinforcement strategies that encourage better social interactions, improved self-control, and a more focused approach to daily tasks and academic responsibilities." 
    },
    { 
      icon: <Puzzle />, 
      title: "Autism Support", 
      desc: "ভোরের আলো provides specialized counseling and developmental support for children on the Autism Spectrum. Our focus is on enhancing communication skills, social interaction, and adaptive functioning through personalized therapeutic plans. We create a compassionate space where children with ASD can develop their unique potential, while also providing parents with the necessary guidance and resources to support their child's growth and integration into society." 
    },
    { 
      icon: <Zap />, 
      title: "ADHD Support", 
      desc: "We offer professional assessment and therapy-based support for children with Attention Deficit Hyperactivity Disorder. Our goal is to improve focus, impulse control, and academic performance through structured behavioral interventions. By teaching children effective coping mechanisms and organizational skills, we help them manage their symptoms more effectively, leading to better outcomes in school and improved relationships with peers and family members." 
    },
    { 
      icon: <Star />, 
      title: "Motivational Counseling", 
      desc: "Our confidence-building sessions are designed to enhance self-esteem, goal-setting skills, and positive thinking in children and teenagers. We help young individuals overcome self-doubt and develop a growth mindset that empowers them to face life's challenges with courage. Through motivational techniques and positive reinforcement, we inspire children to dream big and provide them with the mental resilience needed to achieve their personal and academic goals." 
    },
    { 
      icon: <Brain />, 
      title: "Memory Enhancement Training", 
      desc: "We provide structured cognitive exercises and techniques specifically designed to improve concentration, memory retention, and recall ability. This training is essential for boosting academic performance and helping children manage their study loads more effectively. By strengthening cognitive functions, we help students develop better learning habits, leading to increased confidence in their academic abilities and a more positive attitude toward education and lifelong learning." 
    }
  ];

  return (
    <section id="services" className="py-20 px-4 bg-white/50">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Our Professional Services</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Expert therapeutic interventions designed to support the emotional, behavioral, and academic growth of children in West Bengal.</p>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((s, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[2rem] text-center flex flex-col group transition-all"
          >
            <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
              {s.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{s.desc}</p>
            <button className="w-full py-3 bg-brand-primary/10 text-brand-primary rounded-xl font-bold hover:bg-brand-primary hover:text-white transition-all">
              Book Session
            </button>
          </motion.div>
        ))}
      </div>

      {/* Combined CTA Section */}
      <div className="max-w-5xl mx-auto mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-12 rounded-[3rem] text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Book a Consultation Today – Give Your Child the Right Support.</h2>
            <p className="text-slate-600 mb-10 max-w-2xl mx-auto">Take the first step towards your child's well-being. Our experts are here to guide you and your family through every challenge.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/30 hover:scale-105 transition-all"
              >
                Book Appointment Now
              </button>
              <a 
                href="https://wa.me/918926824663" 
                target="_blank" 
                rel="noreferrer"
                className="px-10 py-4 bg-[#25D366] text-white rounded-2xl font-bold shadow-xl shadow-[#25D366]/30 hover:scale-105 flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp Connect
              </a>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-secondary/5 rounded-full translate-x-1/3 translate-y-1/3" />
        </motion.div>
      </div>
    </section>
  );
};

const WhatsAppButton = () => (
  <a 
    href="https://wa.me/918926824663" 
    target="_blank" 
    rel="noreferrer"
    className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
  >
    <MessageCircle className="w-8 h-8" />
  </a>
);

const ServingArea = () => (
  <section className="py-12 bg-brand-mint/30">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-3 glass px-6 py-3 rounded-2xl depth-1"
      >
        <MapPin className="text-brand-primary w-5 h-5" />
        <span className="font-bold text-slate-700">Serving Families in Habra and across West Bengal.</span>
      </motion.div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-20 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-slate-500">We're here to help. Reach out to us for any queries or to book a session.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass p-8 md:p-12 rounded-[2.5rem] space-y-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-blue/20">
              <MapPin className="text-brand-primary w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Address</h4>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Shyamaprasad+Road,+Habra,+West+Bengal+743263" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-600 hover:text-brand-primary transition-colors leading-relaxed"
              >
                Shyamaprasad Road<br />
                Habra, West Bengal<br />
                India – 743263
              </a>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-brand-mint rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-mint/20">
              <Phone className="text-brand-secondary w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Phone</h4>
              <p className="text-slate-600">+91 89268 24663</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-brand-peach rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-peach/20">
              <MessageCircle className="text-brand-accent w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">WhatsApp</h4>
              <a href="https://wa.me/918926824663" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-brand-primary transition-colors">
                Quick Connect on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[2.5rem] overflow-hidden h-[450px] depth-2"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14704.83988484437!2d88.6256914!3d22.831742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8997e55555555%3A0x5555555555555555!2sHabra%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="ভোরের আলো Location"
          ></iframe>
        </motion.div>
      </div>
    </div>
  </section>
);

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const slots = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    // In a real app, this would send a request to the backend
  };

  if (isBooked) {
    return (
      <section id="book" className="py-20 px-4 bg-brand-mint/20">
        <div className="max-w-2xl mx-auto glass p-12 text-center rounded-[3rem]">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Request Received!</h2>
          <p className="text-slate-600 mb-8">
            Thank you for reaching out. We have received your appointment request for 
            <span className="font-bold text-slate-900"> {format(selectedDate!, 'MMMM d, yyyy')}</span> at 
            <span className="font-bold text-slate-900"> {timeSlot}</span>. 
            Our team will call you shortly to confirm.
          </p>
          <button 
            onClick={() => setIsBooked(false)}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Book Another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="glass p-10 rounded-[3rem]">
          <h2 className="text-3xl font-bold mb-6">Schedule a Consultation</h2>
          <p className="text-slate-500 mb-8">Select a preferred date and time for your child's first session. We offer both online and in-person consultations.</p>
          
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Select Date</label>
              <input 
                type="date" 
                className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary"
                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Available Slots</label>
              <div className="grid grid-cols-3 gap-3">
                {slots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`p-3 rounded-xl text-xs font-bold transition-all border ${timeSlot === slot ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-brand-primary'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={!timeSlot || !selectedDate}
              className="w-full py-4 bg-brand-secondary text-white rounded-2xl font-bold shadow-lg shadow-brand-secondary/20 hover:opacity-90 transition-all disabled:opacity-50"
            >
              Request Appointment
            </button>
          </form>
        </div>

        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-blue rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-mint rounded-full blur-3xl opacity-50" />
            <div className="glass p-8 rounded-[2rem] relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-mint rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold">Flexible Scheduling</h4>
                  <p className="text-xs text-slate-500">Mon - Sat: 10 AM - 7 PM</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/50 rounded-xl border border-white/20">
                  <p className="text-sm font-bold mb-1">In-Person Session</p>
                  <p className="text-xs text-slate-500">Habra Clinic, Shyamaprasad Road</p>
                </div>
                <div className="p-4 bg-white/50 rounded-xl border border-white/20">
                  <p className="text-sm font-bold mb-1">Online Consultation</p>
                  <p className="text-xs text-slate-500">Secure Video Call (Google Meet/Zoom)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DataPrivacy = () => (
  <section className="py-20 px-4 bg-brand-blue/10">
    <div className="max-w-4xl mx-auto text-center">
      <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-6">
        <Shield className="w-8 h-8 text-brand-primary" />
      </div>
      <h2 className="text-3xl font-bold mb-6">Your Privacy is Our Priority</h2>
      <p className="text-slate-600 leading-relaxed mb-8">
        At ভোরের আলো, we adhere to strict confidentiality protocols. All client data, case histories, 
        and session notes are stored securely and are only accessible by authorized clinical staff. 
        We do not share your information with third parties without explicit consent, except as 
        required by law in emergency situations.
      </p>
      <div className="grid md:grid-cols-3 gap-6 text-left">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" /> Secure Storage
          </h4>
          <p className="text-xs text-slate-500">Encrypted digital records and restricted physical access.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" /> Confidentiality
          </h4>
          <p className="text-xs text-slate-500">Strict non-disclosure agreements for all staff members.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Consent Based
          </h4>
          <p className="text-xs text-slate-500">You control how your data is used and shared.</p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-900 text-white py-20 px-4">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="text-brand-primary w-8 h-8" />
          <span className="text-2xl font-bold">ভোরের আলো</span>
        </div>
        <p className="text-slate-400 max-w-md mb-4">
          Dedicated to providing the highest quality mental health support for children in West Bengal. Our mission is to empower the next generation.
        </p>
        <p className="text-slate-500 text-sm mb-8 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Shyamaprasad Road, Habra, WB – 743263
        </p>
        <div className="flex gap-4">
          <a 
            href="https://www.facebook.com/profile.php?id=61581538120217" 
            target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-primary transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="https://www.youtube.com/@voreralo2025" 
            target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-primary transition-colors"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a 
            href="https://www.instagram.com/bhorer_alo_25/" 
            target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-6">Quick Links</h4>
        <ul className="space-y-4 text-slate-400">
          <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
          <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Emergency</h4>
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <p className="text-red-400 font-bold mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> 24/7 Helpline
          </p>
          <p className="text-xl font-bold">+91 89268 24663</p>
          <p className="text-xs text-slate-500 mt-2">In case of immediate danger, please call local emergency services.</p>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
      &copy; {new Date().getFullYear()} ভোরের আলো. All rights reserved. Designed for West Bengal.
    </div>
  </footer>
);

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (user: any) => void }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ clientId: '', mobile: '', username: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isAdmin ? '/api/admin/login' : '/api/client/login';
    const body = isAdmin 
      ? { username: formData.username, password: formData.password }
      : { clientId: isRegistering ? null : formData.clientId, mobile: formData.mobile, name: formData.name };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        onLogin(isAdmin ? data.user : { ...data.client, role: 'client' });
        onClose();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass w-full max-w-md rounded-[2.5rem] overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {isAdmin ? 'Admin Portal' : (isRegistering ? 'New Client' : 'Client Login')}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button 
              onClick={() => { setIsAdmin(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isAdmin ? 'bg-white shadow-sm' : 'text-slate-500'}`}
            >
              Client
            </button>
            <button 
              onClick={() => { setIsAdmin(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isAdmin ? 'bg-white shadow-sm' : 'text-slate-500'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdmin ? (
              <>
                <input 
                  type="text" placeholder="Username" required
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none"
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                />
                <input 
                  type="password" placeholder="Password" required
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </>
            ) : (
              <>
                {isRegistering && (
                  <input 
                    type="text" placeholder="Full Name" required
                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                )}
                {!isRegistering && (
                  <input 
                    type="text" placeholder="Client ID (e.g. A7K9P2)" required
                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none"
                    value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}
                  />
                )}
                <input 
                  type="tel" placeholder="Mobile Number" required
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none"
                  value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                />
              </>
            )}

            {error && <p className="text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}

            <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all">
              {isAdmin ? 'Login as Admin' : (isRegistering ? 'Register & Login' : 'Access Records')}
            </button>
          </form>

          {!isAdmin && (
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full mt-6 text-sm text-slate-500 hover:text-brand-primary font-medium"
            >
              {isRegistering ? 'Already have a Client ID? Login' : 'First time? Register here'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const IntakeFormView = ({ client, onComplete }: { client: any, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IntakeForm>({
    basic_info: { name: client.name, age: '', dob: '', gender: 'Male', occupation: '', residence: 'Urban', address: '' },
    personal_social: { marital: 'Single', tongue: '', religion: '', family_type: 'Nuclear', members: '', status: 'Middle' },
    referral_info: { source: 'Self', reason: '' },
    informant_details: { name: '', relation: '', duration: '', reliability: 'Yes' },
    presenting_concerns: '',
    duration_progress: { duration: '', course: 'Gradual' },
    additional_notes: '',
    declaration: false,
    signature: ''
  });

  const saveForm = async () => {
    const res = await fetch('/api/intake/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: client.client_id, ...formData, status: 'submitted' })
    });
    if (res.ok) {
      alert('Form submitted successfully!');
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="glass rounded-[2.5rem] p-8 md:p-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Client Intake Form</h2>
            <p className="text-slate-500">Please provide accurate details for effective counseling.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client ID</span>
            <p className="text-xl font-mono font-bold text-brand-primary">{client.client_id}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-all ${step >= s ? 'bg-brand-primary' : 'bg-slate-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><User className="text-brand-primary" /> Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Full Name</label>
                <input type="text" className="w-full p-4 glass rounded-xl" value={formData.basic_info.name} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Age</label>
                <input type="number" className="w-full p-4 glass rounded-xl" value={formData.basic_info.age} onChange={e => setFormData({...formData, basic_info: {...formData.basic_info, age: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Date of Birth</label>
                <input type="date" className="w-full p-4 glass rounded-xl" value={formData.basic_info.dob} onChange={e => setFormData({...formData, basic_info: {...formData.basic_info, dob: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Gender</label>
                <select className="w-full p-4 glass rounded-xl" value={formData.basic_info.gender} onChange={e => setFormData({...formData, basic_info: {...formData.basic_info, gender: e.target.value}})}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-500">Address</label>
                <textarea className="w-full p-4 glass rounded-xl" rows={3} value={formData.basic_info.address} onChange={e => setFormData({...formData, basic_info: {...formData.basic_info, address: e.target.value}})} />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Users className="text-brand-primary" /> Personal & Social Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Marital Status</label>
                <select className="w-full p-4 glass rounded-xl" value={formData.personal_social.marital} onChange={e => setFormData({...formData, personal_social: {...formData.personal_social, marital: e.target.value}})}>
                  <option>Single</option><option>Married</option><option>Separated</option><option>Divorced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Mother Tongue</label>
                <input type="text" className="w-full p-4 glass rounded-xl" value={formData.personal_social.tongue} onChange={e => setFormData({...formData, personal_social: {...formData.personal_social, tongue: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Family Type</label>
                <select className="w-full p-4 glass rounded-xl" value={formData.personal_social.family_type} onChange={e => setFormData({...formData, personal_social: {...formData.personal_social, family_type: e.target.value}})}>
                  <option>Nuclear</option><option>Joint</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Socio-Economic Status</label>
                <select className="w-full p-4 glass rounded-xl" value={formData.personal_social.status} onChange={e => setFormData({...formData, personal_social: {...formData.personal_social, status: e.target.value}})}>
                  <option>Lower</option><option>Middle</option><option>Upper</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><ClipboardList className="text-brand-primary" /> Referral & Concerns</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">Referral Source</label>
                  <select className="w-full p-4 glass rounded-xl" value={formData.referral_info.source} onChange={e => setFormData({...formData, referral_info: {...formData.referral_info, source: e.target.value}})}>
                    <option>Self</option><option>Parent</option><option>Teacher</option><option>Doctor</option><option>School</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">Reason for Referral</label>
                  <input type="text" className="w-full p-4 glass rounded-xl" value={formData.referral_info.reason} onChange={e => setFormData({...formData, referral_info: {...formData.referral_info, reason: e.target.value}})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Presenting Concerns (Complaints)</label>
                <textarea className="w-full p-4 glass rounded-xl" rows={5} value={formData.presenting_concerns} onChange={e => setFormData({...formData, presenting_concerns: e.target.value})} />
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Clock className="text-brand-primary" /> Duration & History</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Duration of Complaints</label>
                <input type="text" className="w-full p-4 glass rounded-xl" value={formData.duration_progress.duration} onChange={e => setFormData({...formData, duration_progress: {...formData.duration_progress, duration: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Course</label>
                <select className="w-full p-4 glass rounded-xl" value={formData.duration_progress.course} onChange={e => setFormData({...formData, duration_progress: {...formData.duration_progress, course: e.target.value}})}>
                  <option>Gradual</option><option>Sudden</option><option>Progressive</option><option>Fluctuating</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-500">Additional Notes</label>
                <textarea className="w-full p-4 glass rounded-xl" rows={4} value={formData.additional_notes} onChange={e => setFormData({...formData, additional_notes: e.target.value})} />
              </div>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="text-brand-primary" /> Declaration & Signature</h3>
            <div className="p-6 bg-brand-mint/50 rounded-2xl border border-brand-secondary/20">
              <label className="flex items-start gap-4 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5 rounded" checked={formData.declaration} onChange={e => setFormData({...formData, declaration: e.target.checked})} />
                <span className="text-sm text-slate-700 font-medium">I confirm that the above information is true and correct to the best of my knowledge. I understand that this information will be kept confidential.</span>
              </label>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-500">Digital Signature (Type your full name)</label>
              <input type="text" className="w-full p-6 glass rounded-2xl text-2xl font-serif italic" placeholder="Your Signature" value={formData.signature} onChange={e => setFormData({...formData, signature: e.target.value})} />
            </div>
          </motion.div>
        )}

        <div className="flex justify-between mt-12">
          <button 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-8 py-3 glass rounded-xl font-bold disabled:opacity-30"
          >
            Back
          </button>
          {step < 5 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20"
            >
              Next Step
            </button>
          ) : (
            <button 
              disabled={!formData.declaration || !formData.signature}
              onClick={saveForm}
              className="px-8 py-3 bg-brand-secondary text-white rounded-xl font-bold shadow-lg shadow-brand-secondary/20 disabled:opacity-50"
            >
              Submit Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await fetch('/api/admin/clients');
    const data = await res.json();
    setClients(data);
    setLoading(false);
  };

  const viewClient = async (clientId: string) => {
    const res = await fetch(`/api/admin/client/${clientId}`);
    const data = await res.json();
    setSelectedClient(data);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditData({ ...selectedClient.form });
    setIsEditing(true);
  };

  const saveEdit = async () => {
    try {
      // Clean editData to avoid sending system fields
      const { id, created_at, updated_at, client_id, ...cleanData } = editData;
      
      const res = await fetch('/api/admin/intake/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id: id, ...cleanData })
      });
      const data = await res.json();
      if (data.success) {
        alert('Form updated and published successfully!');
        setIsEditing(false);
        viewClient(selectedClient.client.client_id);
      } else {
        alert('Error: ' + (data.message || 'Failed to update form'));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert('Error updating form. Please check console for details.');
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Case_History_${selectedClient.client.client_id}.pdf`);
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.client_id.toLowerCase().includes(search.toLowerCase());
    const matchesDate = !filterDate || c.created_at.startsWith(filterDate);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar: Client List */}
        <div className="glass rounded-[2rem] p-6 h-[calc(100vh-200px)] flex flex-col">
          <div className="mb-6 space-y-4">
            <h2 className="text-xl font-bold">Client Directory</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" placeholder="Search ID or Name..." 
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <input 
                type="date" 
                className="w-full px-4 py-2 bg-white/50 border border-slate-100 rounded-xl text-sm outline-none"
                value={filterDate} onChange={e => setFilterDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredClients.map(c => (
              <button 
                key={c.client_id}
                onClick={() => viewClient(c.client_id)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${selectedClient?.client?.client_id === c.client_id ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-brand-blue/50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm truncate pr-2">{c.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${selectedClient?.client?.client_id === c.client_id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                    {c.client_id}
                  </span>
                </div>
                <p className={`text-xs ${selectedClient?.client?.client_id === c.client_id ? 'text-white/70' : 'text-slate-400'}`}>
                  {c.form_id ? `Form: ${format(new Date(c.form_date!), 'MMM d, yyyy')}` : 'No Form Submitted'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main: Client Details */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Case History</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={downloadPDF}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                </div>
              </div>

              <div id="pdf-content" className="glass rounded-[2rem] p-10 bg-white">
                <div className="border-b-2 border-slate-100 pb-8 mb-8 flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-brand-primary mb-2">ভোরের আলো</h1>
                    <p className="text-sm text-slate-500">Professional Child Counseling & Mental Health Services</p>
                    <p className="text-xs text-slate-400 mt-1">West Bengal, India | +91 89268 24663</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client ID</p>
                    <p className="text-2xl font-mono font-bold">{selectedClient.client.client_id}</p>
                  </div>
                </div>

                {!selectedClient.form ? (
                  <div className="py-20 text-center text-slate-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Intake form has not been submitted by the client yet.</p>
                  </div>
                ) : isEditing ? (
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-primary pl-4 mb-4">Edit Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" placeholder="Name" className="p-3 border rounded-xl"
                          value={editData.basic_info.name} onChange={e => setEditData({...editData, basic_info: {...editData.basic_info, name: e.target.value}})}
                        />
                        <input 
                          type="text" placeholder="Age" className="p-3 border rounded-xl"
                          value={editData.basic_info.age} onChange={e => setEditData({...editData, basic_info: {...editData.basic_info, age: e.target.value}})}
                        />
                        <textarea 
                          placeholder="Address" className="p-3 border rounded-xl col-span-2"
                          value={editData.basic_info.address} onChange={e => setEditData({...editData, basic_info: {...editData.basic_info, address: e.target.value}})}
                        />
                      </div>
                    </section>
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-primary pl-4 mb-4">Edit Presenting Concerns</h3>
                      <textarea 
                        className="w-full p-4 border rounded-xl h-32"
                        value={editData.presenting_concerns} onChange={e => setEditData({...editData, presenting_concerns: e.target.value})}
                      />
                    </section>
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-primary pl-4 mb-4">Additional Notes</h3>
                      <textarea 
                        className="w-full p-4 border rounded-xl h-32"
                        value={editData.additional_notes} onChange={e => setEditData({...editData, additional_notes: e.target.value})}
                      />
                    </section>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-primary pl-4 mb-4">A. Basic Information</h3>
                      <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <p><span className="font-bold text-slate-500">Name:</span> {selectedClient.form.basic_info.name}</p>
                        <p><span className="font-bold text-slate-500">Age:</span> {selectedClient.form.basic_info.age}</p>
                        <p><span className="font-bold text-slate-500">DOB:</span> {selectedClient.form.basic_info.dob}</p>
                        <p><span className="font-bold text-slate-500">Gender:</span> {selectedClient.form.basic_info.gender}</p>
                        <p className="col-span-2"><span className="font-bold text-slate-500">Address:</span> {selectedClient.form.basic_info.address}</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-primary pl-4 mb-4">B. Personal & Social Details</h3>
                      <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <p><span className="font-bold text-slate-500">Marital Status:</span> {selectedClient.form.personal_social.marital}</p>
                        <p><span className="font-bold text-slate-500">Mother Tongue:</span> {selectedClient.form.personal_social.tongue}</p>
                        <p><span className="font-bold text-slate-500">Family Type:</span> {selectedClient.form.personal_social.family_type}</p>
                        <p><span className="font-bold text-slate-500">Socio-Economic:</span> {selectedClient.form.personal_social.status}</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-primary pl-4 mb-4">C. Referral Information</h3>
                      <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <p><span className="font-bold text-slate-500">Source:</span> {selectedClient.form.referral_info.source}</p>
                        <p><span className="font-bold text-slate-500">Reason:</span> {selectedClient.form.referral_info.reason}</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-primary pl-4 mb-4">E. Presenting Concerns</h3>
                      <div className="p-4 bg-slate-50 rounded-xl text-sm leading-relaxed italic">
                        "{selectedClient.form.presenting_concerns}"
                      </div>
                    </section>

                    <div className="pt-12 grid grid-cols-2 gap-12">
                      <div className="text-center">
                        <p className="text-2xl font-serif italic mb-2">{selectedClient.form.signature}</p>
                        <div className="border-t border-slate-200 pt-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Client / Guardian Signature</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-serif italic mb-2 text-brand-primary">ভোরের আলো Admin</p>
                        <div className="border-t border-slate-200 pt-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Authorized Signature</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                {!isEditing && selectedClient.form && (
                  <button 
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-xl font-bold hover:opacity-90 shadow-lg shadow-brand-primary/20 transition-all"
                  >
                    Edit Form
                  </button>
                )}
                {isEditing && (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-3 glass rounded-xl font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveEdit}
                      className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:opacity-90 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Save & Publish
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full glass rounded-[2rem] flex flex-col items-center justify-center text-slate-400 p-12 text-center">
              <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-brand-primary opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Client</h3>
              <p className="max-w-xs">Choose a client from the directory to view their full case history and intake details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [view, setView] = useState<'home' | 'intake' | 'admin'>('home');
  const [clientForm, setClientForm] = useState<any>(null);

  const fetchClientForm = async (clientId: string) => {
    try {
      // Use a timestamp to bypass any potential browser caching
      const res = await fetch(`/api/admin/client/${clientId}?t=${Date.now()}`);
      const data = await res.json();
      setClientForm(data.form);
      setView('intake');
    } catch (err) {
      console.error("Error fetching client form:", err);
      setView('intake');
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') setView('admin');
      else {
        fetchClientForm(user.client_id);
      }
    } else {
      setView('home');
      setClientForm(null);
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={handleLogout} onLoginClick={() => setIsLoginOpen(true)} />
      
      <main>
        {view === 'home' && (
          <>
            <Hero />
            <ServingArea />
            <Services />
            <BookAppointment />
            <section id="about" className="py-20 px-4">
              <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="relative">
                    <img src="https://picsum.photos/seed/about/600/400" className="rounded-[2rem] depth-1" alt="About" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-8 -right-8 glass p-6 rounded-2xl hidden md:block">
                      <p className="text-3xl font-bold text-brand-primary">10+</p>
                      <p className="text-xs font-bold text-slate-500 uppercase">Years Experience</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-4xl font-bold mb-6">Why Choose ভোরের আলো?</h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    We believe that every child has the potential to bloom. Our approach is rooted in evidence-based practices, combined with a warm, empathetic environment that makes children feel safe and understood.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Expert Psychologists from West Bengal",
                      "Child-Friendly Therapeutic Environment",
                      "Personalized Care Plans",
                      "Online & Offline Session Flexibility"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 font-semibold">
                        <div className="w-6 h-6 bg-brand-mint rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-brand-secondary" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
            <Contact />
            <DataPrivacy />
          </>
        )}

        {view === 'intake' && user && (
          clientForm ? (
            <FormOverview data={clientForm} />
          ) : (
            <IntakeFormView client={user} onComplete={() => fetchClientForm(user.client_id)} />
          )
        )}

        {view === 'admin' && user?.role === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <Footer />
      <WhatsAppButton />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={setUser} 
      />
    </div>
  );
}
