import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

import type {Database} from '@/lib/database.types'

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const organization = String(formData.get('organization'))
    console.log({email, password, organization})
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({cookies: () => cookieStore})

    const {data, error: signInError} = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    
    if (signInError) {
        console.error("Sign In Failed: " + signInError.message)
    }
    // check user is in organization
    const {data: orgData, error: orgError} = await supabase
        .from('organizations')
        .select(`
            id,
            name_kor,
            name_eng,
            user_organizations (
                user_id
            )
        `)
        .eq('key', organization)
        .eq('user_organizations.user_id', data?.user?.id || '')
        .single()

    if (orgError || !orgData) {
        throw new Error(orgError?.message || 'Invalid organization')
    }


    return NextResponse.redirect(requestUrl.origin + `?org=${orgData?.name_eng}`, {
        status: 301,
    })
}