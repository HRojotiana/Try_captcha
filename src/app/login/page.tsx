'use client'

import {useState} from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useRouter } from 'next/navigation'

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const [error, setError] = useState<string |  null>(null)
    const router = useRouter();
    
    const siteKey = process.env.SITE_KEY

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token)
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if(!email || !password){
            setError('Veuillez remplir tous les champs.')
            return
        }

        if(!captchaToken){
            setError('Veuillez compléter le reCAPTCHA')
            return
        }

        try{
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({email, password, captchaToken}), 
            })

            const data = await res.json();

            console.log('Réponse de l\'API :', data); 
            
            if(data.success){
                router.push('/dashboard')
            }else{
                setError(data.message || 'Une erreur est survenue.')
            }

        }catch(err){
            setError('Erreur lors de la connexion.')
        }
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <div className="mb-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE || ""}//Site Key     
              onChange={handleCaptchaChange}
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
    )
}

export default LoginPage