import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Logo from '../components/Logo'
import Button from '../components/ui/Button'

const FEATURES = [
  {
    title: 'Tiempo real',
    text: 'Cada producto que agregas se sincroniza al instante para todos los que comparten la lista.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Toda la familia',
    text: 'Cada integrante tiene su propio usuario, así siempre sabes quién agregó qué.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 20c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17.5" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M15.7 14.8c2.5.3 4.3 2.4 4.3 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Simple de usar',
    text: 'Sin apps que instalar. Anota, tacha y listo — todo desde el navegador.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function Home() {
  useEffect(() => {
    const cookieValue = document.cookie.split('username=').join('')
    jwt.verify(cookieValue, process.env.JWT_SECRET as string, async (err: any, verifiedJwt: any) => {
      if (err) {
        console.log(err.message)
      } else if (verifiedJwt.payload.id) {
        window.location.replace('/groceries/' + verifiedJwt.payload.id)
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>Listo — Tu lista de supermercado, siempre al día</title>
        <meta
          name="description"
          content="Una web para anotar todas tus necesidades para el supermercado sin preocuparte de olvidar la lista, ya que todo se actualiza al instante para toda la familia."
        />
      </Head>
      <header className={styles.header}>
        <Logo />
        <div className={styles.headerActions}>
          <Button href="/auth/login" variant="ghost" size="sm">
            Ingresar
          </Button>
          <Button href="/auth/sign-up" variant="primary" size="sm">
            Crear cuenta
          </Button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Gratis · Sin instalar nada</span>
          <h1 className={styles.heroTitle}>Tu lista de supermercado, siempre lista.</h1>
          <p className={styles.heroSubtitle}>
            Anota lo que necesitas, compártelo con tu familia y no vuelvas a olvidar nada en el súper. Todo se actualiza al instante.
          </p>
          <div className={styles.heroActions}>
            <Button href="/auth/sign-up" size="lg">
              Crear cuenta gratis
            </Button>
            <Button href="/auth/login" variant="secondary" size="lg">
              Ya tengo cuenta
            </Button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src="/groceries.svg" alt="Ilustración de una persona haciendo las compras del supermercado" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Todo lo que necesitas, nada de lo que no</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>© {new Date().getFullYear()} Listo</footer>
    </>
  )
}

export default Home
