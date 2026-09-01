import { FormEvent, useState } from 'react'
import jwt from 'jsonwebtoken'
import NavBar from '../../components/NavBar'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import styles from '../../styles/Users.module.css'

interface UsersProps {
  id: string
  users: { users: string[] }
}

function setSessionCookie(username: string, id: string) {
  const payload = { username, id }
  const token = jwt.sign({ payload }, process.env.JWT_SECRET as string, { algorithm: 'HS256' })
  const expires = new Date()
  expires.setTime(expires.getTime() + 8760 * 3600 * 1000)
  document.cookie = 'username=' + token + '; path=/;expires=' + expires.toUTCString() + ';'
}

function Users({ id, users }: UsersProps) {
  const [familyUsers, setFamilyUsers] = useState(users?.users || [])
  const [newUser, setNewUser] = useState('')
  const [userTaken, setUserTaken] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [removingUser, setRemovingUser] = useState<string | null>(null)

  const logOut = (e?: any) => {
    if (e) e.preventDefault()
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
    window.location.replace('/')
  }

  const chooseAvatar = (user: string) => {
    setSessionCookie(user, id)
    window.location.replace('/groceries/' + id)
  }

  const addUser = async (e: FormEvent) => {
    e.preventDefault()
    if (familyUsers.includes(newUser)) {
      setUserTaken(true)
      return
    }
    setSubmitting(true)
    setUserTaken(false)
    try {
      const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/c/create-new-family-user/' + id, {
        body: JSON.stringify({ user: newUser }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
      const data: any = await res.json()
      if (data.status == true) {
        setSessionCookie(newUser, id)
        window.location.replace('/groceries/' + id)
      } else {
        setUserTaken(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const removeUser = async (user: string) => {
    if (!window.confirm(`¿Quitar a ${user} de la familia?`)) return
    setRemovingUser(user)
    try {
      const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/d/family-user/' + id, {
        body: JSON.stringify({ user }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
      const data: any = await res.json()
      if (data.status == true) {
        setFamilyUsers((prev) => prev.filter((u) => u !== user))
      }
    } finally {
      setRemovingUser(null)
    }
  }

  return (
    <>
      <NavBar title="¿Quién sos?" onLogout={logOut} />
      <div className={styles.page}>
        <div className={styles.content}>
          {familyUsers.length > 0 ? (
            <>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionTitle}>{editMode ? 'Tocá la X para quitar a alguien' : 'Elegí tu usuario'}</p>
                <button type="button" className={styles.editToggle} onClick={() => setEditMode((v) => !v)}>
                  {editMode ? 'Listo' : 'Editar'}
                </button>
              </div>
              <div className={styles.avatarGrid}>
                {familyUsers.map((user) => (
                  <div className={styles.avatarItem} key={user}>
                    <div className={styles.avatarWrap}>
                      <Avatar name={user} onClick={editMode ? undefined : () => chooseAvatar(user)} />
                      {editMode ? (
                        <button
                          type="button"
                          className={styles.removeBadge}
                          aria-label={`Quitar a ${user}`}
                          onClick={() => removeUser(user)}
                          disabled={removingUser === user}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M6 6l12 12M18 6 6 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                    <span className={styles.avatarName}>{user}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.emptyText}>Todavía no hay usuarios en esta familia, creá el primero abajo</p>
          )}

          <Card padding="26px 24px">
            <form className={styles.form} onSubmit={addUser}>
              <h2 className={styles.formTitle}>{userTaken ? 'Usuario tomado' : 'Usuario nuevo'}</h2>
              <Input
                type="text"
                label="Nombre"
                placeholder="Tu nombre"
                required
                value={newUser}
                onChange={(e) => {
                  setNewUser(e.target.value)
                  setUserTaken(false)
                }}
                error={userTaken ? 'Ese nombre ya está en uso, elegí otro' : undefined}
              />
              <Button type="submit" fullWidth loading={submitting}>
                Guardar usuario
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}

Users.getInitialProps = async (ctx: any) => {
  const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/r/users/' + ctx.query.id)
  const users = await res.json()
  return { id: ctx.query.id, users }
}

export default Users
