/**
 * Session is not guaranteed to contain a User object.
 * https://github.com/orgs/supabase/discussions/4400
 */
import { useEffect, useState } from 'react'

import { supabase } from '@/clients/supabaseClient'

import { Session } from '@supabase/supabase-js'

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const response = await supabase.auth.getSession()
      const session = response.data.session

      setSession(session)
      setLoading(false)

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.info('useSupabaseSession hook > onAuthStateChange > event: ', event)
        setSession(session)
        setLoading(false)
      })

      return () => {
        authListener?.subscription.unsubscribe()
      }
    }

    fetchSession()
  }, [])

  return { session, loading }
}