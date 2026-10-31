import { useState } from 'react'
import { ArrowUpRight, Check, ChevronRight, CircleAlert, Database, LogOut, Play, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'

const API_URL = 'http://127.0.0.1:8000'
const SAMPLE_INPUT = 'apple banana apple\nbanana cherry\napple cherry cherry'
const SERVICES = [
  { value: 'beam', label: 'Apache Beam' },
  { value: 'airflow', label: 'Apache Airflow' },
  { value: 'iceberg-trino', label: 'Apache Iceberg + Trino' },
]

function PlatformHeader({ session, onLogout, value, onChange }) {
  return (
    <header className="app-header">
      <div className="brand-mark dark"><span>DP</span><strong>Data Platform</strong></div>
      <nav><span className="active">Services</span><span>Runs</span><span>Datasets</span></nav>
      <div className="header-actions"><label className="service-picker"><span>SERVICE</span><select value={value} onChange={(event) => onChange(event.target.value)} aria-label="Select data service"><option value="" disabled>Choose a service</option>{SERVICES.map((service) => <option value={service.value} key={service.value}>{service.label}</option>)}</select></label><div className="user-menu"><span className="avatar">{session.username.slice(0, 1).toUpperCase()}</span><span>{session.username}</span><button aria-label="Log out" title="Log out" onClick={onLogout}><LogOut size={16} /></button></div></div>
    </header>
  )
}

function ServiceLanding({ session, onLogout, onSelectService }) {
  return (
    <main className="workspace-page service-page">
      <PlatformHeader session={session} onLogout={onLogout} value="" onChange={onSelectService} />
      <section className="service-landing"><p className="eyebrow">DATA PLATFORM / SERVICE CATALOG</p><h1>Choose your data service.</h1><p className="service-copy">Select a utility to enter its workspace. More of your data stack is on the way.</p><label className="service-select-large"><span>SELECT SERVICE</span><select defaultValue="" onChange={(event) => onSelectService(event.target.value)}><option value="" disabled>Choose a service</option>{SERVICES.map((service) => <option value={service.value} key={service.value}>{service.label}</option>)}</select></label><div className="service-cards">{SERVICES.map((service, index) => <button className={`service-card ${index === 0 ? 'ready' : ''}`} key={service.value} onClick={() => onSelectService(service.value)}><span>0{index + 1}</span><strong>{service.label}</strong><small>{index === 0 ? 'Available now' : 'Coming soon'}</small><ArrowUpRight size={17} /></button>)}</div></section>
      <footer className="workspace-footer"><span><i /> All systems operational</span><span>Data Platform · Local control plane</span></footer>
    </main>
  )
}

function ComingSoon({ service, session, onLogout, onSelectService }) {
  const serviceLabel = SERVICES.find((item) => item.value === service)?.label
  return (
    <main className="workspace-page service-page">
      <PlatformHeader session={session} onLogout={onLogout} value={service} onChange={onSelectService} />
      <section className="coming-soon"><div className="coming-soon-mark"><Sparkles size={24} /></div><p className="eyebrow">DATA PLATFORM / {serviceLabel?.toUpperCase()}</p><h1>Coming soon.</h1><p>We are preparing the {serviceLabel} utility for this workspace. Apache Beam is available now.</p><button className="back-service" onClick={() => onSelectService('')}><ChevronRight size={16} /> Choose another service</button></section>
      <footer className="workspace-footer"><span><i /> All systems operational</span><span>Data Platform · Local control plane</span></footer>
    </main>
  )
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('beam')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) throw new Error('Invalid username or password')
      const session = await response.json()
      onLogin(session)
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch' ? 'API unavailable. Start the FastAPI server on port 8000.' : requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-art" aria-label="Data platform introduction">
        <div className="brand-mark"><span>DP</span><strong>Data Platform</strong></div>
        <div className="art-copy">
          <p className="eyebrow">DATA PLATFORM / 01</p>
          <h1>Move raw signal<br /><em>to clear insight.</em></h1>
          <p>Run repeatable ingestion jobs, watch every transformation, and keep your data moving with intent.</p>
        </div>
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="art-footer"><span>LOCAL CONTROL PLANE</span><span>DIRECT RUNNER <i /></span></div>
      </section>
      <section className="login-panel">
        <div className="panel-top"><span>Welcome back</span><span className="system-status"><i /> System ready</span></div>
        <div className="login-form-wrap">
          <div className="login-heading"><ShieldCheck size={26} strokeWidth={1.5} /><p>Sign in to your workspace</p><h2>Good data starts here.</h2></div>
          <form onSubmit={submit}>
            <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
            {error && <div className="error-message"><CircleAlert size={15} />{error}</div>}
            <button className="primary-button" disabled={loading}>{loading ? 'Connecting...' : 'Enter workspace'}<ArrowUpRight size={17} /></button>
          </form>
          <p className="login-hint">Demo access <strong>admin</strong> / <strong>beam</strong></p>
        </div>
        <div className="panel-bottom">Data Platform local console <span>v0.1.0</span></div>
      </section>
    </main>
  )
}

