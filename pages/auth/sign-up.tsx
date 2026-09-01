import { FormEvent, useEffect, useState } from 'react'
import AuthLayout, { authLayoutStyles as styles } from '../../components/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import TextLink from '../../components/ui/TextLink'

type ErrorType = '' | 'errorSavingUser' | 'noPasswordSentToBackend' | 'noEmailSentToBackend'

const ERROR_COPY: Record<Exclude<ErrorType, ''>, { message: string; feedback: string }> = {
  errorSavingUser: {
    message: 'Hubo un error creando tu usuario. Es posible que ese email ya esté en uso, o que nuestros servidores estén fallando. Intentalo de nuevo en un rato.',
    feedback: 'error saving user please check logs and maybe to some testing to see if the server is still alive?',
  },
  noPasswordSentToBackend: {
    message: 'No se envió ninguna contraseña a nuestros servidores. Intentalo de nuevo en un rato.',
    feedback: 'error with password check input e.target and check if maybe blank inputs are allowed. also do some testing on the server cause it might be down?',
  },
  noEmailSentToBackend: {
    message: 'No se envió ningún email a nuestros servidores. Intentalo de nuevo en un rato.',
    feedback: 'error with email being sent to backend maybe check the e.target.value and stuff and if the server is still up and running?',
  },
}

function clearCookies() {
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
  })
}

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [errorType, setErrorType] = useState<ErrorType>('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportEmail, setReportEmail] = useState('')
  const [reportSent, setReportSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    clearCookies()
  }, [])

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setPasswordsMatch(false)
      return
    }
    setSubmitting(true)
    setErrorType('')
    try {
      const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/c/new-user', {
        body: JSON.stringify({ email, password }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
      const data: any = await res.json()
      if (data.status == 'savedCorrectly') {
        window.location.replace('/users/' + data.id)
        return
      } else if (data.status == 'errorSavingGrocery') {
        setErrorType('errorSavingUser')
      } else if (data.status == 'noPasswordSentToBackend') {
        setErrorType('noPasswordSentToBackend')
      } else if (data.status == 'noEmailSentToBackend') {
        setErrorType('noEmailSentToBackend')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const feedbackHandler = async (e: FormEvent) => {
    e.preventDefault()
    if (!errorType) return
    await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/feedback', {
      body: JSON.stringify({ email: reportEmail, feedback: ERROR_COPY[errorType].feedback }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
    setReportSent(true)
  }

  return (
    <AuthLayout title="Crear cuenta" subtitle="Empieza a organizar tus compras en segundos">
      {errorType ? (
        <div style={{ marginBottom: 16 }}>
          <Alert variant="error">
            {ERROR_COPY[errorType].message}{' '}
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
        />
        <Input
          type="password"
          label="Contraseña"
          placeholder="Tu contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          required
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setPasswordsMatch(e.target.value === password)
          }}
          error={!passwordsMatch ? 'Las contraseñas no coinciden' : undefined}
        />
        <Button type="submit" fullWidth loading={submitting} disabled={!passwordsMatch}>
          Crear cuenta
        </Button>
      </form>

      <p className={styles.footer}>
        ¿Ya tienes una cuenta?{' '}
        <TextLink href="/auth/login" className={styles.link}>
          Ingresa
        </TextLink>
      </p>
    </AuthLayout>
  )
}

export default SignUp
