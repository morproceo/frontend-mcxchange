import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  CheckCircle,
  Search,
  FileCheck,
  UserCheck,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  Clock,
  Target,
  Award,
  Briefcase
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'

const RecruitingServicesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    driversNeeded: '',
    driverType: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const services = [
    {
      icon: Search,
      title: 'Driver Sourcing',
      description: 'We actively source qualified CDL drivers through job boards, social media, referral networks, and our proprietary database of pre-screened candidates.',
      features: ['Multi-channel recruitment', 'Targeted advertising', 'Database of 50,000+ drivers']
    },
    {
      icon: FileCheck,
      title: 'Screening & Verification',
      description: 'Comprehensive background checks, MVR reviews, employment verification, and drug screening to ensure you hire safe, qualified drivers.',
      features: ['Background checks', 'MVR verification', 'Drug testing coordination']
    },
    {
      icon: UserCheck,
      title: 'Onboarding Support',
      description: 'We handle the paperwork and orientation process so new drivers can get on the road faster while staying compliant.',
      features: ['DQ file setup', 'Orientation coordination', 'Equipment training']
    },
    {
      icon: Shield,
      title: 'Retention Programs',
      description: 'Reduce turnover with our driver retention strategies including satisfaction surveys, recognition programs, and exit interviews.',
      features: ['Driver satisfaction surveys', 'Recognition programs', 'Exit interviews']
    }
  ]

  const driverTypes = [
    'OTR Drivers',
    'Regional Drivers',
    'Local Drivers',
    'Owner Operators',
    'Team Drivers',
    'Hazmat Drivers',
    'Tanker Drivers',
    'Flatbed Drivers'
  ]

  const stats = [
    { value: '5,000+', label: 'Drivers placed' },
    { value: '14', label: 'Day avg. time to hire' },
    { value: '92%', label: '90-day retention rate' },
    { value: '50K+', label: 'Driver database' }
  ]

  const process = [
    { step: '01', title: 'Consultation', desc: 'We learn about your company, lanes, pay, and ideal driver profile.' },
    { step: '02', title: 'Sourcing', desc: 'We actively recruit from multiple channels to find qualified candidates.' },
    { step: '03', title: 'Screening', desc: 'Candidates are pre-screened, verified, and presented to you.' },
    { step: '04', title: 'Onboarding', desc: 'We assist with paperwork, orientation, and getting drivers road-ready.' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-100 mb-8">
              <Users className="w-10 h-10 text-gray-900" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gray-900">
              Recruiting Services
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find qualified CDL drivers faster with our full-service recruiting solutions.
              We source, screen, and onboard so you can focus on growing your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="min-w-[200px]" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Start Hiring Drivers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <a href="tel:+18778141807">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (877) 814-1807
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Full-Service Driver Recruiting</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We handle every step of the recruiting process so you can focus on running your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <service.icon className="w-7 h-7 text-gray-700" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-500 mb-6">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Driver Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900">We Recruit All Driver Types</h2>
              <p className="text-xl text-gray-500 mb-8">
                Whether you need OTR drivers, local drivers, owner operators, or specialized drivers, we have the expertise and network to find them.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {driverTypes.map((type) => (
                  <div key={type} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0">
                <div className="text-center py-8">
                  <Target className="w-16 h-16 text-white mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-2">Targeted Recruiting</h3>
                  <p className="text-gray-300 mb-6">We don't just post ads. We actively hunt for the drivers you need.</p>
                  <div className="text-5xl font-bold text-emerald-400 mb-2">14 Days</div>
                  <p className="text-gray-400">Average time from job order to qualified candidate</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Recruiting Process</h2>
          <p className="text-xl text-gray-500">From job order to driver onboarding</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {process.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full text-center">
                <div className="text-6xl font-bold text-gray-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Carriers Choose Us</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              We're not just recruiters. We're your partner in building a world-class driver team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Fast Results', desc: 'Start receiving qualified candidates within days, not weeks. Our average time to hire is just 14 days.' },
              { icon: Award, title: 'Quality Drivers', desc: 'Every candidate is pre-screened and verified. We only present drivers who meet your specific criteria.' },
              { icon: Briefcase, title: 'Industry Expertise', desc: 'Our recruiters specialize in trucking. We understand your challenges and speak your language.' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Ready to Hire Drivers?</h2>
            <p className="text-xl text-gray-500">
              Tell us about your driver needs and we'll create a customized recruiting plan.
            </p>
          </motion.div>

          <Card>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Thank You!</h3>
                <p className="text-gray-500">A recruiting specialist will contact you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Company Name"
                    placeholder="ABC Trucking LLC"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Number of Drivers Needed"
                    type="number"
                    placeholder="5"
                    value={formData.driversNeeded}
                    onChange={(e) => setFormData({ ...formData, driversNeeded: e.target.value })}
                  />
                  <Select
                    label="Driver Type"
                    value={formData.driverType}
                    onChange={(e) => setFormData({ ...formData, driverType: e.target.value })}
                    options={[
                      { value: '', label: 'Select driver type' },
                      { value: 'otr', label: 'OTR Drivers' },
                      { value: 'regional', label: 'Regional Drivers' },
                      { value: 'local', label: 'Local Drivers' },
                      { value: 'owner-op', label: 'Owner Operators' },
                      { value: 'team', label: 'Team Drivers' },
                      { value: 'specialized', label: 'Specialized (Hazmat, Tanker, etc.)' }
                    ]}
                  />
                </div>

                <Textarea
                  label="Additional Details"
                  placeholder="Tell us about your lanes, pay structure, home time, and ideal driver profile..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <Button type="submit" fullWidth size="lg">
                  Get a Recruiting Plan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-0">
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Stop Struggling to Find Drivers</h2>
            <p className="text-xl text-gray-300 mb-8">
              Let our expert recruiters fill your trucks while you focus on your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+18778141807">
                <Button size="lg" className="min-w-[200px] bg-white text-gray-900 hover:bg-gray-100">
                  <Phone className="w-5 h-5 mr-2" />
                  (877) 814-1807
                </Button>
              </a>

              <a href="mailto:recruiting@mcexchange.com">
                <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white/10">
                  <Mail className="w-5 h-5 mr-2" />
                  recruiting@mcexchange.com
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default RecruitingServicesPage
