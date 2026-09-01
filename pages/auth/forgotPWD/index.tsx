import { FormEvent, useState } from 'react'
import AuthLayout, { authLayoutStyles as styles } from '../../../components/AuthLayout'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/ui/Alert'
import TextLink from '../../../components/ui/TextLink'

type Status = 'notSent' | 'sent' | 'error'

function ForgotPWD() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('notSent')
  const [submitting, setSubmitting] = useState(false)

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/auth/forgotPWD', {
        body: JSON.stringify({ email }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
      const { status: resStatus } = await res.json()
      setStatus(resStatus == true ? 'sent' : 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'sent') {
    return (
      <AuthLayout title="Revisa tu correo">
        <Alert variant="success">
          Te enviamos un email con un link para restablecer tu contraseña.
        </Alert>
        <p className={styles.footer}>
          <TextLink href="/auth/login" className={styles.link}>
            Volver a ingresar
          </TextLink>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="¿Olvidaste tu contraseña?" subtitle="Te enviaremos un link para restablecerla">
      {status === 'error' ? (
        <div style={{ marginBottom: 16 }}>
          <Alert variant="error">Hubo un error, intentalo de nuevo más tarde.</Alert>
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
        <Button type="submit" fullWidth loading={submitting}>
          Restaurar contraseña
        </Button>
      </form>
      <div className={styles.footerLinks}>
        <p className={styles.footer} style={{ marginTop: 18 }}>
          <TextLink href="/auth/login" className={styles.link}>
            Ingresar a tu cuenta
          </TextLink>
        </p>
        <p className={styles.footer} style={{ marginTop: 0 }}>
          <TextLink href="/auth/sign-up" className={styles.link}>
            Registrar una cuenta nueva
          </TextLink>
        </p>
      </div>
    </AuthLayout>
  )
}

export default ForgotPWD
