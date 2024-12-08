import { NextResponse } from "next/server";
import { config } from "process";

type LoginRequest = {
    email: string;
    password: string;
    captchaToken: string;
}

export async function POST (req: Request){
    const body: LoginRequest = await req.json();

    const {email, password, captchaToken} = body;

    const secretKey = process.env.SECRET_KEY; //secret-key
    const captchaResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `secret=${secretKey}&response=${captchaToken}`,
        }
    )

    const captchaResult = await captchaResponse.json()
    console.log('Captcha Result:', captchaResult);
    console.log('Email:', email);
    console.log('Password:', password);


    if(!captchaResult.success){
        return NextResponse.json(
            {success: false, message: 'Captcha invalide.'},
            {status: 400}
        )
    }

    if(email === 'user@example.com' && password === 'password123'){
        return NextResponse.json({success: true, message: 'Vous serez redirigé vers votre dashboard'})
    }else{
        return NextResponse.json(
            {success: false, message: 'Identifiants incorrects.'},
            {status: 401}
        )
    }

}