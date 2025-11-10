import { useEffect, useState } from 'react'
import { CalendarDays, Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.15),transparent_50%)]" />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Smash your game at our Pickleball Club
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Premium indoor/outdoor courts, easy online booking, lessons and leagues for all levels.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#booking" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
            Book a Court
          </a>
          <a href="#contact" className="px-6 py-3 rounded-lg bg-white shadow font-semibold hover:shadow-md transition-shadow">
            Ask a Question
          </a>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const items = [
    { title: '4 Indoor + 4 Outdoor Courts', icon: CheckCircle2, desc: 'Pro-surface, tournament lines, night lighting' },
    { title: 'Open Play & Leagues', icon: CalendarDays, desc: 'Beginner to advanced — meet your match' },
    { title: 'Coaching & Clinics', icon: Clock, desc: 'Certified coaches, private & group sessions' },
  ]
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
      {items.map(({title, icon:Icon, desc}) => (
        <div key={title} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
          <Icon className="h-8 w-8 text-blue-600" />
          <h3 className="mt-4 text-xl font-semibold">{title}</h3>
          <p className="text-gray-600 mt-2">{desc}</p>
        </div>
      ))}
    </section>
  )
}

function Availability() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [loading, setLoading] = useState(false)
  const [slots, setSlots] = useState([])

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date })
      })
      const data = await res.json()
      setSlots(data.slots || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAvailability() }, [])

  return (
    <section id="booking" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold">Check Availability</h2>
        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded-lg px-3 py-2"/>
          <button onClick={fetchAvailability} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map(s => (
            <div key={s.time_slot} className={`rounded-lg p-4 border ${s.booked ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}>
              <div className="font-semibold">{s.time_slot}</div>
              <button disabled={s.booked} onClick={()=>window.location.hash='#quick-book'} className={`mt-2 w-full px-3 py-2 rounded ${s.booked ? 'bg-gray-200' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                {s.booked ? 'Booked' : 'Book'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuickBook() {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    time_slot: '18:00-19:00',
    court_id: 'court-1',
    full_name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [status, setStatus] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setStatus('Submitting...')
    try {
      const res = await fetch(`${API_BASE}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if(res.status === 409){
        setStatus('That slot just got booked. Please pick another one.')
        return
      }
      const data = await res.json()
      if (data.ok) setStatus('Booking confirmed! Check your email for details.')
      else setStatus('Could not create booking, please try again.')
    } catch (e) {
      setStatus('Error submitting booking.')
    }
  }

  return (
    <section id="quick-book" className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold">Quick Book</h2>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-2">
              <span>Date</span>
              <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="border rounded-lg px-3 py-2" required/>
            </label>
            <label className="grid gap-2">
              <span>Time</span>
              <input value={form.time_slot} onChange={e=>setForm({...form, time_slot:e.target.value})} className="border rounded-lg px-3 py-2" required/>
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-2">
              <span>Full name</span>
              <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} className="border rounded-lg px-3 py-2" required/>
            </label>
            <label className="grid gap-2">
              <span>Email</span>
              <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="border rounded-lg px-3 py-2" required/>
            </label>
          </div>
          <label className="grid gap-2">
            <span>Phone</span>
            <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="border rounded-lg px-3 py-2"/>
          </label>
          <label className="grid gap-2">
            <span>Notes</span>
            <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className="border rounded-lg px-3 py-2" rows="3"/>
          </label>
          <button className="mt-2 px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
            Book Now
          </button>
          {status && <p className="text-sm text-gray-700">{status}</p>}
        </form>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ full_name: '', email: '', subject: '', message: '', phone: '' })
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSent(false)
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    const data = await res.json().catch(()=>({}))
    if (res.ok && data.ok) setSent(true)
  }

  return (
    <section id="contact" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Get in touch</h2>
          <p className="text-gray-600 mt-2">Questions about bookings, coaching or events? We’re here to help.</p>
          <div className="mt-6 space-y-3 text-gray-700">
            <p className="flex items-center gap-2"><Phone className="h-5 w-5"/> (555) 123-4567</p>
            <p className="flex items-center gap-2"><Mail className="h-5 w-5"/> hello@pickleclub.com</p>
            <p className="flex items-center gap-2"><MapPin className="h-5 w-5"/> 123 Rally Rd, Smash City</p>
          </div>
        </div>
        <form onSubmit={submit} className="bg-white rounded-xl p-6 shadow grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} className="border rounded-lg px-3 py-2" required/>
            <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="border rounded-lg px-3 py-2" required/>
          </div>
          <input placeholder="Subject" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} className="border rounded-lg px-3 py-2" required/>
          <textarea placeholder="Message" rows="4" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} className="border rounded-lg px-3 py-2"/>
          <button className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Send</button>
          {sent && <p className="text-green-700">Thanks! We’ll get back to you shortly.</p>}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 text-center text-gray-500">© {new Date().getFullYear()} Pickleball Club. All rights reserved.</footer>
  )
}

export default function App(){
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Hero />
      <Features />
      <Availability />
      <QuickBook />
      <Contact />
      <Footer />
    </div>
  )
}
