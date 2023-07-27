import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import Input from '../../form/Input'

import styles from '../../form/Form.module.css'

// context
import { Context } from '../../../context/UserContext'

function Login() {
    const [user, setUser] = useState({})
    const { login } = useContext(Context)

    function handleChanges(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()

        login(user)
    }

    return (
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    type="email"
                    text="E-mail"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    handleOnChange={handleChanges} />
                <Input
                    type="password"
                    text="Senha"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnChange={handleChanges} />

                <input type="submit" value="Fazer login" />
            </form>

            <p>Ainda não tem conta? <Link to='/register' className="bold"> Clique aqui.</Link></p>
        </section>
    )
}

export default Login