import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from './supabase'
import {
  Search, Plus, ArrowRight, MapPin, CalendarDays, Clock3, Menu, X,
  UploadCloud, Image as ImageIcon, ChevronLeft, Mail, Phone, Instagram,
  PackageSearch, Trash2, LogOut, UserRound, CheckCircle2, LoaderCircle
} from 'lucide-react'

const CATEGORIES = {
  'Electronics & Tech':'💻','Student ID & Cards':'🪪','Keys & Fobs':'🔑',
  'Bags & Packs':'🎒','Water Bottles':'🧴','Jackets & Wear':'🧥',
  'Textbooks & Notes':'📚','Other Items':'📦'
}
const ZONES = ['Library (Main)','Student Union','Science Complex','Gym / Rec','Dining Hall','North Quad','Tower 2','Lainnya']
const COLORS = ['Black','Gray/Silver','Blue','Red','White','Multi-colored']
const TIME_RANGES = ['Morning · 8 AM – 12 PM','Afternoon · 12 – 5 PM','Evening · 5 – 9 PM','Night · After 9 PM']

function Header({page,setPage,user,onLogout}) {
  const [open,setOpen] = useState(false)
  const links = [['Beranda','home'],['Laporan','reports'],['Kontak','contact']]
  return <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f8f8ed]/95 shadow-sm backdrop-blur">
    <div className="mx-auto flex h-[78px] max-w-[1320px] items-center justify-between px-6 md:px-10">
      <button onClick={()=>setPage('home')} className="text-[25px] font-extrabold tracking-tight text-black">FoundIt</button>
      <nav className="hidden items-center gap-12 md:flex">{links.map(([n,p])=><button key={p} onClick={()=>setPage(p)} className={`nav-link ${page===p?'active':''}`}>{n}</button>)}</nav>
      <div className="hidden items-center gap-3 md:flex">
        {user ? <><span className="max-w-40 truncate text-xs text-gray-500">{user.email}</span><button onClick={onLogout} className="rounded-lg bg-[#241b16] px-5 py-3 text-sm font-semibold text-white">Log out</button></> : <button onClick={()=>setPage('auth')} className="rounded-lg bg-[#241b16] px-7 py-3 text-sm font-semibold text-white">Sign up</button>}
      </div>
      <button className="md:hidden" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
    </div>
    {open&&<div className="border-t px-6 py-4 md:hidden">{links.map(([n,p])=><button key={p} onClick={()=>{setPage(p);setOpen(false)}} className="block w-full py-3 text-left font-semibold">{n}</button>)}{user?<button onClick={onLogout} className="py-3">Log out</button>:<button onClick={()=>setPage('auth')} className="py-3">Sign up / Log in</button>}</div>}
  </header>
}