function Workspace({ session, onLogout, onSelectService }) {
  const [input, setInput] = useState(SAMPLE_INPUT)
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  async function runPipeline() {
    const lines = input.split('\n').map((line) => line.trim()).filter(Boolean)
    if (!lines.length) return setError('Add at least one input record before running.')
    setRunning(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/pipeline/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ lines }),
      })
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}))
        throw new Error(detail.detail || 'Pipeline run failed')
      }
      setResult(await response.json())
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch' ? 'Could not reach FastAPI. Start the backend server and try again.' : requestError.message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <main className="workspace-page">
      <PlatformHeader session={session} onLogout={onLogout} value="beam" onChange={onSelectService} />
      <section className="workspace-intro"><div><p className="eyebrow">INGESTION / PIPELINE STUDIO</p><h1>Word count pipeline</h1><p className="intro-copy">Feed records into a Beam transform and inspect the grouped output from the DirectRunner.</p></div><div className="live-badge"><i /> API connected <span>localhost:8000</span></div></section>
      <section className="workspace-grid">
        <div className="input-column">
          <div className="section-label"><span>01</span><div><h2>Source records</h2><p>One record per line</p></div></div>
          <div className="editor-shell"><div className="editor-top"><span><Database size={15} /> INLINE DATASET</span><button onClick={() => setInput(SAMPLE_INPUT)}><RotateCcw size={14} /> Reset sample</button></div><div className="editor"><div className="line-numbers">{input.split('\n').map((_, index) => <span key={index}>{String(index + 1).padStart(2, '0')}</span>)}</div><textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" aria-label="Input records" /></div><div className="editor-footer"><span>{input.split('\n').filter(Boolean).length} records</span><span>UTF-8 · plain text</span></div></div>
          <div className="pipeline-card"><div className="card-heading"><Sparkles size={16} /><span>TRANSFORM GRAPH</span></div><div className="pipeline-steps"><span>Dummy Source</span><ChevronRight size={14} /><span>Split Words</span><ChevronRight size={14} /><span>Pair with 1</span><ChevronRight size={14} /><span>Group and Sum</span></div></div>
          <button className="run-button" onClick={runPipeline} disabled={running}><Play size={17} fill="currentColor" />{running ? 'Running pipeline...' : 'Run pipeline'}<span>⌘ ↵</span></button>
          {error && <div className="error-message workspace-error"><CircleAlert size={15} />{error}</div>}
        </div>
        <div className="output-column"><div className="section-label"><span>02</span><div><h2>Pipeline output</h2><p>Grouped word frequencies</p></div><span className="runner-tag">{result?.runner || 'Awaiting run'}</span></div>{result ? <div className="results-shell"><div className="result-metrics"><div><span>Records</span><strong>{result.records_processed}</strong></div><div><span>Words</span><strong>{result.words_processed}</strong></div><div><span>Unique</span><strong>{result.counts.length}</strong></div></div><div className="table-heading"><span>WORD</span><span>COUNT</span></div><div className="result-table">{result.counts.map((item, index) => <div className="result-row" key={item.word}><span><b>{String(index + 1).padStart(2, '0')}</b>{item.word}</span><strong>{item.count}</strong></div>)}</div><div className="success-note"><Check size={14} /> Run completed successfully</div></div> : <div className="empty-output"><div className="empty-icon"><Play size={20} /></div><h3>No run yet</h3><p>Your grouped word counts will appear here after the pipeline completes.</p></div>}</div>
      </section>
      <footer className="workspace-footer"><span><i /> All systems operational</span><span>Data Platform · DirectRunner</span></footer>
    </main>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  function logout() {
    setSession(null)
    setSelectedService(null)
  }
  function chooseService(service) {
    setSelectedService(service || null)
  }
  if (!session) return <Login onLogin={(newSession) => { setSession(newSession); setSelectedService(null) }} />
  if (!selectedService) return <ServiceLanding session={session} onLogout={logout} onSelectService={chooseService} />
  if (selectedService !== 'beam') return <ComingSoon service={selectedService} session={session} onLogout={logout} onSelectService={chooseService} />
  return <Workspace session={session} onLogout={logout} onSelectService={chooseService} />
}