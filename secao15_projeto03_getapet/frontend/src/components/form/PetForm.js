import { useState } from 'react'

import form_styles from './Form.module.css'

import Input from './Input'
import SelectInput from './SelectInput'

function PetForm({ handleSubmit, petData, btnText }) {
    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([])
    const colors = ["Branco", "Preto", "Cinza", "Marrom", "Caramelo", "Mesclado"]


    function handleChanges(e) {
        setPet({ ...pet, [e.target.name]: e.target.value })
    }

    function handleFileChange(e) {
        setPet({ ...pet, images: [...e.target.files] })
        setPreview(Array.from(e.target.files))
    }

    function handleColor(e) {
        setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text })
    }

    function submit(e) {
        e.preventDefault()

        handleSubmit(pet)
    }

    return (
        <form onSubmit={submit} className={form_styles.form_container}>
            <div className={form_styles.preview_pet_images}>
                {preview.length > 0 ?
                    preview.map((image, index) => (
                        <img
                            src={URL.createObjectURL(image)}
                            alt={pet.name}
                            key={`${pet.name}+${index}`} />
                    )) :
                    pet.images && pet.images.map((image, index) => {
                        <img
                            src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                            alt={pet.name}
                            key={`${pet.name}+${index}`} />
                    })
                }
            </div>

            <Input
                type="file"
                text="Imagens do pet"
                name="images"
                handleOnChange={handleFileChange}
                multiple={true} />
            <Input
                type="text"
                text="Nome"
                name="name"
                placeholder="Digite o nome do pet"
                handleOnChange={handleChanges}
                value={pet.name || ''} />
            <Input
                type="text"
                text="Idade"
                name="age"
                placeholder="Digite a idade do pet"
                handleOnChange={handleChanges}
                value={pet.age || ''} />
            <Input
                type="number"
                text="Peso"
                name="weight"
                placeholder="Digite o peso do pet"
                handleOnChange={handleChanges}
                value={pet.weight || ''} />

            <SelectInput
                text="Selecione a cor"
                name="color"
                options={colors}
                handleOnChange={handleColor}
                value={pet.color || ''} />

            <input type="submit" value={btnText}></input>
        </form>
    )
}

export default PetForm