import { useState, useEffect } from 'react'

import api from '../../../utils/api'

import styles from './Profile.module.css'
import form_styles from '../../form/Form.module.css'

import RoundedImage from '../../layout/RoundedImage'
import Input from '../../form/Input'

import useFlashMessage from '../../../hooks/useFlashMessage'

function Profile() {
    const [user, setUser] = useState({})
    const [preview, setPreview] = useState('')

    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('/users/checkuser', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            setUser(response.data)
        })
    }, [token])

    function handleChanges(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleFileChange(e) {
        setPreview(e.target.files[0])
        setUser({ ...user, [e.target.name]: e.target.files[0] })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        let msgType = 'success'

        const formData = new FormData()
        Object.keys(user).forEach(key => {
            formData.append(key, user[key])
        })

        const data = await api.patch(`/users/edit/${user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            return response.data
        }).catch(err => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <section className={form_styles.form_container}>
            <div className={styles.profile_header}>
                <h1>Perfil</h1>
                {(user.image || preview) && (
                    <RoundedImage src={preview ? URL.createObjectURL(preview) : `${process.env.REACT_APP_API}/images/users/${user.image}`} alt={user.name} />
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <Input
                    type="file"
                    text="Imagem"
                    name="image"
                    handleOnChange={handleFileChange} />

                <Input
                    type="email"
                    text="E-mail"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    handleOnChange={handleChanges}
                    value={user.email || ''} />
                <Input
                    type="text"
                    text="Nome"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleChanges}
                    value={user.name || ''} />
                <Input
                    type="text"
                    text="Telefone"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleChanges}
                    value={user.phone || ''} />
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

                <input type="submit" value="Editar" />
            </form>
        </section>
    )
}

export default Profile