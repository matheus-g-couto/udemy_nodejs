import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import styles from './Dashboard.module.css'

import RoundedImage from '../../layout/RoundedImage'

// hooks
import useFlashMessage from '../../../hooks/useFlashMessage'

function MyPets() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('/pets/mypets', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            setPets(response.data.userPets)
        })
    }, [token])

    async function deletePet(id) {
        let msgType = 'success'

        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            const updatedPets = pets.filter(pet => pet._id !== id)
            setPets(updatedPets)

            return response.data
        }).catch(err => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>MyPets</h1>
                <Link to='/pet/add'>Cadastrar pet</Link>
            </div>
            <div className={styles.petlist_container}>
                {pets && pets.length > 0 ?
                    pets.map(pet => (
                        <div key={pet._id} className={styles.petlist_row}>
                            <RoundedImage
                                src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                                alt={pet.name}
                                width="px75" />
                            <span className='bold'>{pet.name}</span>

                            <div className={styles.actions}>
                                {pet.available ? (
                                    <>
                                        {pet.adopter && (
                                            <button className={styles.conclue_btn}>Concluir adoção</button>
                                        )}
                                        <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                                        <button onClick={() => {
                                            deletePet(pet._id)
                                        }}>Excluir</button>
                                    </>
                                ) : (
                                    <p>Pet já adotado</p>
                                )}
                            </div>
                        </div>
                    ))
                    : (
                        <p>Você não cadastrou nenhum pet</p>
                    )}
            </div>
        </section>
    )
}

export default MyPets