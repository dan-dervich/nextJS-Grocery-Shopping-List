import { FormEvent, useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import NavBar from '../../components/NavBar'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Checkbox from '../../components/ui/Checkbox'
import Modal from '../../components/ui/Modal'
import styles from '../../styles/Groceries.module.css'

interface Grocery {
  id: string
  grocery_item_name: string
  cuantity: string
  appendedBy: string
  createdOn: string
  bought: boolean
}

interface GroceriesProps {
  id: string
  data: { groceries: Grocery[] }
}

function GroceryItem({ grocery, familyId, onChanged }: { grocery: Grocery; familyId: string; onChanged: () => void }) {
  const [name, setName] = useState(grocery.grocery_item_name)
  const [quantity, setQuantity] = useState(grocery.cuantity)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/c/update/' + familyId, {
        body: JSON.stringify({ item: name, cuantity: quantity, appendedBy: grocery.appendedBy, id: grocery.id }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
      await res.json()
      onChanged()
    } finally {
      setSaving(false)
    }
  }

  const markDone = async () => {
    if (!window.confirm('¿Quitar este producto de la lista?')) return
    setRemoving(true)
    try {
      await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/d/grocery/' + grocery.id)
      onChanged()
    } finally {
      setRemoving(false)
    }
  }

  return (
    <Card padding="16px" style={{ opacity: removing ? 0.5 : 1, transition: 'opacity 0.15s ease' }}>
      <form className={styles.item} onSubmit={save}>
        <span className={styles.itemMeta}>
          {grocery.appendedBy} · {grocery.createdOn}
        </span>
        <div className={styles.itemFields}>
          <Input
            className={styles.itemFieldName}
            label="Compra"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className={styles.itemFieldQty}
            label="Cantidad"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className={styles.itemFooter}>
          <Checkbox label="Listo" checked={grocery.bought} onClick={markDone} disabled={removing} />
          <Button type="submit" size="sm" variant="secondary" loading={saving}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Card>
  )
}

function Groceries({ id, data }: GroceriesProps) {
  const [user, setUser] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [newQty, setNewQty] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const cookieValue = document.cookie.split('username=').join('')
    jwt.verify(cookieValue, process.env.JWT_SECRET as string, (err: any, verifiedJwt: any) => {
      if (err) {
        console.log(err.message)
        document.cookie.split(';').forEach((cookie) => {
          document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
        })
        window.location.replace('/auth/login')
      } else if (verifiedJwt.payload.username.length > 0) {
        setUser(verifiedJwt.payload.username)
      }
    })
  }, [])

  const logOut = (e?: any) => {
    if (e) e.preventDefault()
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
    window.location.replace('/')
  }

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/c/grocery/' + id, {
        body: JSON.stringify({
          comida: newItem,
          cuantity: newQty,
          appendedBy: user,
          grocery_item_name: newItem,
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
      const resData: any = await res.json()
      if (resData.status == true) {
        window.location.reload()
      }
    } finally {
      setAdding(false)
    }
  }

  const groceries = data.groceries || []

  return (
    <>
      <NavBar title="Mi Lista" onLogout={logOut} />
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Agregar producto">
        <form className={styles.addForm} onSubmit={submitHandler}>
          <Input
            label="Comida/Item necesitado"
            placeholder="Ej: Leche"
            required
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Input
            label="Cantidad"
            placeholder="Ej: 2 litros"
            required
            value={newQty}
            onChange={(e) => setNewQty(e.target.value)}
          />
          <Button type="submit" fullWidth loading={adding}>
            Guardar
          </Button>
        </form>
      </Modal>

      <div className={styles.page}>
        <div className={styles.content}>
          {groceries.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Tu lista está vacía</p>
              <p className={styles.emptyText}>Apretá el botón + para agregar tu primer producto</p>
            </div>
          ) : (
            groceries.map((grocery) => (
              <GroceryItem key={grocery.id} grocery={grocery} familyId={id} onChanged={() => window.location.reload()} />
            ))
          )}
        </div>
      </div>

      <button aria-label="Agregar producto" onClick={() => setAddOpen(true)} className={styles.fab}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
    </>
  )
}

Groceries.getInitialProps = async (ctx: any) => {
  const res = await fetch('https://next-js-grocery-shopping-list-backend.vercel.app/r/all-groceries/' + ctx.query.id)
  const data = await res.json()
  return { data, id: ctx.query.id }
}

export default Groceries
