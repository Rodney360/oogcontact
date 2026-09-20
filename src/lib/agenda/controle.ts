/**
 * De uitleg bij een controle van de agendakoppeling.
 *
 * Hier staat geen netwerk en staan geen sleutels: dit vertaalt alleen een
 * antwoord van de agenda naar gewone taal. Daardoor is het los te testen,
 * en dat gebeurt ook in tests/unit/agenda-controle.test.ts.
 *
 * De controle zelf staat in client.ts (die heeft de sleutels) en komt op de
 * pagina /agenda-controle/ te staan.
 */

/** Eén ding dat we gecontroleerd hebben. */
export type Bevinding = {
  /** Kort, in gewone taal: "De inloggegevens". */
  naam: string
  goed: boolean
  /** Wat we zien. */
  uitleg: string
  /** Wat je eraan kunt doen. Alleen als er iets mis is. */
  watNu?: string
}

export type Diagnose = {
  /** Waarmee de site inlogt bij de agenda. */
  modus: 'testmodus' | 'sleutel' | 'gebruikersnaam'
  /** Eén zin die het geheel samenvat. */
  kortom: string
  /** Werkt de koppeling echt, van begin tot eind? */
  goed: boolean
  bevindingen: Bevinding[]
}

/**
 * Wat een antwoord van de agenda betekent, in gewone taal.
 *
 * 0 betekent: er kwam helemaal geen antwoord - de agenda was niet te
 * bereiken, of hij deed er te lang over.
 */
export function verklaarStatus(status: number): { uitleg: string; watNu: string } {
  if (status === 0) {
    return {
      uitleg: 'De agenda gaf helemaal geen antwoord.',
      watNu:
        'Controleer of het adres klopt (EASYAPPOINTMENTS_URL in Vercel) en of ' +
        'oogcontactbijgerard.oo2.online het doet in je browser. Blijft het zo, ' +
        'vraag OO2 dan of ze verzoeken van buitenaf tegenhouden.',
    }
  }
  if (status === 401 || status === 403) {
    return {
      uitleg: 'De agenda liet ons niet binnen: de inloggegevens werden niet geaccepteerd.',
      watNu:
        'Controleer in Vercel de gebruikersnaam en het wachtwoord ' +
        '(EASYAPPOINTMENTS_GEBRUIKER en EASYAPPOINTMENTS_WACHTWOORD), of de sleutel ' +
        '(EASYAPPOINTMENTS_API_KEY). Vul er één soort in, niet allebei. Vergeet na een ' +
        'wijziging niet opnieuw te bouwen (Redeploy).',
    }
  }
  if (status === 404 || status === 405) {
    return {
      uitleg: 'De agenda kent dit adres niet.',
      watNu:
        'Waarschijnlijk staat de API uit, of gebruikt deze versie andere adressen. ' +
        'Vraag OO2 of de REST API (versie 1) aanstaat voor jullie agenda. De tekst ' +
        'daarvoor staat klaar in docs/agenda-koppelen.md.',
    }
  }
  if (status === 429) {
    return {
      uitleg: 'De agenda vond dat we te veel vroegen in korte tijd.',
      watNu: 'Wacht een paar minuten en ververs deze pagina.',
    }
  }
  if (status >= 500) {
    return {
      uitleg: `De agenda zelf had een storing (foutcode ${status}).`,
      watNu: 'Probeer het over een kwartier opnieuw. Blijft het zo, meld het dan bij OO2.',
    }
  }
  return {
    uitleg: `De agenda antwoordde met foutcode ${status}.`,
    watNu: 'Stuur deze pagina door, dan zoek ik uit wat die code hier betekent.',
  }
}

/**
 * De foutcode uit een mislukt verzoek halen.
 *
 * Een fout van de agenda zelf draagt de code mee; alles daarbuiten (een
 * verbinding die wegvalt, een tijdslimiet) telt als "geen antwoord": 0.
 */
export function statusVan(fout: unknown): number {
  if (fout && typeof fout === 'object' && 'status' in fout) {
    const status = (fout as { status: unknown }).status
    if (typeof status === 'number') return status
  }
  return 0
}
