import { ChangeEvent, FormEvent, useState} from 'react'

export const useForm = (callback: () => void, initialState = {}) => {
  const [values, setValues] = useState(initialState)

  const onChange = (e: ChangeEvent<HTMLInputElement> ) => {
    setValues({...values, [e.target.name]: e.target.value})
    console.log('Target: ==>> target <<=== ==>>', values)
  }

  const onSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()
    callback()
  }


  return {
    onChange,
    onSubmit,
    values
  }
}