function Home({setPage}) {
  return <main className="hero-grid min-h-[calc(100vh-78px)]">
    <section className="flex items-center px-7 py-20 md:px-12 lg:px-20"><div className="max-w-[590px]">
      <p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[#681b28]">Lost & Found · ITS Tower 2</p>
      <h1 className="hero-title text-[48px] font-extrabold leading-[1.08] tracking-[-.045em] text-black md:text-[64px]">Find Your<br/>Lost Belongings</h1>
      <p className="mt-7 max-w-[430px] text-base font-semibold leading-relaxed">Browse the list of found items posted on our website to locate your lost item in the area around ITS Tower 2.</p>
      <button onClick={()=>setPage('reports')} className="mt-9 inline-flex items-center gap-2 font-bold text-[#681b28] hover:gap-4 transition-all">Jelajahi laporan <ArrowRight size={18}/></button>
    </div></section>
    <section className="stripe-panel flex items-center justify-center px-5 py-16 md:px-10">
      <div className="w-full max-w-[540px] rounded-[22px] border border-black/10 bg-white px-7 py-9 shadow-lg md:px-12 md:py-11">
        <h2 className="text-[25px] font-extrabold">Lapor sekarang</h2>
        <p className="mt-5 text-sm leading-relaxed text-gray-600">Temukan barang yang kamu cari atau lapor barang yang kamu temukan dengan mengisi form singkat berikut.</p>
        <button onClick={()=>setPage('form-lost')} className="mt-8 w-full rounded-xl bg-[#681b28] px-5 py-4 font-bold text-white hover:brightness-90">Saya kehilangan barang</button>
        <button onClick={()=>setPage('form-found')} className="mt-4 w-full rounded-xl bg-[#414e65] px-5 py-4 font-bold text-white hover:brightness-90">Saya menemukan barang</button>
      </div>
    </section>
  </main>
}

function Auth({onAuth,setPage}) {
  const [mode,setMode] = useState('login')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')

    try {
      const result = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

      if (result.error) {
        setError(result.error.message)
      } else if (mode === 'register') {
        setError('Pendaftaran berhasil. Jika konfirmasi email aktif, cek inbox email kamu lalu login.')
      } else {
        setPage('home')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat autentikasi.')
    } finally {
      setBusy(false)
    }
  }

  async function forgot() {
    if (!email) {
      setError('Masukkan email terlebih dahulu.')
      return
    }

    setBusy(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      setError(error ? error.message : 'Link reset password telah dikirim ke email kamu.')
    } catch (err) {
      setError(err.message || 'Gagal mengirim link reset password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-78px)] place-items-center px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-7 shadow-lg md:p-9">
        <button
          onClick={() => setPage('home')}
          className="mb-6 text-sm font-semibold text-gray-500 hover:text-[#681b28]"
        >
          ← Kembali ke beranda
        </button>

        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#681b28]">
          FoundIt · ITS Tower 2
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">
          {mode === 'login' ? 'Selamat datang!' : 'Buat akun'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {mode === 'login'
            ? 'Login untuk membuat laporan dan mengelola barang yang kamu laporkan.'
            : 'Daftar menggunakan email untuk mulai menggunakan FoundIt.'}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="field-label">
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="field"
              autoComplete="email"
              required
            />
          </label>

          <label className="field-label">
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="field"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
          </label>

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={forgot}
                disabled={busy}
                className="text-xs font-semibold text-[#681b28] hover:underline disabled:opacity-50"
              >
                Lupa password?
              </button>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm leading-relaxed text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#681b28] px-5 py-4 font-bold text-white hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy
              ? 'Memproses...'
              : mode === 'login'
                ? 'Login'
                : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
            }}
            className="font-bold text-[#681b28] hover:underline"
          >
            {mode === 'login' ? 'Daftar sekarang' : 'Login'}
          </button>
        </p>
      </section>
    </main>
  )
}

function ReportCard({item,userId,onDetail,onResolve,resolving}) {
  const photo=item.foto?.[0]
  return <article className="overflow-hidden rounded-2xl bg-[#e2e5eb] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div className="grid min-h-[190px] grid-cols-[46%_54%]">
      <div className="flex items-center justify-center bg-[#d7d7d7]">{photo?<img src={photo} alt={item.nama} className="h-full w-full object-cover"/>:<div className="flex flex-col items-center gap-2 text-gray-500"><PackageSearch size={30}/><span className="text-xs">Foto Barang</span></div>}</div>
      <div className="flex flex-col p-4">
        <div className="flex items-center justify-between gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.tipe==='hilang'?'bg-[#f2d4c7] text-[#9b4c2c]':'bg-[#d5e8d8] text-[#316342]'}`}>{item.tipe==='hilang'?'Hilang':'Ditemukan'}</span><span className="text-[10px] text-gray-500">{item.tanggal}</span></div>
        <h3 className="mt-3 text-sm font-extrabold">{item.nama}</h3>
        <p className="mt-3 flex gap-1 text-[11px] text-gray-600"><MapPin size={12}/>{item.lokasi}{item.area?`, ${item.area}`:''}</p>
        <button onClick={()=>onDetail(item)} className="mt-auto rounded-lg border border-gray-400 px-3 py-2 text-[11px] font-semibold hover:bg-white">Lihat detail barang</button>
        {item.user_id===userId&&<button disabled={resolving} onClick={()=>onResolve(item.id)} className="mt-2 text-[11px] font-semibold text-[#681b28]">{resolving?'Memproses...':'Tandai selesai'}</button>}
      </div>
    </div>
  </article>
}

function Reports({items,loading,userId,setPage,setSelected,onResolve,resolving}) {
  const [filter,setFilter]=useState(''),[search,setSearch]=useState('')
  const shown=useMemo(()=>items.filter(x=>(!filter||x.tipe===filter)&&`${x.nama} ${x.lokasi} ${x.merek||''}`.toLowerCase().includes(search.toLowerCase())),[items,filter,search])
  return <main className="mx-auto min-h-[calc(100vh-78px)] max-w-[1320px] px-6 py-12 md:px-10 lg:px-16">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#681b28]">Temukan barangmu</p><h1 className="mt-2 text-3xl font-extrabold">Laporan Terbaru</h1></div>
      <div className="flex flex-col gap-3 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama atau lokasi..." className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none sm:w-56"/></div>
      <div className="flex gap-2">{[['','Semua'],['hilang','Hilang'],['ditemukan','Ditemukan']].map(([v,n])=><button key={v} onClick={()=>setFilter(v)} className={`rounded-full border px-4 py-2 text-xs font-semibold ${filter===v?'border-[#1d1b3d] bg-[#1d1b3d] text-white':'border-gray-300 bg-white'}`}>{n}</button>)}</div></div></div>
    {loading?<div className="py-20 text-center text-gray-500"><LoaderCircle className="mx-auto animate-spin"/>Memuat laporan...</div>:shown.length?<div className="mt-9 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">{shown.map(i=><ReportCard key={i.id} item={i} userId={userId} onDetail={x=>{setSelected(x);setPage('detail')}} onResolve={onResolve} resolving={resolving===i.id}/>)}</div>:<div className="mt-16 py-20 text-center"><PackageSearch className="mx-auto text-gray-400" size={42}/><p className="mt-4 font-bold">Laporan tidak ditemukan</p><p className="text-sm text-gray-500">Coba kata kunci atau filter lainnya.</p></div>}
    <button onClick={()=>setPage('form-lost')} className="fixed bottom-7 right-7 flex items-center gap-2 rounded-full bg-[#681b28] px-5 py-4 text-sm font-bold text-white shadow-xl"><Plus size={19}/> Buat laporan</button>
  </main>
}

function ReportForm({type,setPage,onSubmit}) {
  const [step,setStep]=useState(1)
  const [form,setForm]=useState({tipe:type==='found'?'ditemukan':'hilang',kategori:'',nama:'',merek:'',warna:'',ciri:'',files:[],lokasi:'',area:'',hari:'Today',tanggal:'',waktu:'',wa:'',bukti:'',ok:false})
  const [error,setError]=useState(''),[busy,setBusy]=useState(false)
  const fileRef=useRef(null)
  const set=(k,v)=>setForm(old=>({...old,[k]:v}))
  function validate(){if(step===1&&(!form.kategori||!form.nama.trim()))return 'Pilih kategori dan isi nama barang.';if(step===2&&(!form.lokasi.trim()||!form.waktu||(form.hari==='Custom'&&!form.tanggal)))return 'Lengkapi lokasi, tanggal, dan perkiraan waktu.';if(step===3&&form.wa.replace(/\D/g,'').length<9)return 'Masukkan nomor WhatsApp yang valid.';if(step===4&&!form.ok)return 'Mohon setujui pernyataan sebelum mengirim laporan.';return ''}
  async function submit(){const e=validate();if(e)return setError(e);setError('');if(step<4){setStep(step+1);window.scrollTo(0,0);return}setBusy(true);try{await onSubmit(form)}catch(err){setError(err.message||'Gagal mengirim laporan.')}finally{setBusy(false)}}
  const dateValue=form.hari==='Custom'?form.tanggal:new Date(Date.now()-(form.hari==='Yesterday'?86400000:0)).toISOString().slice(0,10)
  return <div className="min-h-[calc(100vh-78px)]">
    <header className="sticky top-[78px] z-10 border-b bg-white/95 backdrop-blur"><div className="mx-auto max-w-3xl px-5 pt-4"><div className="flex items-center gap-3"><button onClick={()=>setPage('home')} className="text-xl">←</button><div className="leading-tight"><b className="text-sm">Form Laporan Barang</b><br/><span className="text-[11px] text-[#681b28]">FoundIt · ITS Tower 2</span></div></div><div className="grid grid-cols-4 gap-2 py-3">{[1,2,3,4].map(n=><i key={n} className={`h-1 rounded ${n<=step?'bg-[#681b28]':'bg-gray-200'}`}/>)}</div></div></header>
    <main className="mx-auto max-w-3xl px-5 py-7 pb-32">
      <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#681b28]">Langkah {step} dari 4</p><h1 className="mt-2 text-3xl font-extrabold">{step===1?'Detail Barang':step===2?'Lokasi & Waktu':step===3?'Kontak & Keamanan':'Periksa Laporan'}</h1></div>
      {step===1&&<div className="space-y-4">
        <div className="flex gap-2"><button onClick={()=>set('tipe','hilang')} className={`rounded-lg px-5 py-3 text-sm font-bold ${form.tipe==='hilang'?'bg-[#681b28] text-white':'bg-white'}`}>Hilang</button><button onClick={()=>set('tipe','ditemukan')} className={`rounded-lg px-5 py-3 text-sm font-bold ${form.tipe==='ditemukan'?'bg-[#414e65] text-white':'bg-white'}`}>Ditemukan</button></div>
        <section className="rounded-2xl border bg-white p-5"><h2 className="mb-4 font-extrabold">Kategori barang *</h2><div className="grid gap-3 sm:grid-cols-2">{Object.entries(CATEGORIES).map(([k,ic])=><button key={k} onClick={()=>set('kategori',k)} className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-semibold ${form.kategori===k?'border-[#681b28] bg-[#fff8f6]':'border-transparent bg-[#f6f6fa]'}`}><span className="grid size-10 place-items-center rounded-lg bg-white text-xl">{ic}</span>{k}</button>)}</div></section>
        <section className="grid gap-4 rounded-2xl border bg-white p-5"><label className="field-label">Nama barang *<input value={form.nama} onChange={e=>set('nama',e.target.value)} placeholder="Contoh: Dompet kulit cokelat" className="field"/></label><label className="field-label">Merek / Model (opsional)<input value={form.merek} onChange={e=>set('merek',e.target.value)} placeholder="Contoh: Apple, Hydro Flask" className="field"/></label><div><p className="mb-3 text-sm font-bold">Warna utama</p><div className="flex flex-wrap gap-2">{COLORS.map(c=><button key={c} onClick={()=>set('warna',c)} className={`rounded-full border px-4 py-2 text-xs ${form.warna===c?'border-[#681b28] bg-[#fff1ed] text-[#681b28]':'bg-white'}`}>{c}</button>)}</div></div><label className="field-label">Ciri-ciri khusus<textarea rows="3" value={form.ciri} onChange={e=>set('ciri',e.target.value)} placeholder="Stiker, goresan, bentuk casing, dan ciri lainnya..." className="field resize-y"/></label></section>
        <section className="rounded-2xl border border-dashed bg-white p-5"><div className="mb-3 flex justify-between text-sm font-bold"><span>Foto barang</span><span className="text-xs font-normal text-gray-500">Maks. 4 foto</span></div><input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e=>set('files',[...e.target.files].slice(0,4))}/><button type="button" onClick={()=>fileRef.current?.click()} className="flex min-h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed bg-[#fafaf8] text-sm hover:border-[#681b28]"><UploadCloud className="mb-2 text-gray-400"/><b>Pilih foto dari perangkat</b><span className="mt-1 text-xs text-gray-500">{form.files.length?`${form.files.length} foto dipilih`:'JPEG atau PNG, maksimal 10 MB per foto'}</span></button>{form.files.length>0&&<div className="mt-3 flex flex-wrap gap-2">{form.files.map((f,i)=><span key={i} className="rounded bg-gray-100 px-3 py-2 text-xs">{f.name}</span>)}</div>}</section>
      </div>}
      {step===2&&<div className="space-y-4"><section className="rounded-2xl border bg-white p-5"><p className="mb-3 text-sm font-bold">Gedung / Zona kampus *</p><div className="flex flex-wrap gap-2">{ZONES.map(z=><button key={z} onClick={()=>set('lokasi',z)} className={`rounded-full border px-4 py-2 text-xs ${form.lokasi===z?'border-blue-500 bg-blue-50 text-blue-700 font-bold':'bg-white'}`}>{z}</button>)}</div><input value={form.lokasi} onChange={e=>set('lokasi',e.target.value)} placeholder="Atau ketik lokasi, misalnya Tower 2" className="field mt-3"/><input value={form.area} onChange={e=>set('area',e.target.value)} placeholder="Area spesifik, ruangan, atau meja (opsional)" className="field"/></section><section className="rounded-2xl border bg-white p-5"><p className="mb-3 text-sm font-bold">{form.tipe==='hilang'?'Kapan barang hilang?':'Kapan barang ditemukan?'} *</p><div className="grid grid-cols-3 gap-2">{['Today','Yesterday','Custom'].map(d=><button key={d} onClick={()=>set('hari',d)} className={`rounded-lg py-3 text-sm font-semibold ${form.hari===d?'bg-blue-100 text-blue-700':'bg-[#f1f2f9]'}`}>{d==='Today'?'Hari ini':d==='Yesterday'?'Kemarin':'Pilih tanggal'}</button>)}</div>{form.hari==='Custom'&&<input type="date" value={form.tanggal} onChange={e=>set('tanggal',e.target.value)} className="field mt-3"/>}<p className="mb-2 mt-5 text-sm font-bold">Perkiraan waktu *</p><div className="grid gap-2 sm:grid-cols-2">{TIME_RANGES.map(t=><button key={t} onClick={()=>set('waktu',t)} className={`rounded-lg p-3 text-left text-sm ${form.waktu===t?'bg-blue-100 ring-2 ring-blue-500':'bg-[#f1f2f9]'}`}>{t}</button>)}</div></section></div>}
      {step===3&&<section className="rounded-2xl border bg-white p-5"><h2 className="mb-4 font-extrabold">Kontak & Keamanan</h2><label className="field-label">Nomor WhatsApp *<input type="tel" value={form.wa} onChange={e=>set('wa',e.target.value)} placeholder="08xxxxxxxxxx" className="field"/></label><label className="field-label mt-5">Bukti rahasia kepemilikan <span className="font-normal text-red-600">· Tidak ditampilkan ke publik</span><textarea rows="4" value={form.bukti} onChange={e=>set('bukti',e.target.value)} placeholder="Contoh: layar kunci bergambar anjing golden retriever..." className="field resize-y"/></label><p className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">🔒 Minta pihak yang mengklaim barang menyebutkan detail ini sebelum menyerahkan barang.</p></section>}
      {step===4&&<div className="space-y-4"><section className="rounded-2xl border bg-white p-5"><span className="rounded-full bg-[#f1f2f9] px-3 py-1 text-xs font-bold">{form.tipe==='hilang'?'LAPORAN BARANG HILANG':'LAPORAN BARANG DITEMUKAN'}</span><h2 className="mt-4 text-xl font-extrabold">{form.nama}</h2><p className="mt-2 text-sm text-gray-600">{CATEGORIES[form.kategori]} {form.kategori} · {form.warna} {form.merek&&`· ${form.merek}`}</p>{form.ciri&&<p className="mt-3 rounded-lg bg-[#f1f2f9] p-3 text-sm">{form.ciri}</p>}<div className="mt-4 space-y-2 border-t pt-4 text-sm text-gray-600"><p>📍 {form.lokasi} {form.area&&`· ${form.area}`}</p><p>🕒 {dateValue} · {form.waktu}</p><p>📞 {form.wa} · 📷 {form.files.length} foto</p></div></section><label className="flex items-start gap-3 rounded-2xl border bg-white p-5 text-sm"><input type="checkbox" checked={form.ok} onChange={e=>set('ok',e.target.checked)} className="mt-1 accent-orange-500"/><span><b>Pernyataan kebenaran informasi</b><br/>Saya menyatakan laporan ini akurat dan dibuat sesuai ketentuan kampus.</span></label></div>}
      {error&&<p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </main>
    <footer className="fixed inset-x-0 bottom-0 z-20 flex justify-center gap-3 border-t bg-white p-4">{step>1&&<button onClick={()=>{setStep(step-1);setError('')}} className="rounded-lg bg-[#f1f2f9] px-6 py-3 font-semibold">← Kembali</button>}<button disabled={busy} onClick={submit} className="rounded-lg bg-[#681b28] px-7 py-3 font-bold text-white disabled:opacity-60">{busy?'Mengirim...':step===4?'Kirim laporan':'Lanjut →'}</button></footer>
  </div>
}

function Detail({item,setPage}) {
  if(!item)return <main className="p-20 text-center">Laporan tidak ditemukan <button onClick={()=>setPage('reports')} className="underline">Kembali</button></main>
  return <main className="mx-auto min-h-[calc(100vh-78px)] max-w-5xl px-6 py-12"><button onClick={()=>setPage('reports')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500"><ChevronLeft size={17}/> Kembali ke laporan</button><div className="grid overflow-hidden rounded-3xl border bg-white shadow-sm md:grid-cols-2"><div className="flex min-h-[320px] items-center justify-center bg-[#d7d7d7]">{item.foto?.[0]?<img src={item.foto[0]} className="h-full w-full object-cover" alt={item.nama}/>:<div className="text-center text-gray-500"><ImageIcon size={42} className="mx-auto"/><p className="mt-2 text-sm">Foto Barang</p></div>}</div><div className="p-7 md:p-10"><span className="rounded-full bg-[#f2d4c7] px-3 py-1 text-xs font-bold">{item.tipe==='hilang'?'Hilang':'Ditemukan'}</span><h1 className="mt-5 text-3xl font-extrabold">{item.nama}</h1><p className="mt-2 text-sm text-gray-500">{item.kategori} {item.merek&&`· ${item.merek}`}</p><div className="my-7 space-y-3 border-y py-5 text-sm text-gray-600"><p className="flex gap-3"><MapPin size={17}/>{item.lokasi} {item.area&&`· ${item.area}`}</p><p className="flex gap-3"><CalendarDays size={17}/>{item.tanggal}</p><p className="flex gap-3"><Clock3 size={17}/>{item.waktu}</p></div><h3 className="font-bold">Deskripsi</h3><p className="mt-2 text-sm leading-relaxed text-gray-600">{item.ciri||'Tidak ada deskripsi tambahan.'}</p><a target="_blank" rel="noreferrer" href={`https://wa.me/${item.wa}`} className="mt-7 block rounded-xl bg-emerald-600 px-5 py-3 text-center font-bold text-white">Hubungi via WhatsApp</a></div></div></main>
}

function Contact(){return <main className="mx-auto min-h-[calc(100vh-78px)] max-w-5xl px-6 py-20"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#681b28]">Punya pertanyaan?</p><h1 className="mt-2 text-4xl font-extrabold">Hubungi kami</h1><p className="mt-4 max-w-xl text-gray-600">Ada kendala saat membuat laporan atau ingin mengonfirmasi barang? Hubungi tim FoundIt.</p><div className="mt-10 grid gap-5 md:grid-cols-3">{[[Mail,'Email','foundit@its.ac.id'],[Phone,'WhatsApp','Kontak pengelola FoundIt'],[Instagram,'Instagram','@foundit.its']].map(([I,n,v])=><div key={n} className="rounded-2xl border bg-white p-6"><I className="text-[#681b28]" size={25}/><h2 className="mt-5 font-extrabold">{n}</h2><p className="mt-1 text-sm text-gray-600">{v}</p></div>)}</div></main>}

export default function App(){
  const [page,setPage]=useState('home'),[user,setUser]=useState(null),[items,setItems]=useState([]),[loading,setLoading]=useState(false),[selected,setSelected]=useState(null),[resolving,setResolving]=useState(null),[notice,setNotice]=useState('')
  const [sessionReady,setSessionReady]=useState(false)
  useEffect(()=>{supabase.auth.getSession().then(({data})=>{setUser(data.session?.user??null);setSessionReady(true)});const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>setUser(session?.user??null));return()=>subscription.unsubscribe()},[])
  async function loadItems(){if(!user)return;setLoading(true);const {data,error}=await supabase.from('items').select('id,user_id,tipe,kategori,nama,merek,warna,ciri,lokasi,area,tanggal,waktu,wa,foto,selesai,created_at').eq('selesai',false).order('created_at',{ascending:false});setLoading(false);if(error){setNotice(error.message);return}setItems(data||[])}
  useEffect(()=>{if(user)loadItems();else setItems([])},[user])
  async function createReport(form){
    if(!user){setPage('auth');throw new Error('Login terlebih dahulu untuk mengirim laporan.')}
    const urls=[]
    for(const file of form.files){const ext=file.name.split('.').pop();const path=`${user.id}/${crypto.randomUUID()}.${ext}`;const {error}=await supabase.storage.from('foto').upload(path,file);if(error)throw error;const {data}=supabase.storage.from('foto').getPublicUrl(path);urls.push(data.publicUrl)}
    const wa=form.wa.replace(/\D/g,'').replace(/^0/,'62')
    const tanggal=form.hari==='Custom'?form.tanggal:new Date(Date.now()-(form.hari==='Yesterday'?86400000:0)).toISOString().slice(0,10)
    const {error}=await supabase.from('items').insert({tipe:form.tipe,kategori:form.kategori,nama:form.nama,merek:form.merek,warna:form.warna,ciri:form.ciri,lokasi:form.lokasi,area:form.area,tanggal,waktu:form.waktu,wa,bukti:form.bukti,foto:urls})
    if(error)throw error
    await loadItems();setPage('reports')
  }
  async function resolveItem(id){if(!confirm('Tandai laporan ini sebagai selesai?'))return;setResolving(id);const {error}=await supabase.rpc('selesaikan',{p_id:id});setResolving(null);if(error){setNotice(error.message);return}await loadItems()}
  async function logout(){await supabase.auth.signOut();setPage('home')}
  if(!sessionReady)return <div className="grid min-h-screen place-items-center bg-[#f8f8ed] text-sm text-gray-500"><LoaderCircle className="mr-2 inline animate-spin"/> Memuat FoundIt...</div>
  return <div className="min-h-screen bg-[#f8f8ed] font-sans text-[#241b16]"><Header page={page} setPage={setPage} user={user} onLogout={logout}/>
    {notice&&<div className="mx-auto mt-4 max-w-5xl rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{notice}<button onClick={()=>setNotice('')} className="float-right">✕</button></div>}
    {page==='home'&&<Home setPage={setPage}/>}
    {page==='auth'&&<Auth setPage={setPage}/>}
    {page==='reports'&&<Reports items={items} loading={loading} userId={user?.id} setPage={setPage} setSelected={setSelected} onResolve={resolveItem} resolving={resolving}/>}
    {page==='form-lost'&&<ReportForm type="lost" setPage={setPage} onSubmit={createReport}/>}
    {page==='form-found'&&<ReportForm type="found" setPage={setPage} onSubmit={createReport}/>}
    {page==='detail'&&<Detail item={selected} setPage={setPage}/>}
    {page==='contact'&&<Contact/>}
    <footer className="border-t border-black/10 px-6 py-6 text-center text-xs text-gray-500">© 2026 FoundIt · Lost & Found ITS Tower 2</footer>
  </div>
}
