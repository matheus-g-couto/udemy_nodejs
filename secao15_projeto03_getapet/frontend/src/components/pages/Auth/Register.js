import Input from "../../form/Input"
import { Link } from 'react-router-dom'

import styles from '../../form/Form.module.css'

function Register() {
    function handleChanges(e) {

    }

    return (
        <section className={styles.form_container}>
            <h1>Cadastrar</h1>
            <form>
                <Input
                    type="text"
                    text="Nome"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleChanges} />
                <Input
                    type="text"
                    text="Telefone"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleChanges} />
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
                <Input
                    type="password"
                    text="Confirmação de senha"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleChanges} />

                <input type="submit" value="Cadastrar" />
            </form>

            <p>Já tem conta? <Link to='/login' className="bold"> Clique aqui.</Link></p>
        </section>
    )
}

export default Register