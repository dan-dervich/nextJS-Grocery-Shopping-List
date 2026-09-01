import { FormEvent, useEffect, useState } from 'react'
import { withRouter, NextRouter } from 'next/router'
import AuthLayout, { authLayoutStyles as styles } from '../../../components/AuthLayout'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/ui/Alert'
import TextLink from '../../../components/ui/TextLink'

interface ResetPasswordProps {
  router: NextRouter
  data: { status: string }
}

function ResetPassword({ router, data }: ResetPasswordProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (data.status == 'error') {
      router.push({ pathname: '/auth/login' })
    }
  }, [data, router])

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setPasswordsMatch(false)
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/auth/forgotPWD/' + router.query.id, {
        body: JSON.stringify({ password }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
      const resData: any = await res.json()
      if (resData.status == true) {
        router.push('/auth/login')
      } else {
        setError('Hubo un error al cambiar tu contraseña. Intentalo de nuevo en un rato.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Cambiar contraseña" subtitle="Elige tu nueva contraseña">
      {error ? (
        <div style={{ marginBottom: 16 }}>
          <Alert variant="error">
            {error} Si el problema continúa, escribinos a{' '}
            <TextLink href="mailto:dandervich@hotmail.com">dandervich@hotmail.com</TextLink>.
          </Alert>
        </div>
      ) : null}
      <form className={styles.form} onSubmit={submitHandler}>
        <Input
          type="password"
          label="Nueva contraseña"
          placeholder="Tu nueva contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          label="Confirmar contraseña"
          placeholder="Repite tu nueva contraseña"
          required
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setPasswordsMatch(e.target.value === password)
          }}
          error={!passwordsMatch ? 'Las contraseñas no coinciden' : undefined}
        />
        <Button type="submit" fullWidth loading={submitting} disabled={!passwordsMatch}>
          Guardar nueva contraseña
        </Button>
      </form>
    </AuthLayout>
  )
}

ResetPassword.getInitialProps = async (ctx: any) => {
  const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/auth/check-user/' + ctx.query.id)
  const data = await res.json()
  return { data }
}

export default withRouter(ResetPassword)
