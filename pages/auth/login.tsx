import { FormEvent, useEffect, useState } from 'react'
import AuthLayout, { authLayoutStyles as styles } from '../../components/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'

type InputStatus = 'noError' | 'noUserWithThatEmailOrPassword' | 'wrongPassword'

function clearCookies() {
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
  })
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inputStatus, setInputStatus] = useState<InputStatus>('noError')
  const [backendError, setBackendError] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportEmail, setReportEmail] = useState('')
  const [reportSent, setReportSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    clearCookies()
  }, [])

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setInputStatus('noError')
    setBackendError(false)
    try {
      const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/auth/login', {
        body: JSON.stringify({ email, password }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
      const data: any = await res.json()
      if (data.status == 'everythingIsOk') {
        window.location.replace('/users/' + data.id)
        return
      } else if (data.status == 'noUserWithThatEmailOrPassword') {
        setInputStatus('noUserWithThatEmailOrPassword')
      } else if (data.status == 'wrongPassword') {
        setInputStatus('wrongPassword')
      } else if (data.status == 'errorWithInput') {
        setBackendError(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const feedbackHandler = async (e: FormEvent) => {
    e.preventDefault()
    const feedback = 'with input on login page please check logs and maybe to some testing to see if the server is still alive?'
    await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/feedback', {
      body: JSON.stringify({ email: reportEmail, feedback }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
    setReportSent(true)
  }

  return (
    <AuthLayout title="Bienvenido de nuevo" subtitle="Ingresa a tu cuenta para ver tu lista">
      {backendError ? (
        <div style={{ marginBottom: 16 }}>
          <Alert variant="error">
            Hubo un error al ingresar. Intentalo de nuevo en un rato.{' '}
            {!reportOpen && !reportSent ? (
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', fontWeight: 700, color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Avisar a los programadores
              </button>
            ) : null}
          </Alert>
          {reportOpen && !reportSent ? (
            <form onSubmit={feedbackHandler} style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Input
                type="email"
                placeholder="tu@email.com"
                required
                value={reportEmail}
                onChange={(e) => setReportEmail(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button type="submit" size="sm" variant="secondary">
                Enviar
              </Button>
            </form>
          ) : null}
          {reportSent ? (
            <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', marginTop: 8 }}>Gracias, ya avisamos al equipo.</p>
          ) : null}
        </div>
      ) : null}

      <form className={styles.form} onSubmit={submitHandler}>
        <Input
          type="email"
          label="Email"
          placeholder="tu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={inputStatus === 'noUserWithThatEmailOrPassword' ? 'No existe un usuario con ese email' : undefined}
        />
        <Input
          type="password"
          label="Contraseña"
          placeholder="Tu contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={inputStatus === 'wrongPassword' ? 'Contraseña incorrecta' : undefined}
        />
        <div className={styles.linkRow}>
          <TextLink href="/auth/forgotPWD" className={styles.link}>
            ¿Olvidaste tu contraseña?
          </TextLink>
        </div>
        <Button type="submit" fullWidth loading={submitting}>
          Ingresar
        </Button>
      </form>

      <p className={styles.footer}>
        ¿No tienes una cuenta?{' '}
        <TextLink href="/auth/sign-up" className={styles.link}>
          Crear una cuenta
        </TextLink>
      </p>
    </AuthLayout>
  )
}

export default Login
